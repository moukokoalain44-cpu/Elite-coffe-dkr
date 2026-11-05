import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const queryBuilder = {
    upsert: vi.fn(),
    select: vi.fn(),
    single: vi.fn(),
  };
  const storageBucket = {
    upload: vi.fn(),
    getPublicUrl: vi.fn(),
    remove: vi.fn(),
  };
  return {
    queryBuilder,
    storageBucket,
    from: vi.fn(),
    storageFrom: vi.fn(),
    getSession: vi.fn(),
  };
});

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { getSession: mocks.getSession },
    from: mocks.from,
    storage: { from: mocks.storageFrom },
  },
}));

import { adminSaveProduct, formatCatalogError } from "@/lib/catalog-admin";
import { MAX_MENU_IMAGE_BYTES, uploadMenuImage } from "@/lib/menu-images";

const imageUrl =
  "https://elite-coffee.supabase.co/storage/v1/object/public/menu-images/plats/cafe-test/test.png";
const storagePath = "plats/cafe-test/test.png";

function imageFile(type = "image/png", size = 32): File {
  return new File([new Uint8Array(size)], "cafe.png", { type });
}

function productInput(url: string) {
  return {
    id: "cafe-test",
    name: "Café test",
    category: "Cafés chauds",
    category_id: "cafes-chauds",
    price: 2000,
    description: "",
    price_options: [],
    availability_note: null,
    featured: false,
    image_url: url,
    is_visible: true,
    sort_order: 0,
  };
}

describe("menu image storage and database flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("crypto", { randomUUID: () => "test-uuid" });
    mocks.getSession.mockResolvedValue({
      data: { session: { access_token: "test-admin-token" } },
      error: null,
    });
    mocks.from.mockReturnValue(mocks.queryBuilder);
    mocks.storageFrom.mockReturnValue(mocks.storageBucket);
    mocks.queryBuilder.upsert.mockReturnValue(mocks.queryBuilder);
    mocks.queryBuilder.select.mockReturnValue(mocks.queryBuilder);
    mocks.queryBuilder.single.mockResolvedValue({
      data: { ...productInput(imageUrl), updated_at: "2026-11-03T00:00:00.000Z" },
      error: null,
    });
    mocks.storageBucket.upload.mockResolvedValue({ data: { path: storagePath }, error: null });
    mocks.storageBucket.getPublicUrl.mockReturnValue({ data: { publicUrl: imageUrl } });
    mocks.storageBucket.remove.mockResolvedValue({ data: [], error: null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uploads the image directly to Supabase Storage and resolves its public URL", async () => {
    await expect(uploadMenuImage(imageFile(), "cafe-test")).resolves.toBe(imageUrl);

    expect(mocks.getSession).toHaveBeenCalledTimes(1);
    expect(mocks.storageBucket.upload).toHaveBeenCalledWith(
      "plats/cafe-test/test-uuid.png",
      expect.any(File),
      { cacheControl: "3600", contentType: "image/png", upsert: false },
    );
    expect(mocks.storageBucket.getPublicUrl).toHaveBeenCalledWith(storagePath);
  });

  it("does not call the backend for unsupported or oversized files", async () => {
    await expect(uploadMenuImage(imageFile("image/gif"))).rejects.toThrow("MIME");
    await expect(uploadMenuImage(imageFile("image/png", MAX_MENU_IMAGE_BYTES + 1))).rejects.toThrow(
      "15 Mo",
    );
    expect(mocks.storageBucket.upload).not.toHaveBeenCalled();
  });

  it("does not upload without a valid admin session", async () => {
    mocks.getSession.mockResolvedValueOnce({ data: { session: null }, error: null });

    await expect(uploadMenuImage(imageFile())).rejects.toThrow("session administrateur");
    expect(mocks.storageBucket.upload).not.toHaveBeenCalled();
  });

  it("surfaces a Storage upload error without hiding its details", async () => {
    mocks.storageBucket.upload.mockResolvedValueOnce({
      data: null,
      error: {
        name: "StorageApiError",
        status: 413,
        statusCode: "413",
        message: "Payload Too Large",
      },
    });

    await expect(uploadMenuImage(imageFile())).rejects.toThrow("Payload Too Large");
  });

  it("preserves the HTTP status and SDK error name when Storage has no JSON error code", () => {
    const error = formatCatalogError("uploadMenuImage", "storage.objects", {
      name: "StorageApiError",
      status: 400,
      statusCode: "400",
      message: "HTTP 400 error",
    });

    expect(error.message).toContain("(HTTP_400): HTTP 400 error");
    expect(error.message).toContain("HTTP status: 400");
    expect(error.message).toContain("SDK error: StorageApiError");
    expect(error.message).not.toContain("UNKNOWN");
  });

  it("saves the uploaded public URL and category relation in menu_products", async () => {
    const uploadedUrl = await uploadMenuImage(imageFile(), "cafe-test");
    await adminSaveProduct(productInput(uploadedUrl));

    expect(mocks.from).toHaveBeenCalledWith("menu_products");
    expect(mocks.queryBuilder.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ image_url: imageUrl, category_id: "cafes-chauds" }),
      { onConflict: "id" },
    );
  });
});

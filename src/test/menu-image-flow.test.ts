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
  };
});

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: mocks.from,
    storage: { from: mocks.storageFrom },
  },
}));

import { adminSaveProduct } from "@/lib/catalog-admin";
import { uploadMenuImage } from "@/lib/menu-images";

const imageUrl =
  "https://elite-coffee.supabase.co/storage/v1/object/public/menu-images/plats/test.png";

function imageFile(type = "image/png", size = 32): File {
  return { type, size, name: "cafe.png" } as File;
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
    mocks.from.mockReturnValue(mocks.queryBuilder);
    mocks.storageFrom.mockReturnValue(mocks.storageBucket);
    mocks.queryBuilder.upsert.mockReturnValue(mocks.queryBuilder);
    mocks.queryBuilder.select.mockReturnValue(mocks.queryBuilder);
    mocks.queryBuilder.single.mockResolvedValue({
      data: { ...productInput(imageUrl), updated_at: "2026-11-03T00:00:00.000Z" },
      error: null,
    });
    mocks.storageBucket.upload.mockResolvedValue({ data: { path: "plats/test.png" }, error: null });
    mocks.storageBucket.getPublicUrl.mockReturnValue({ data: { publicUrl: imageUrl } });
    mocks.storageBucket.remove.mockResolvedValue({ data: [], error: null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uploads to menu-images and returns its public URL", async () => {
    await expect(uploadMenuImage(imageFile())).resolves.toBe(imageUrl);
    expect(mocks.storageFrom).toHaveBeenCalledWith("menu-images");
    expect(mocks.storageBucket.upload).toHaveBeenCalledWith(
      expect.stringMatching(/^plats\/\d+-test-uuid\.png$/),
      expect.objectContaining({ type: "image/png", size: 32 }),
      expect.objectContaining({ contentType: "image/png", upsert: false }),
    );
  });

  it("does not call Storage for unsupported or oversized files", async () => {
    await expect(uploadMenuImage(imageFile("image/gif"))).rejects.toThrow("MIME");
    await expect(uploadMenuImage(imageFile("image/png", 5 * 1024 * 1024 + 1))).rejects.toThrow(
      "5 Mo",
    );
    expect(mocks.storageBucket.upload).not.toHaveBeenCalled();
  });

  it("surfaces an RLS/storage permission error with the bucket context", async () => {
    mocks.storageBucket.upload.mockResolvedValueOnce({
      data: null,
      error: { code: "42501", message: "new row violates row-level security policy" },
    });

    await expect(uploadMenuImage(imageFile())).rejects.toThrow(
      "uploadMenuImage] storage.objects (bucket=menu-images) (42501)",
    );
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("saves the uploaded public URL and category relation in menu_products", async () => {
    const uploadedUrl = await uploadMenuImage(imageFile());
    await adminSaveProduct(productInput(uploadedUrl));

    expect(mocks.from).toHaveBeenCalledWith("menu_products");
    expect(mocks.queryBuilder.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ image_url: imageUrl, category_id: "cafes-chauds" }),
      { onConflict: "id" },
    );
  });
});

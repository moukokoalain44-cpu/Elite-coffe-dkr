import { afterEach, describe, expect, it, vi } from "vitest";
import { supabase, uploadMenuProductMedia } from "@/lib/supabase";

describe("catalog image upload flow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies the KeurGui menu-images upload contract", async () => {
    const upload = vi.fn().mockResolvedValue({ data: { path: "plats/test.png" }, error: null });
    const from = vi.spyOn(supabase.storage, "from").mockReturnValue({ upload } as never);
    const file = new File(["image bytes"], "cacao.png", { type: "image/png" });

    const path = await uploadMenuProductMedia(file);

    expect(path).toMatch(/^plats\/[^/]+\/[^/]+\.png$/);
    expect(from).toHaveBeenCalledWith("menu-images");
    expect(upload).toHaveBeenCalledWith(path, file, {
      cacheControl: "3600",
      contentType: "image/png",
      upsert: false,
    });
  });

  it("infers an allowed MIME from the extension when the browser MIME is empty", async () => {
    const upload = vi.fn().mockResolvedValue({ data: { path: "plats/test" }, error: null });
    vi.spyOn(supabase.storage, "from").mockReturnValue({ upload } as never);
    const file = new File(["image bytes"], "cacao.png", { type: "" });

    await uploadMenuProductMedia(file);

    expect(upload.mock.calls[0]?.[2]).toMatchObject({
      cacheControl: "3600",
      contentType: "image/png",
      upsert: false,
    });
  });

  it("rejects unsupported extensions before Storage", async () => {
    const upload = vi.fn();
    vi.spyOn(supabase.storage, "from").mockReturnValue({ upload } as never);
    const file = new File(["not an image"], "cacao.txt", { type: "" });

    await expect(uploadMenuProductMedia(file)).rejects.toThrow("Type MIME non pris en charge");
    expect(upload).not.toHaveBeenCalled();
  });

  it("rejects files over the post-optimization limit", async () => {
    const upload = vi.fn();
    vi.spyOn(supabase.storage, "from").mockReturnValue({ upload } as never);
    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "cacao.png", {
      type: "image/png",
    });

    await expect(uploadMenuProductMedia(file)).rejects.toThrow("limite de 10 Mo");
    expect(upload).not.toHaveBeenCalled();
  });
});

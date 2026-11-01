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

    expect(path).toMatch(/^plats\/\d+-[a-z0-9]{6}\.png$/);
    expect(from).toHaveBeenCalledWith("menu-images");
    expect(upload).toHaveBeenCalledWith(
      path,
      file,
      { cacheControl: "3600", contentType: "image/png", upsert: false },
    );
  });

  it("uses the browser MIME fallback exactly like KeurGui", async () => {
    const upload = vi.fn().mockResolvedValue({ data: { path: "plats/test" }, error: null });
    vi.spyOn(supabase.storage, "from").mockReturnValue({ upload } as never);
    const file = new File(["image bytes"], "cacao", { type: "" });

    await uploadMenuProductMedia(file);

    expect(upload.mock.calls[0]?.[2]).toMatchObject({
      cacheControl: "3600",
      contentType: "application/octet-stream",
      upsert: false,
    });
  });
});

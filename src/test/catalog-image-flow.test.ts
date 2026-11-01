import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@supabase/supabase-js";
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
    const body = upload.mock.calls[0]?.[1];

    expect(path).toMatch(/^plats\/[^/]+\/[^/]+\.png$/);
    expect(from).toHaveBeenCalledWith("menu-images");
    expect(body).toBeInstanceOf(ArrayBuffer);
    expect(Array.from(new Uint8Array(body as ArrayBuffer))).toEqual(
      Array.from(new TextEncoder().encode("image bytes")),
    );
    expect(upload).toHaveBeenCalledWith(path, body, {
      cacheControl: "3600",
      contentType: "image/png",
      upsert: false,
    });
  });

  it("sends raw ArrayBuffer bytes with the explicit MIME header through Storage SDK", async () => {
    let capturedBody: BodyInit | null | undefined;
    let capturedHeaders: Headers | undefined;
    const client = createClient("https://storage-test.supabase.co", "test-anon-key", {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: async (_input, init) => {
          capturedBody = init?.body;
          capturedHeaders = new Headers(init?.headers);
          return new Response(JSON.stringify({ Id: "test-id", Key: "menu-images/plats/test.webp" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        },
      },
    });
    const body = new TextEncoder().encode("webp fixture").buffer;

    const { error } = await client.storage.from("menu-images").upload("plats/test/test.webp", body, {
      cacheControl: "3600",
      contentType: "image/webp",
      upsert: false,
    });

    expect(error).toBeNull();
    expect(capturedBody).toBe(body);
    expect(capturedHeaders?.get("content-type")).toBe("image/webp");
    expect(capturedHeaders?.get("content-type")).not.toContain("multipart/form-data");
    expect(capturedHeaders?.get("cache-control")).toBe("max-age=3600");
    expect(capturedHeaders?.get("x-upsert")).toBe("false");
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

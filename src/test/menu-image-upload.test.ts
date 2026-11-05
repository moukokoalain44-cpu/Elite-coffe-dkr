import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMenuImageUploadApp } from "../../api/menu-images";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

type MultipartPart = {
  name: string;
  value: string | Buffer;
  filename?: string;
  contentType?: string;
};

let server: Server | undefined;

afterEach(async () => {
  if (server?.listening) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => (error ? reject(error) : resolve()));
    });
  }
  server = undefined;
});

function makeMultipart(parts: MultipartPart[]) {
  const boundary = "----elite-coffee-multer-test-boundary";
  const chunks: Buffer[] = [];
  for (const part of parts) {
    const fileName = part.filename ? `; filename="${part.filename}"` : "";
    chunks.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${part.name}"${fileName}\r\n${part.contentType ? `Content-Type: ${part.contentType}\r\n` : ""}\r\n`,
      ),
    );
    chunks.push(typeof part.value === "string" ? Buffer.from(part.value) : part.value);
    chunks.push(Buffer.from("\r\n"));
  }
  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  return { boundary, body: Buffer.concat(chunks) };
}

async function startApp(app: ReturnType<typeof createMenuImageUploadApp>) {
  server = createServer(app);
  await new Promise<void>((resolve, reject) => {
    server?.once("error", reject);
    server?.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}/api/menu-images`;
}

async function postMultipart(url: string, parts: MultipartPart[], accessToken?: string) {
  const { boundary, body } = makeMultipart(parts);
  const headers: Record<string, string> = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    "Content-Length": String(body.length),
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(url, { method: "POST", headers, body });
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

function validImageParts() {
  return [
    { name: "productId", value: "chocolat-chaud" },
    {
      name: "image",
      filename: "chocolat.png",
      contentType: "image/png",
      value: Buffer.concat([PNG_SIGNATURE, Buffer.from("fixture bytes")]),
    },
  ] satisfies MultipartPart[];
}

describe("Express/Multer menu image route", () => {
  it("accepts the image field and returns the relative Storage path", async () => {
    const context = { admin: true };
    const authenticate = vi.fn(async (token: string) => (token === "valid-token" ? context : null));
    const store = vi.fn(
      async (_context: typeof context, _file, productId: string) => `plats/${productId}/stored.png`,
    );
    const url = await startApp(createMenuImageUploadApp({ authenticate, store }));

    const result = await postMultipart(url, validImageParts(), "valid-token");

    expect(result.status).toBe(201);
    expect(result.body["path"]).toBe("plats/chocolat-chaud/stored.png");
    expect(authenticate).toHaveBeenCalledWith("valid-token");
    expect(store).toHaveBeenCalledTimes(1);
    const [storedContext, file, productId] = store.mock.calls[0]!;
    expect(storedContext).toBe(context);
    expect(productId).toBe("chocolat-chaud");
    expect(file.mimetype).toBe("image/png");
    expect(file.originalname).toBe("chocolat.png");
    expect(file.buffer).toEqual(Buffer.concat([PNG_SIGNATURE, Buffer.from("fixture bytes")]));
  });

  it("rejects missing authentication before parsing/storing the file", async () => {
    const authenticate = vi.fn(async () => null);
    const store = vi.fn(async () => "unused");
    const url = await startApp(createMenuImageUploadApp({ authenticate, store }));

    const result = await postMultipart(url, validImageParts());

    expect(result.status).toBe(401);
    expect(authenticate).not.toHaveBeenCalled();
    expect(store).not.toHaveBeenCalled();
  });

  it("rejects a multipart file whose key is not exactly image", async () => {
    const authenticate = vi.fn(async () => ({ admin: true }));
    const store = vi.fn(async () => "unused");
    const url = await startApp(createMenuImageUploadApp({ authenticate, store }));
    const parts = validImageParts().map((part) =>
      part.name === "image" ? { ...part, name: "photo" } : part,
    );

    const result = await postMultipart(url, parts, "valid-token");

    expect(result.status).toBe(400);
    expect(store).not.toHaveBeenCalled();
  });

  it("rejects bytes whose signature does not match the declared image MIME", async () => {
    const authenticate = vi.fn(async () => ({ admin: true }));
    const store = vi.fn(async () => "unused");
    const url = await startApp(createMenuImageUploadApp({ authenticate, store }));
    const parts = validImageParts().map((part) =>
      part.name === "image" ? { ...part, value: Buffer.from("not a png") } : part,
    );

    const result = await postMultipart(url, parts, "valid-token");

    expect(result.status).toBe(415);
    expect(store).not.toHaveBeenCalled();
  });

  it("enforces the 15 MiB Multer file-size limit", async () => {
    const authenticate = vi.fn(async () => ({ admin: true }));
    const store = vi.fn(async () => "unused");
    const url = await startApp(createMenuImageUploadApp({ authenticate, store }));
    const parts: MultipartPart[] = [
      {
        name: "image",
        filename: "large.png",
        contentType: "image/png",
        value: Buffer.concat([PNG_SIGNATURE, Buffer.alloc(15 * 1024 * 1024)]),
      },
    ];

    const result = await postMultipart(url, parts, "valid-token");

    expect(result.status).toBe(413);
    expect(result.body["error"]).toContain("15 Mo");
    expect(store).not.toHaveBeenCalled();
  });
});

import { randomUUID } from "node:crypto";
import express, { type ErrorRequestHandler } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "menu-images";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const ALLOWED_MIME_TYPES = new Set(Object.keys(MIME_EXTENSIONS));

export type MenuImageUploadDependencies<Context> = {
  authenticate: (accessToken: string) => Promise<Context | null>;
  store: (context: Context, file: Express.Multer.File, productId: string) => Promise<string>;
};

class UnsupportedImageTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedImageTypeError";
  }
}

function hasExpectedImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }
  if (mimeType === "image/avif") {
    const brand = buffer.toString("ascii", 8, 12);
    return (
      buffer.length >= 12 &&
      buffer.toString("ascii", 4, 8) === "ftyp" &&
      (brand === "avif" || brand === "avis")
    );
  }
  return false;
}

function getSupabaseClient(accessToken: string) {
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_ANON_KEY"] ??
    process.env["VITE_SUPABASE_ANON_KEY"] ??
    process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) {
    throw new Error("Variables serveur SUPABASE_URL et SUPABASE_ANON_KEY manquantes.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export function createMenuImageUploadApp<Context>(
  dependencies: MenuImageUploadDependencies<Context>,
) {
  const app = express();
  app.disable("x-powered-by");

  const parseMultipart = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 1, parts: 2 },
    fileFilter: (_request, file, callback) => {
      if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        callback(new UnsupportedImageTypeError("Format accepté : JPG, PNG, WebP ou AVIF."));
        return;
      }
      callback(null, true);
    },
  }).single("image");

  app.use((request, response, next) => {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      response.status(405).json({ error: "Méthode non autorisée." });
      return;
    }
    if (!request.is("multipart/form-data")) {
      response.status(415).json({ error: "Envoyez l’image au format multipart/form-data." });
      return;
    }

    const accessToken = /^Bearer\s+(.+)$/i.exec(request.get("authorization") ?? "")?.[1]?.trim();
    if (!accessToken) {
      response.status(401).json({ error: "Authentification requise." });
      return;
    }

    void dependencies
      .authenticate(accessToken)
      .then((context) => {
        if (context === null) {
          response.status(401).json({ error: "Session Supabase invalide ou expirée." });
          return;
        }
        response.locals["menuImageUploadContext"] = context;
        parseMultipart(request, response, (error) => {
          if (error) next(error);
          else next();
        });
      })
      .catch(next);
  });

  app.use(async (request, response, next) => {
    try {
      const file = request.file;
      if (!file) {
        response.status(400).json({ error: "Le champ fichier attendu est « image »." });
        return;
      }
      if (!hasExpectedImageSignature(file.buffer, file.mimetype)) {
        response
          .status(415)
          .json({ error: "Le contenu du fichier ne correspond pas à son type MIME." });
        return;
      }

      const rawProductId = request.body?.productId;
      let productId: string = randomUUID();
      if (rawProductId !== undefined) {
        if (typeof rawProductId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(rawProductId)) {
          response.status(400).json({ error: "Identifiant de plat invalide." });
          return;
        }
        productId = rawProductId;
      }

      const context = response.locals["menuImageUploadContext"] as Context | undefined;
      if (context === undefined) {
        response.status(401).json({ error: "Authentification requise." });
        return;
      }

      const path = await dependencies.store(context, file, productId);
      console.info(`[menu-images] Upload réussi: ${path} (${file.size} octets)`);
      response.status(201).json({ path });
    } catch (error) {
      next(error);
    }
  });

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof multer.MulterError) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      response.status(status).json({
        error:
          error.code === "LIMIT_FILE_SIZE"
            ? "L’image dépasse la limite de 15 Mo."
            : "Formulaire multipart invalide; le champ fichier doit être « image ». ",
      });
      return;
    }
    if (error instanceof UnsupportedImageTypeError) {
      response.status(415).json({ error: error.message });
      return;
    }

    const message = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("[menu-images] Échec de l’upload:", message);
    const upstreamStatus =
      error && typeof error === "object" && "status" in error ? Number(error.status) : 0;
    const status = [400, 401, 403, 413, 415].includes(upstreamStatus) ? upstreamStatus : 502;
    response
      .status(status)
      .json({ error: "Échec de l’upload vers Supabase Storage.", details: message });
  };
  app.use(errorHandler);

  return app;
}

type SupabaseContext = ReturnType<typeof getSupabaseClient>;

const menuImageUploadApp = createMenuImageUploadApp<SupabaseContext>({
  authenticate: async (accessToken) => {
    const client = getSupabaseClient(accessToken);
    const { data, error } = await client.auth.getUser(accessToken);
    return error || !data.user ? null : client;
  },
  store: async (client, file, productId) => {
    const extension = MIME_EXTENSIONS[file.mimetype];
    if (!extension) throw new UnsupportedImageTypeError("Type d’image non accepté.");

    const path = `plats/${productId}/${randomUUID()}.${extension}`;
    const { data, error } = await client.storage.from(BUCKET).upload(path, file.buffer, {
      cacheControl: "3600",
      contentType: file.mimetype,
      upsert: false,
    });
    if (error) throw error;
    return data.path;
  },
});

// Vercel doit laisser Multer lire le flux multipart brut de la requête.
export const config = { api: { bodyParser: false } };
export default menuImageUploadApp;

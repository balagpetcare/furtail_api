const crypto = require("crypto");
const fs = require("fs");

const prisma = require("../../../../infrastructure/db/prismaClient");
const {
  getStorageProvider,
} = require("../../../../infrastructure/storage/storage.factory");
const appConfig = require("../../../../config/appConfig");
const {
  buildPublicMediaUrl,
  resolveClientMediaUrl,
} = require("../../../../shared/storage/publicMediaUrl");

function createUploadError(statusCode, code, message, meta?) {
  const err = new Error(message) as Error & {
    statusCode?: number;
    code?: string;
    meta?: any;
  };
  err.statusCode = statusCode;
  err.code = code;
  if (meta !== undefined) err.meta = meta;
  return err;
}

function extFromName(name) {
  const n = String(name || "");
  const m = n.match(/\.([a-zA-Z0-9]+)$/);
  if (!m) return "";
  return "." + m[1].toLowerCase();
}

function guessMimeFromExt(ext) {
  const e = String(ext || "").toLowerCase();
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  if (e === ".mp4") return "video/mp4";
  if (e === ".mov") return "video/quicktime";
  if (e === ".pdf") return "application/pdf";
  if (e === ".txt") return "text/plain";
  return "application/octet-stream";
}

function extFromMime(mime) {
  if (!mime) return "";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  if (mime === "video/mp4") return ".mp4";
  if (mime === "video/quicktime") return ".mov";
  if (mime === "application/pdf") return ".pdf";
  return "";
}

function mediaTypeFromMime(mime, originalname) {
  const m = String(mime || "").toLowerCase();
  if (m.startsWith("video/")) return "VIDEO";
  if (m.startsWith("image/")) return "IMAGE";
  // fall back to extension when content-type is generic
  const ext = extFromName(originalname);
  if ([".mp4", ".mov", ".m4v", ".avi", ".mkv"].includes(ext)) return "VIDEO";
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"].includes(ext))
    return "IMAGE";
  return "FILE";
}

function buildKey({
  ownerUserId,
  folder,
  mimeType,
  originalname,
  countryCode,
}) {
  const rand = crypto.randomBytes(10).toString("hex");
  const ext = extFromMime(mimeType) || extFromName(originalname);
  const prefix =
    appConfig.storage.useCountryPrefix && countryCode
      ? `${String(countryCode).toUpperCase().slice(0, 2)}/`
      : "";
  return `${prefix}${folder}/${ownerUserId}/${Date.now()}_${rand}${ext}`;
}

async function storageObjectExists(key) {
  return getStorageProvider().objectExists(key);
}

function withResolvedUrl(media) {
  if (!media) return media;
  return {
    ...media,
    url: resolveClientMediaUrl({ url: media.url, key: media.key }),
    hlsUrl: media.hlsUrl
      ? resolveClientMediaUrl({ url: media.hlsUrl, key: media.hlsKey ?? null })
      : media.hlsUrl,
  };
}

async function computeFileHash(file) {
  if (file.buffer) {
    return crypto.createHash("sha256").update(file.buffer).digest("hex");
  }
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(file.path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (err) => reject(err));
  });
}

async function uploadToStorage({ file, buffer, mimeType, key, originalname }) {
  // Some clients send application/octet-stream; storage UI preview needs a real content-type.
  let ct = mimeType;
  if (!ct || ct === "application/octet-stream") {
    ct = guessMimeFromExt(extFromName(originalname));
  }

  let body;
  if (buffer) {
    body = buffer;
  } else if (file && file.path) {
    body = fs.createReadStream(file.path);
  } else {
    throw new Error("No buffer or file path provided for S3 upload");
  }

  try {
    await getStorageProvider().putObject({
      key,
      body,
      contentType: ct,
    });
    return buildPublicMediaUrl(key);
  } catch (error) {
    throw createUploadError(
      502,
      "STORAGE_UPLOAD_FAILED",
      "Media storage upload failed.",
      {
        key,
        contentType: ct,
        originalname,
        provider: getStorageProvider().config?.provider,
        bucket: getStorageProvider().config?.bucketName,
        reason: error?.message || String(error),
      },
    );
  }
}

async function deleteFromStorage(key) {
  try {
    await getStorageProvider().deleteObject(key);
  } catch (error) {
    throw createUploadError(
      502,
      "STORAGE_DELETE_FAILED",
      "Media storage delete failed.",
      {
        key,
        provider: getStorageProvider().config?.provider,
        bucket: getStorageProvider().config?.bucketName,
        reason: error?.message || String(error),
      },
    );
  }
}

/**
 * Standard upload helper used across the app.
 * - Stores file in S3/MinIO
 * - Creates Media row
 * - Computes a content hash so we can later reuse/deduplicate files
 */
exports.uploadAndCreateMedia = async ({
  ownerUserId,
  file,
  folder = "media",
  type,
  countryCode,
  metadata = {},
}) => {
  if (!file?.buffer && !file?.path) {
    throw createUploadError(
      400,
      "UPLOAD_FILE_MISSING",
      "File buffer or path missing",
    );
  }

  const cleanup = () => {
    if (file.path) {
      try {
        fs.unlinkSync(file.path);
      } catch (_) {}
    }
  };

  try {
    const mimeType = file.mimetype;
    const originalname = file.originalname || "upload";
    const sizeBytes =
      file.size ||
      file.buffer?.length ||
      (file.path ? fs.statSync(file.path).size : 0);

    // Compute hash for possible reuse/deduplication
    const hash = await computeFileHash(file);

    const mediaType = type || mediaTypeFromMime(mimeType, originalname);
    const existing = await prisma.media.findFirst({
      where: {
        hash,
        ownerUserId: Number(ownerUserId),
        deletedAt: null,
      },
    });
    const hashConflict = existing
      ? null
      : await prisma.media.findFirst({
          where: {
            hash,
            ownerUserId: { not: Number(ownerUserId) },
            deletedAt: null,
          },
          select: { id: true, ownerUserId: true },
        });

    if (existing) {
      const existsInStorage = existing.key
        ? await storageObjectExists(existing.key)
        : false;
      if (existsInStorage) {
        const resolvedUrl = buildPublicMediaUrl(existing.key);
        if (resolvedUrl !== existing.url) {
          const updated = await prisma.media.update({
            where: { id: existing.id },
            data: { url: resolvedUrl },
          });
          cleanup();
          return withResolvedUrl(updated);
        }
        cleanup();
        return withResolvedUrl(existing);
      }

      const repairKey = buildKey({
        ownerUserId,
        folder,
        mimeType,
        originalname,
        countryCode,
      });
      const repairUrl = await uploadToStorage({
        file,
        buffer: file.buffer,
        mimeType,
        key: repairKey,
        originalname,
      });
      const repaired = await prisma.media.update({
        where: { id: existing.id },
        data: {
          url: repairUrl,
          key: repairKey,
          type: mediaType,
          mimeType,
          sizeBytes,
          altText: originalname,
          ...metadata,
        },
      });
      cleanup();
      return withResolvedUrl(repaired);
    }

    const key = buildKey({
      ownerUserId,
      folder,
      mimeType,
      originalname,
      countryCode,
    });
    const url = await uploadToStorage({
      file,
      buffer: file.buffer,
      mimeType,
      key,
      originalname,
    });

    const media = await prisma.media.create({
      data: {
        url,
        key,
        type: mediaType,
        ownerUserId: Number(ownerUserId),
        mimeType,
        sizeBytes,
        hash: hashConflict ? null : hash,
        altText: originalname,
        ...metadata,
      },
    });

    cleanup();
    return withResolvedUrl(media);
  } catch (err) {
    cleanup();
    throw err;
  }
};

exports.listMyMedia = async (ownerUserId) => {
  const rows = await prisma.media.findMany({
    where: { ownerUserId: Number(ownerUserId), deletedAt: null },
    orderBy: { id: "desc" },
  });
  return rows.map(withResolvedUrl);
};

exports.deleteMyMedia = async ({ ownerUserId, mediaId }) => {
  const id = Number(mediaId);

  const media = await prisma.media.findFirst({
    where: { id, ownerUserId: Number(ownerUserId), deletedAt: null },
  });

  if (!media) {
    const err = new Error("Media not found");
    (err as any).statusCode = 404;
    throw err;
  }

  // Delete from storage if key exists
  await deleteFromStorage(media.key);

  // Soft delete to keep references safe
  await prisma.media.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { deleted: true };
};

exports.computeFileHash = computeFileHash;
exports.uploadToStorage = uploadToStorage;
exports.withResolvedUrl = withResolvedUrl;
exports.deleteFromStorage = deleteFromStorage;

export {};

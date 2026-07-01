require("dotenv").config();

const API_VERSION = process.env.API_VERSION || "v1";

function boolEnv(name, def = false) {
  const v = process.env[name];
  if (v == null) return def;
  return String(v).toLowerCase() === "true" || String(v) === "1";
}

// Log effective upload limits once at startup — useful for spotting .env misconfigurations.
const _effectiveMaxUploadMb = Math.round(
  Number(process.env.MAX_UPLOAD_BYTES || 200 * 1024 * 1024) / (1024 * 1024)
);
const _effectiveMaxAdoptionVideoMb = Math.round(
  Number(process.env.MAX_ADOPTION_VIDEO_BYTES || 1024 * 1024 * 1024) / (1024 * 1024)
);
// eslint-disable-next-line no-console
console.log(
  `[AppConfig] MAX_UPLOAD_BYTES=${process.env.MAX_UPLOAD_BYTES ?? "(not set, using 200MB default)"} → effective limit: ${_effectiveMaxUploadMb}MB`
);
// eslint-disable-next-line no-console
console.log(
  `[AppConfig] MAX_ADOPTION_VIDEO_BYTES=${process.env.MAX_ADOPTION_VIDEO_BYTES ?? "(not set, using 1GB default)"} → effective limit: ${_effectiveMaxAdoptionVideoMb}MB`
);

module.exports = {
  server: {
    port: Number(process.env.PORT || 3000),
    host: process.env.HOST || "localhost",
  },

  api: {
    version: API_VERSION,
    prefix: `/api/${API_VERSION}`, // /api/v1
  },

  jwt: {
    secret: process.env.JWT_SECRET || "super-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  storage: (() => {
    const { resolveStorageConfig } = require("../infrastructure/storage/storage.config");
    const cfg = resolveStorageConfig();
    return {
      provider: cfg.provider,
      region: cfg.region,
      bucketName: cfg.bucketName,
      useCountryPrefix: cfg.useCountryPrefix,
      endpoint: cfg.endpoint,
      publicUrl: cfg.publicUrl,
      forcePathStyle: cfg.forcePathStyle,
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    };
  })(),

  mediaPolicy: {
    // General upload limit for posts/reels (200 MB default).
    // Override with MAX_UPLOAD_BYTES env var (value in bytes).
    maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES || 200 * 1024 * 1024),
    // Adoption video upload limit (1 GB default).
    // Override with MAX_ADOPTION_VIDEO_BYTES env var (value in bytes).
    maxAdoptionVideoBytes: Number(process.env.MAX_ADOPTION_VIDEO_BYTES || 1024 * 1024 * 1024),
    imageMaxSide: Number(process.env.IMAGE_MAX_SIDE || 1600),
    imageJpegQuality: Number(process.env.IMAGE_JPEG_QUALITY || 82),
    transcodeVideo: String(process.env.VIDEO_TRANSCODE || "false").toLowerCase() === "true",
  },
};

export {};

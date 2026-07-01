const prisma = require("../infrastructure/db/prismaClient");
const { getStorageProvider } = require("../infrastructure/storage/storage.factory");

// Allowed origins for CORS on file responses (Next.js panels on different ports).
// CORP cross-origin is required so <img src="http://localhost:3000/api/v1/files/..."> from
// http://localhost:3104 (owner app) is not blocked by ERR_BLOCKED_BY_RESPONSE.NotSameOrigin.
const FILE_ALLOWED_ORIGINS = [
  "http://localhost:3100",
  "http://localhost:3101",
  "http://localhost:3102",
  "http://localhost:3103",
  "http://localhost:3104",
  "http://localhost:3105",
  ...String(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
];

function setFileResponseCorsHeaders(req, res, origin) {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const allowed = FILE_ALLOWED_ORIGINS.length ? FILE_ALLOWED_ORIGINS : [origin].filter(Boolean);
  const echo = origin && allowed.includes(origin) ? origin : allowed[0] || "*";
  res.setHeader("Access-Control-Allow-Origin", echo);
}

function resolveFileViewer(req) {
  if (req.user?.id) {
    return { userId: Number(req.user.id), role: String(req.user.role || "").toUpperCase() };
  }
  if (req.fileViewAuth?.userId) {
    return {
      userId: Number(req.fileViewAuth.userId),
      role: String(req.fileViewAuth.role || "").toUpperCase(),
      fileKey: req.fileViewAuth.fileKey,
    };
  }
  return null;
}

async function streamFileByKey(req, res, next) {
  try {
    const rawKey = req.params[0];
    const key = decodeURIComponent(rawKey);

    const viewer = resolveFileViewer(req);
    if (!viewer?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (viewer.fileKey && String(viewer.fileKey) !== String(key)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const doc = await prisma.ownerKycDocument.findFirst({
      where: {
        media: { key },
      },
      select: {
        id: true,
        ownerKyc: { select: { userId: true } },
        media: { select: { key: true, type: true, mimeType: true } },
      },
    });

    if (!doc) {
      return res.status(404).json({ message: "File not found" });
    }

    const role = viewer.role || "";
    const isAdmin = role.includes("ADMIN");

    if (!isAdmin && String(doc.ownerKyc.userId) !== String(viewer.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const storage = getStorageProvider();

    // ── Parse Range header ──────────────────────────────────────────
    const rangeHeader = req.headers.range;
    let range;
    if (rangeHeader) {
      const match = String(rangeHeader).match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : undefined;
        // Request up to 10MB per range request to limit S3 transfer
        range = {
          start,
          end: end ?? (start + 10 * 1024 * 1024 - 1),
        };
      }
    }

    const s3Response = await storage.getObject(key, range);

    // ── Caching headers (media is immutable: key-based URLs) ────────
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Accept-Ranges", "bytes");

    // Content-Type
    const contentType =
      doc.media.mimeType || doc.media.type || s3Response.contentType || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    // Content-Disposition
    const download = String(req.query.download || "") === "1";
    const filename = key.split("/").pop() || "file";
    res.setHeader(
      "Content-Disposition",
      `${download ? "attachment" : "inline"}; filename="${filename}"`
    );

    setFileResponseCorsHeaders(req, res, req.headers.origin);

    // ── Range / Full response ───────────────────────────────────────
    if (range) {
      res.status(206);
      if (s3Response.contentLength != null) {
        res.setHeader("Content-Length", s3Response.contentLength);
      }
      if (s3Response.contentRange) {
        res.setHeader("Content-Range", s3Response.contentRange);
      }
    } else {
      if (s3Response.contentLength != null) {
        res.setHeader("Content-Length", s3Response.contentLength);
      }
    }

    s3Response.body.pipe(res);
  } catch (err) {
    next(err);
  }
}

function optionsFileCors(req, res) {
  setFileResponseCorsHeaders(req, res, req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).end();
}

module.exports = { streamFileByKey, optionsFileCors };

export {};

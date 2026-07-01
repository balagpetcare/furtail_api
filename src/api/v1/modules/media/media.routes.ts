const router = require("express").Router();
const multer = require("multer");

const auth = require("../../../../middleware/auth.middleware");
const requireAdmin = require("../../../../middleware/admin.middleware");
const media = require("./media.controller");
const appConfig = require("../../../../config/appConfig");

const os = require("os");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, os.tmpdir());
    },
    filename: (req, file, cb) => {
      const rand = require("crypto").randomBytes(16).toString("hex");
      cb(null, `bpa_upload_${Date.now()}_${rand}${path.extname(file.originalname || "")}`);
    },
  }),
  limits: {
    // Use the larger of the two limits to defer actual validation to the controller.
    // This allows the controller to enforce context-specific limits (adoption vs posts).
    // Multer can't access request body to determine context, so we set a permissive limit here.
    fileSize: Math.max(
      Number(appConfig.mediaPolicy?.maxUploadBytes || 200 * 1024 * 1024),
      Number(appConfig.mediaPolicy?.maxAdoptionVideoBytes || 1024 * 1024 * 1024),
    ),
  },
});

// POST /api/v1/media/upload
// Compatible field names:
// - file (recommended)
// - media (legacy)
// - files / files[] (multiple)
router.post("/upload", auth, upload.any(), media.uploadMedia);

// GET /api/v1/media/my
router.get("/my", auth, media.myMedia);

// POST /api/v1/media/requeue-unprocessed-videos
// Admin/manual retry for videos that uploaded but were not processed yet.
router.post("/requeue-unprocessed-videos", auth, requireAdmin, media.requeueUnprocessedVideos);

// DELETE /api/v1/media/:id
router.delete("/:id", auth, media.delete);

module.exports = router;

export {};

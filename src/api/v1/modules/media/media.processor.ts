// NOTE: This module lives at: src/api/v1/modules/media/
// To reach src/config/appConfig.js we need 4 levels up.
const appConfig = require('../../../../config/appConfig');

// Standard media processing (image optimize + optional video transcode)
const sharp = require('sharp');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

// Video transcode is optional. It needs `fluent-ffmpeg` + an ffmpeg binary.
let ffmpeg;
let ffmpegPath;

function loadFfmpeg() {
  if (ffmpeg) return { ffmpeg, ffmpegPath };
  try {
    ffmpeg = require('fluent-ffmpeg');
    // prefer env override, else ffmpeg-static
    ffmpegPath = process.env.FFMPEG_PATH || null;
    if (!ffmpegPath) {
      try {
        ffmpegPath = require('ffmpeg-static');
      } catch (_) {
        ffmpegPath = null;
      }
    }
    if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);
    return { ffmpeg, ffmpegPath };
  } catch (_) {
    return { ffmpeg: null, ffmpegPath: null };
  }
}

function isImage(mime) {
  return String(mime || '').toLowerCase().startsWith('image/');
}

function isVideo(mime, originalname) {
  const m = String(mime || '').toLowerCase();
  if (m.startsWith('video/')) return true;
  const n = String(originalname || '').toLowerCase();
  return n.endsWith('.mp4') || n.endsWith('.mov') || n.endsWith('.m4v') || n.endsWith('.avi') || n.endsWith('.mkv');
}

type OptimizeImageOpts = { maxSide?: number; quality?: number };
async function optimizeImage(file, opts: OptimizeImageOpts = {}) {
  const maxSide = Number(opts.maxSide || appConfig.mediaPolicy?.imageMaxSide || process.env.IMAGE_MAX_SIDE || 1600);
  const quality = Number(opts.quality || appConfig.mediaPolicy?.imageJpegQuality || process.env.IMAGE_JPEG_QUALITY || 82);
  let outBuf;
  const input = file.buffer || file.path;
  if (!input) return file;

  try {
    outBuf = await sharp(input)
      .rotate()
      .resize(maxSide, maxSide, { fit: 'inside' })
      .jpeg({ quality })
      .toBuffer();

    if (file.path) {
      try { fs.unlinkSync(file.path); } catch (_) {}
      delete file.path;
    }
  } catch (err) {
    console.warn('optimizeImage skipped: sharp could not process uploaded image', {
      mimetype: file?.mimetype,
      originalname: file?.originalname,
      size: file?.size || file?.buffer?.length || 0,
      message: err?.message || String(err),
    });
    return file;
  }

  const base = (file.originalname || 'image').replace(/\.[^/.]+$/, '');
  return {
    ...file,
    buffer: outBuf,
    mimetype: 'image/jpeg',
    originalname: `${base}.jpg`,
  };
}

type TranscodeVideoOpts = { maxInputMb?: number };
async function transcodeVideoIfEnabled(file, opts: TranscodeVideoOpts = {}) {
  // Video transcoding is handled asynchronously by the background media worker.
  // Return the raw uploaded file structure as-is.
  return file;
}

async function processUploadFile(file) {
  if (!file) return file;
  if (isImage(file.mimetype)) {
    return optimizeImage(file);
  }
  if (isVideo(file.mimetype, file.originalname)) {
    return transcodeVideoIfEnabled(file);
  }
  return file;
}

function makeInvalidImagePayloadError(cause?: unknown) {
  const e = new Error("INVALID_IMAGE_PAYLOAD") as Error & { code?: string; cause?: unknown };
  e.code = "INVALID_IMAGE_PAYLOAD";
  if (cause !== undefined) e.cause = cause;
  return e;
}

/**
 * Profile avatar pipeline: square cover crop + WebP for predictable small objects.
 * Input may already be cropped client-side (typically JPEG/PNG); this normalizes server-side.
 * Env: PROFILE_PHOTO_MAX_SIDE (default 512), PROFILE_PHOTO_WEBP_QUALITY (default 82).
 * Throws Error with code INVALID_IMAGE_PAYLOAD if input cannot be decoded or processed.
 */
async function optimizeProfilePhotoFile(file) {
  if (!file?.buffer && !file?.path) return file;
  const maxSide = Number(process.env.PROFILE_PHOTO_MAX_SIDE || 512);
  const quality = Number(process.env.PROFILE_PHOTO_WEBP_QUALITY || 82);
  const input = file.buffer || file.path;

  let meta;
  try {
    meta = await sharp(input).metadata();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('optimizeProfilePhotoFile: input failed metadata probe', {
        mimetype: file?.mimetype,
        originalname: file?.originalname,
        size: file?.size || file?.buffer?.length || 0,
        message: err?.message || String(err),
      });
    }
    throw makeInvalidImagePayloadError(err);
  }
  if (!meta.width || !meta.height) {
    throw makeInvalidImagePayloadError();
  }

  let outBuf;
  try {
    outBuf = await sharp(input)
      .rotate()
      .resize(maxSide, maxSide, { fit: 'cover', position: 'attention' })
      .webp({ quality })
      .toBuffer();

    if (file.path) {
      try { fs.unlinkSync(file.path); } catch (_) {}
      delete file.path;
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('optimizeProfilePhotoFile: sharp pipeline failed', {
        mimetype: file?.mimetype,
        originalname: file?.originalname,
        size: file?.size || file?.buffer?.length || 0,
        message: err?.message || String(err),
      });
    }
    throw makeInvalidImagePayloadError(err);
  }
  const base = (file.originalname || 'avatar').replace(/\.[^/.]+$/, '');
  return {
    ...file,
    buffer: outBuf,
    mimetype: 'image/webp',
    originalname: `${base}.webp`,
    size: outBuf.length,
  };
}

module.exports = { processUploadFile, isImage, isVideo, optimizeProfilePhotoFile };

export {};

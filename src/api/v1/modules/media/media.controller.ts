const mediaService = require("./media.service");
const { processUploadFile, isVideo } = require("./media.processor");
const prisma = require("../../../../infrastructure/db/prismaClient");
const appConfig = require("../../../../config/appConfig");
const {
  addVideoProcessingJob,
  isVideoProcessingEnabled,
} = require("../../../../common/queue/queues");
const { Prisma } = require("@prisma/client");

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

function toOptionalInt(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function toOptionalFloat(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function toOptionalBool(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (value === true || value === "true" || value === 1 || value === "1")
    return true;
  if (value === false || value === "false" || value === 0 || value === "0")
    return false;
  return undefined;
}

function pickVideoEditMetadata(body: Record<string, any> = {}) {
  const metadata = {
    trimStartMs: toOptionalInt(body.trimStartMs),
    trimEndMs: toOptionalInt(body.trimEndMs),
    mute: toOptionalBool(body.mute),
    volume: toOptionalFloat(body.volume),
    coverTimestampMs: toOptionalInt(body.coverTimestampMs),
    aspectRatio:
      body.aspectRatio === undefined ||
      body.aspectRatio === null ||
      body.aspectRatio === ""
        ? undefined
        : String(body.aspectRatio),
    quality:
      body.quality === undefined || body.quality === null || body.quality === ""
        ? undefined
        : String(body.quality),
  };
  return Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => value !== undefined),
  );
}

function pickFiles(req) {
  if (Array.isArray(req.files) && req.files.length) return req.files;

  if (req.files && typeof req.files === "object") {
    const a = [];
    for (const k of Object.keys(req.files)) {
      const v = req.files[k];
      if (Array.isArray(v)) a.push(...v);
    }
    if (a.length) return a;
  }

  if (req.file) return [req.file];
  return [];
}

function logUpload(stage, payload) {
  console.info("[media/upload]", {
    stage,
    ...payload,
  });
}

function validateFileSize(file, adoptionContext, appConfig) {
  const fileSizeMb = file.size / (1024 * 1024);
  const maxUploadMb = appConfig.mediaPolicy?.maxUploadBytes / (1024 * 1024) || 200;
  const maxAdoptionVideoMb = appConfig.mediaPolicy?.maxAdoptionVideoBytes / (1024 * 1024) || 1024;

  const isAdoptionContext = adoptionContext?.isAdoptionContext === true;
  const isVideo = file.mimetype && (
    file.mimetype.toLowerCase().startsWith('video/') ||
    /\.(mp4|mov|m4v|avi|mkv)$/i.test(file.originalname || '')
  );

  if (isAdoptionContext && isVideo) {
    if (file.size > appConfig.mediaPolicy?.maxAdoptionVideoBytes) {
      return createUploadError(
        413,
        "FILE_TOO_LARGE",
        `Adoption video is too large. Maximum allowed size is ${maxAdoptionVideoMb}MB.`,
        {
          fileSizeMb: Math.round(fileSizeMb * 100) / 100,
          maxSizeMb: maxAdoptionVideoMb,
          mediaType: "VIDEO",
          context: "ADOPTION",
        }
      );
    }
  } else if (isAdoptionContext) {
    // Adoption images are OK (backend compresses them anyway).
    return null;
  } else {
    // Posts/general upload - enforce 200MB limit
    if (file.size > appConfig.mediaPolicy?.maxUploadBytes) {
      return createUploadError(
        413,
        "FILE_TOO_LARGE",
        `File is too large. Maximum allowed size is ${maxUploadMb}MB.`,
        {
          fileSizeMb: Math.round(fileSizeMb * 100) / 100,
          maxSizeMb: maxUploadMb,
          mediaType: isVideo ? "VIDEO" : "IMAGE",
          context: "POSTS",
        }
      );
    }
  }

  return null;
}

async function resolveAdoptionListingContext(req, userId) {
  const listingId = toOptionalInt(req.body?.listingId ?? req.query?.listingId);
  const draftId =
    req.body?.draftId === undefined && req.query?.draftId === undefined
      ? undefined
      : String(req.body?.draftId ?? req.query?.draftId);
  // Explicit adoption context from upload request (for new listings before they're saved).
  const uploadContext = String(req.body?.uploadContext ?? req.query?.uploadContext ?? "").toLowerCase();
  const isAdoptionContext = uploadContext === 'adoption';

  if (!listingId && !isAdoptionContext) {
    return { listingId: undefined, draftId, isAdoptionContext: false };
  }

  if (listingId) {
    const listing = await prisma.adoptionPet.findFirst({
      where: {
        id: listingId,
        ownerId: Number(userId),
        deletedAt: null,
      },
      select: { id: true, ownerId: true },
    });

    if (!listing) {
      throw createUploadError(
        404,
        "ADOPTION_LISTING_NOT_FOUND",
        "Adoption listing not found for this user.",
        { listingId },
      );
    }

    return { listingId: listing.id, draftId, isAdoptionContext: true };
  }

  // New adoption listing (uploadContext='adoption' but no listingId yet).
  return { listingId: undefined, draftId, isAdoptionContext: true };
}

async function linkMediaToAdoptionListing({ listingId, mediaId }) {
  if (!listingId || !mediaId) return null;

  const existing = await prisma.adoptionPetMedia.findFirst({
    where: { petId: Number(listingId), mediaId: Number(mediaId) },
    select: { id: true, order: true, isCover: true },
  });
  if (existing) {
    return { linked: false, order: existing.order, isCover: existing.isCover };
  }

  const last = await prisma.adoptionPetMedia.findFirst({
    where: { petId: Number(listingId) },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = (last?.order ?? -1) + 1;

  const linked = await prisma.adoptionPetMedia.create({
    data: {
      petId: Number(listingId),
      mediaId: Number(mediaId),
      order: nextOrder,
      isCover: nextOrder === 0,
    },
    select: { id: true, order: true, isCover: true },
  });

  return { linked: true, order: linked.order, isCover: linked.isCover };
}

async function enqueueVideoProcessing({ media, rawKey, folder, userId }) {
  const statusBefore = media?.status ?? null;
  console.log(
    `[media/upload] enqueue video processing start mediaId=${media.id} ` +
      `userId=${userId} statusBefore=${statusBefore} ` +
      `VIDEO_PROCESSING_ENABLED=${isVideoProcessingEnabled()}`,
  );

  const jobId = await addVideoProcessingJob({
    mediaId: media.id,
    rawKey,
    folder,
    ownerUserId: Number(userId),
  });

  if (!jobId) {
    await prisma.media.update({
      where: { id: media.id },
      data: {
        status: "FAILED",
        processingError: "Video processing queue unavailable; retry pending",
      },
    });
    console.warn(
      `[media/upload] addVideoProcessingJob unavailable mediaId=${media.id} ` +
        `userId=${userId} statusBefore=${statusBefore} statusAfter=FAILED`,
    );
    return { jobId: null, statusAfter: "FAILED" };
  }

  await prisma.media.update({
    where: { id: media.id },
    data: { status: "PENDING", processingError: null },
  });
  console.log(
    `[media/upload] addVideoProcessingJob succeeded mediaId=${media.id} ` +
      `userId=${userId} queueJobId=${jobId} statusBefore=${statusBefore} statusAfter=PENDING`,
  );
  return { jobId, statusAfter: "PENDING" };
}

exports.uploadMedia = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const adoptionContext = await resolveAdoptionListingContext(req, userId);

    const files = pickFiles(req);
    if (!files.length) {
      return res.status(400).json({
        success: false,
        message:
          "No file uploaded. Use multipart/form-data with field name 'file' (or legacy 'media', or 'files[]').",
        code: "UPLOAD_FILE_MISSING",
      });
    }

    const wantMultiple =
      files.length > 1 ||
      String(req.query.multiple || req.body?.multiple || "").toLowerCase() ===
        "1" ||
      String(req.query.multiple || req.body?.multiple || "").toLowerCase() ===
        "true";

    const folder = String(req.body?.folder || req.query.folder || "media");
    const videoEditMetadata = pickVideoEditMetadata(req.body || {});
    logUpload("request_received", {
      userId: Number(userId),
      listingId: adoptionContext.listingId,
      draftId: adoptionContext.draftId,
      fileCount: files.length,
      fileFields: files.map((file) => file.fieldname),
      folder,
      multiple: wantMultiple,
    });

    // Validate file sizes per adoption context and media type.
    for (const f of files) {
      const sizeError = validateFileSize(f, adoptionContext, appConfig);
      if (sizeError) {
        logUpload("request_failed", {
          userId: Number(userId),
          listingId: adoptionContext.listingId,
          draftId: adoptionContext.draftId,
          reason: "FILE_TOO_LARGE",
          fileSizeMb: Math.round((f.size / (1024 * 1024)) * 100) / 100,
          originalname: f.originalname,
        });
        const statusCode = sizeError.statusCode || 500;
        return res.status(statusCode).json({
          success: false,
          message: sizeError.message,
          code: sizeError.code,
          meta: sizeError.meta,
        });
      }
    }

    const created = [];
    for (const f of files) {
      const fileMeta = {
        fieldName: f.fieldname,
        originalname: f.originalname,
        mimeType: f.mimetype,
        sizeBytes: f.size,
      };
      logUpload("file_processing_started", {
        userId: Number(userId),
        listingId: adoptionContext.listingId,
        draftId: adoptionContext.draftId,
        ...fileMeta,
      });

      if (isVideo(f.mimetype, f.originalname)) {
        const crypto = require("crypto");
        const path = require("path");
        const fs = require("fs");

        const mimeType = f.mimetype;
        const originalname = f.originalname || "video";
        const rand = crypto.randomBytes(10).toString("hex");
        const ext = path.extname(originalname) || ".mp4";
        const prefix = req.countryContext?.countryCode
          ? `${String(req.countryContext.countryCode).toUpperCase().slice(0, 2)}/`
          : "";
        const rawKey = `${prefix}raw_videos/${userId}/${Date.now()}_${rand}${ext}`;

        const rawUrl = await mediaService.uploadToStorage({
          file: f,
          mimeType,
          key: rawKey,
          originalname,
        });
        logUpload("storage_upload_succeeded", {
          userId: Number(userId),
          listingId: adoptionContext.listingId,
          draftId: adoptionContext.draftId,
          ...fileMeta,
          mediaKind: "VIDEO",
          key: rawKey,
          url: rawUrl,
        });

        const sizeBytes = f.size || (f.path ? fs.statSync(f.path).size : 0);
        const hash = await mediaService.computeFileHash(f);

        const existing = await prisma.media.findFirst({
          where: { hash, ownerUserId: Number(userId) },
        });
        const hashConflict = existing
          ? null
          : await prisma.media.findFirst({
              where: { hash, ownerUserId: { not: Number(userId) } },
              select: { id: true, ownerUserId: true },
            });
        console.log(
          `[media/upload] userId=${userId} hash=${hash?.slice(0, 12)}... ` +
            `existingMediaId=${existing?.id ?? null} ` +
            `ownerUserId=${existing?.ownerUserId ?? null} ` +
            `hashConflictMediaId=${hashConflict?.id ?? null} ` +
            `dedup=${existing != null}`,
        );

        let media;
        if (existing) {
          await mediaService.deleteFromStorage(rawKey);
          media = existing;
          logUpload("db_media_reused", {
            userId: Number(userId),
            listingId: adoptionContext.listingId,
            draftId: adoptionContext.draftId,
            mediaId: media.id,
            ownerUserId: media.ownerUserId,
            hash: hash?.slice(0, 12),
          });
        } else {
          media = await prisma.media.create({
            data: {
              url: rawUrl,
              key: rawKey,
              type: "VIDEO",
              ownerUserId: Number(userId),
              mimeType,
              sizeBytes,
              hash: hashConflict ? null : hash,
              altText: originalname,
              status: "PENDING",
              originalKey: rawKey,
              ...videoEditMetadata,
            },
          });

          console.log(
            `[media/upload] Created new media record id=${media.id} ownerUserId=${media.ownerUserId}`,
          );
          logUpload("db_media_created", {
            userId: Number(userId),
            listingId: adoptionContext.listingId,
            draftId: adoptionContext.draftId,
            mediaId: media.id,
            ownerUserId: media.ownerUserId,
            mimeType,
            sizeBytes,
            hashStored: media.hash != null,
          });
          try {
            await enqueueVideoProcessing({ media, rawKey, folder, userId });
          } catch (queueErr) {
            console.warn(
              `[Media] Video processing queue unavailable; media saved without processing job. ` +
                `mediaId=${media.id} userId=${userId} reason=${queueErr?.message || queueErr}`,
            );
            try {
              await prisma.media.update({
                where: { id: media.id },
                data: {
                  status: "FAILED",
                  processingError:
                    "Video processing enqueue failed; retry pending",
                },
              });
            } catch (_) {}
          }
        }

        if (f.path) {
          try {
            fs.unlinkSync(f.path);
          } catch (_) {}
        }

        const linked = await linkMediaToAdoptionListing({
          listingId: adoptionContext.listingId,
          mediaId: media.id,
        });
        if (linked) {
          logUpload("adoption_media_linked", {
            userId: Number(userId),
            listingId: adoptionContext.listingId,
            draftId: adoptionContext.draftId,
            mediaId: media.id,
            order: linked.order,
            isCover: linked.isCover,
            linked: linked.linked,
          });
        }

        created.push({
          ...mediaService.withResolvedUrl(media),
          adoptionListingId: adoptionContext.listingId ?? null,
        });
      } else {
        const processed = await processUploadFile(f);
        const media = await mediaService.uploadAndCreateMedia({
          ownerUserId: Number(userId),
          file: processed,
          folder,
          countryCode: req.countryContext?.countryCode,
          metadata: videoEditMetadata,
        });
        logUpload("db_media_created", {
          userId: Number(userId),
          listingId: adoptionContext.listingId,
          draftId: adoptionContext.draftId,
          mediaId: media.id,
          ownerUserId: media.ownerUserId,
          mimeType: media.mimeType,
          sizeBytes: media.sizeBytes,
          mediaKind: media.type,
        });

        const linked = await linkMediaToAdoptionListing({
          listingId: adoptionContext.listingId,
          mediaId: media.id,
        });
        if (linked) {
          logUpload("adoption_media_linked", {
            userId: Number(userId),
            listingId: adoptionContext.listingId,
            draftId: adoptionContext.draftId,
            mediaId: media.id,
            order: linked.order,
            isCover: linked.isCover,
            linked: linked.linked,
          });
        }

        created.push({
          ...media,
          adoptionListingId: adoptionContext.listingId ?? null,
        });
      }
    }

    logUpload("response_sent", {
      userId: Number(userId),
      listingId: adoptionContext.listingId,
      draftId: adoptionContext.draftId,
      mediaCount: created.length,
      mediaIds: created.map((item) => item.id),
    });
    return res
      .status(201)
      .json({ success: true, data: wantMultiple ? created : created[0] });
  } catch (e) {
    // Classify Prisma errors so they don't return a generic 500.
    let resolvedStatusCode = e?.statusCode || e?.status || 500;
    let resolvedCode = e?.code || "INTERNAL_ERROR";
    let resolvedMsg = e?.message || "";
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // Unique constraint — duplicate media hash; safe to treat as conflict
        resolvedStatusCode = 409;
        resolvedCode = "MEDIA_DUPLICATE";
        resolvedMsg = "Duplicate media detected. This file has already been uploaded.";
      } else {
        resolvedStatusCode = 503;
        resolvedCode = "DB_ERROR";
        resolvedMsg = "Database error during upload. Please try again.";
      }
    } else if (e instanceof Prisma.PrismaClientUnknownRequestError ||
               e instanceof Prisma.PrismaClientRustPanicError) {
      resolvedStatusCode = 503;
      resolvedCode = "DB_ERROR";
      resolvedMsg = "Database connection error. Please try again.";
    }
    const finalMsg = resolvedMsg ||
      (resolvedStatusCode >= 500 ? "Something went wrong. Please try again." : "Upload failed");
    logUpload("request_failed", {
      userId: Number(req.user?.id || 0),
      listingId: toOptionalInt(req.body?.listingId ?? req.query?.listingId),
      draftId:
        req.body?.draftId === undefined && req.query?.draftId === undefined
          ? undefined
          : String(req.body?.draftId ?? req.query?.draftId),
      message: finalMsg,
      code: resolvedCode,
      statusCode: resolvedStatusCode,
      meta: e?.meta,
    });
    const payload: any = { success: false, message: finalMsg, code: resolvedCode };
    if (e?.meta) payload.meta = e.meta;
    return res.status(resolvedStatusCode).json(payload);
  }
};

exports.requeueUnprocessedVideos = async (req, res) => {
  try {
    const limit = Math.max(
      1,
      Math.min(Number(req.body?.limit || req.query?.limit || 50), 200),
    );
    const mediaRows = await prisma.media.findMany({
      where: {
        type: { in: ["VIDEO", "REEL"] },
        deletedAt: null,
        originalKey: { not: null },
        OR: [
          { status: "PENDING" },
          { status: "PROCESSING" },
          { status: "FAILED" },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    const results = [];
    for (const media of mediaRows) {
      try {
        const jobId = await addVideoProcessingJob({
          mediaId: media.id,
          rawKey: media.originalKey || media.key,
          folder: req.body?.folder || "media",
          ownerUserId: media.ownerUserId,
        });
        if (!jobId) {
          await prisma.media.update({
            where: { id: media.id },
            data: {
              status: "FAILED",
              processingError:
                "Video processing queue unavailable; retry pending",
            },
          });
          results.push({
            mediaId: media.id,
            jobId: null,
            status: "queue_unavailable",
          });
          continue;
        }
        await prisma.media.update({
          where: { id: media.id },
          data: { status: "PENDING", processingError: null },
        });
        console.log(
          `[media/requeue] requeued mediaId=${media.id} userId=${media.ownerUserId} ` +
            `queueJobId=${jobId} statusBefore=${media.status} statusAfter=PENDING`,
        );
        results.push({ mediaId: media.id, jobId, status: "requeued" });
      } catch (e) {
        console.warn(
          `[media/requeue] failed mediaId=${media.id}:`,
          e?.message || e,
        );
        results.push({ mediaId: media.id, jobId: null, status: "failed" });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        scanned: mediaRows.length,
        requeued: results.filter((r) => r.status === "requeued").length,
        results,
      },
    });
  } catch (e) {
    console.error("[media/requeue] error:", e);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong. Please try again.",
        code: "INTERNAL_ERROR",
      });
  }
};

exports.myMedia = async (req, res) => {
  try {
    const ownerUserId = req.user?.id;
    if (!ownerUserId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const list = await mediaService.listMyMedia(Number(ownerUserId));

    return res.status(200).json({ success: true, data: list });
  } catch (e) {
    console.error("[myMedia] error:", e);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong. Please try again.",
        code: "INTERNAL_ERROR",
      });
  }
};

exports.delete = async (req, res) => {
  try {
    const ownerUserId = req.user?.id;
    if (!ownerUserId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    await mediaService.deleteMyMedia({
      ownerUserId: Number(ownerUserId),
      mediaId: Number(req.params.id),
    });
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("[deleteMedia] error:", e);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong. Please try again.",
        code: "INTERNAL_ERROR",
      });
  }
};

export {};

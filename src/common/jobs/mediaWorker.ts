/**
 * BullMQ worker for video transcoding and thumbnail generation.
 * Run: npm run worker:media
 * Requires REDIS_ENABLED and Redis to be running.
 */
import "./workerEnv.bootstrap";
import { Worker, Job } from "bullmq";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as crypto from "crypto";
import prisma from "../../infrastructure/db/prismaClient";
const { getStorageProvider } = require("../../infrastructure/storage/storage.factory");
import {
  areRedisQueuesEnabled,
  waitForRedisReady,
} from "../../infrastructure/redis/redis.client";
import { getRedisConnectionOptions, isRedisEnabled } from "../../infrastructure/redis/redisConnection";
import { VIDEO_PROCESSING_QUEUE_NAME, VideoProcessingJobPayload, isVideoProcessingEnabled } from "../queue/queues";

const redisConfig = getRedisConnectionOptions();

// Initialize fluent-ffmpeg and static binary
let ffmpeg = require("fluent-ffmpeg");
let ffmpegPath = process.env.FFMPEG_PATH || null;
if (!ffmpegPath) {
  try {
    ffmpegPath = require("ffmpeg-static");
  } catch (_) {
    ffmpegPath = null;
  }
}
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
  console.log(`[MediaWorker] Set FFmpeg binary path to: ${ffmpegPath}`);
} else {
  console.warn("[MediaWorker] FFmpeg binary path not found. Ensure ffmpeg is installed in system path.");
}

const rawHlsSegmentSeconds = Number(process.env.VIDEO_HLS_SEGMENT_SECONDS || 6);
const HLS_SEGMENT_SECONDS = Number.isFinite(rawHlsSegmentSeconds)
  ? Math.max(4, Math.min(rawHlsSegmentSeconds, 8))
  : 6;
const HLS_PLAYLIST_NAME = "index.m3u8";
const HLS_M3U8_MIME = "application/vnd.apple.mpegurl";
const HLS_TS_MIME = "video/mp2t";

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function walkFilesSync(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFilesSync(full));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function hlsContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".m3u8") return HLS_M3U8_MIME;
  if (ext === ".ts") return HLS_TS_MIME;
  return "application/octet-stream";
}

async function uploadDirectoryToStorage({
  provider,
  localDir,
  remotePrefix,
}: {
  provider: ReturnType<typeof getStorageProvider>;
  localDir: string;
  remotePrefix: string;
}) {
  const files = walkFilesSync(localDir);
  for (const filePath of files) {
    const relative = path.relative(localDir, filePath).split(path.sep).join("/");
    const key = `${remotePrefix}/${relative}`;
    await provider.putObject({
      key,
      body: fs.createReadStream(filePath),
      contentType: hlsContentType(filePath),
    });
  }
}

async function generateHlsPackage({
  inputPath,
  outputDir,
  playlistPath,
}: {
  inputPath: string;
  outputDir: string;
  playlistPath: string;
}) {
  ensureDirSync(outputDir);
  const segmentPattern = path.join(outputDir, "segment_%03d.ts");

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-c copy",
        `-hls_time ${HLS_SEGMENT_SECONDS}`,
        "-hls_list_size 0",
        "-hls_playlist_type vod",
        "-hls_flags independent_segments",
        `-hls_segment_filename ${segmentPattern}`,
      ])
      .format("hls")
      .on("end", () => resolve())
      .on("error", (err: Error) => reject(err))
      .save(playlistPath);
  });
}

async function processVideoJob(job: Job<VideoProcessingJobPayload>) {
  const { mediaId, rawKey, folder, ownerUserId } = job.data;
  console.log(`[MediaWorker] received jobId=${job.id} mediaId=${mediaId} userId=${ownerUserId}`);

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    console.warn(`[MediaWorker] Media record ${mediaId} not found in database. Skipping.`);
    return;
  }

  if (media.status !== "PENDING" && media.status !== "PROCESSING") {
    console.log(`[MediaWorker] Media record ${mediaId} is already in status ${media.status}. Skipping.`);
    return;
  }

  // Update status to PROCESSING
  await prisma.media.update({
    where: { id: mediaId },
    data: { status: "PROCESSING" },
  });

  const provider = getStorageProvider();
  const tempInputPath = path.join(os.tmpdir(), `bpa_worker_in_${mediaId}.mp4`);
  const tempOutputPath = path.join(os.tmpdir(), `bpa_worker_out_${mediaId}.mp4`);
  const tempThumbPath = path.join(os.tmpdir(), `bpa_worker_thumb_${mediaId}.jpg`);
  const tempHlsDir = path.join(os.tmpdir(), `bpa_worker_hls_${mediaId}_${crypto.randomBytes(6).toString("hex")}`);
  const hlsRand = crypto.randomBytes(10).toString("hex");
  const hlsPrefix = `${folder}/${ownerUserId}/${Date.now()}_${hlsRand}_hls`;
  const hlsPlaylistKey = `${hlsPrefix}/${HLS_PLAYLIST_NAME}`;
  const hlsPlaylistUrl = provider.buildPublicUrl(hlsPlaylistKey);

  try {
    // 1. Download original raw video from S3/MinIO
    console.log(`[MediaWorker] Downloading raw video key: ${rawKey}`);
    const obj = await provider.getObject(rawKey);
    const writeStream = fs.createWriteStream(tempInputPath);
    await new Promise<void>((resolve, reject) => {
      obj.body.pipe(writeStream);
      obj.body.on("finish", resolve);
      obj.body.on("error", (err: Error) => reject(new Error(`Failed to write raw video stream to disk: ${err.message}`)));
    });
    console.log(`[MediaWorker] Saved raw video to temp disk: ${tempInputPath}`);

    // 2. Transcode video using FFmpeg (H.264 video, AAC audio, web-optimized)
    const inputSize = fs.statSync(tempInputPath).size;
    console.log(`[MediaWorker] ffmpeg started mediaId=${mediaId} inputMb=${(inputSize / 1024 / 1024).toFixed(1)}`);
    const transcodeStart = Date.now();
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempInputPath)
        .outputOptions([
          "-movflags +faststart",
          "-vf scale=trunc(min(iw\\,1280)/2)*2:trunc(min(ih\\,1280)/2)*2", // Limit to 1280, keeping even width/height
          "-c:v libx264",
          "-preset fast",
          "-crf 26",
          `-force_key_frames expr:gte(t,n_forced*${HLS_SEGMENT_SECONDS})`,
          "-sc_threshold 0",
          "-c:a aac",
          "-b:a 128k",
        ])
        .on("end", () => {
          const duration = ((Date.now() - transcodeStart) / 1000).toFixed(1);
          const outSize = fs.existsSync(tempOutputPath) ? (fs.statSync(tempOutputPath).size / 1024 / 1024).toFixed(1) : "?";
          console.log(`[MediaWorker] video output generated mediaId=${mediaId} durationSec=${duration} outputMb=${outSize}`);
          resolve();
        })
        .on("error", (err: Error) => {
          const duration = ((Date.now() - transcodeStart) / 1000).toFixed(1);
          console.error(`[MediaWorker] FFmpeg transcoding error after ${duration}s: ${err.message}`);
          reject(err);
        })
        .save(tempOutputPath);
    });

    // 3. Extract thumbnail at 1s mark
    console.log(`[MediaWorker] Extracting thumbnail...`);
    const thumbStart = Date.now();
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempInputPath)
        .seekInput(1.0)
        .frames(1)
        .outputOptions(["-vf scale=640:-1"]) // Width 640, preserve aspect ratio
        .on("end", () => {
          console.log(`[MediaWorker] thumbnail generated mediaId=${mediaId} durationSec=${((Date.now() - thumbStart) / 1000).toFixed(1)}`);
          resolve();
        })
        .on("error", (err: Error) => {
          console.warn(`[MediaWorker] Thumbnail at 1s failed (${err.message}), retrying from start...`);
          // Fallback to start frame if seek failed
          ffmpeg(tempInputPath)
            .frames(1)
            .outputOptions(["-vf scale=640:-1"])
            .on("end", resolve)
            .on("error", (err2: Error) => {
              console.error(`[MediaWorker] Thumbnail fallback also failed: ${err2.message}`);
              reject(err2);
            })
            .save(tempThumbPath);
        })
        .save(tempThumbPath);
    });

    // 4. Generate HLS playlist + segments from the optimized MP4, then upload both streams.
    console.log(`[MediaWorker] Generating HLS package mediaId=${mediaId} segmentSeconds=${HLS_SEGMENT_SECONDS}`);
    const hlsStart = Date.now();
    let hlsGenerated = false;
    try {
      await generateHlsPackage({
        inputPath: tempOutputPath,
        outputDir: tempHlsDir,
        playlistPath: path.join(tempHlsDir, HLS_PLAYLIST_NAME),
      });
      const hlsFiles = walkFilesSync(tempHlsDir);
      console.log(
        `[MediaWorker] HLS package generated mediaId=${mediaId} fileCount=${hlsFiles.length} durationSec=${((Date.now() - hlsStart) / 1000).toFixed(1)}`
      );
      await uploadDirectoryToStorage({
        provider,
        localDir: tempHlsDir,
        remotePrefix: hlsPrefix,
      });
      hlsGenerated = true;
      console.log(`[MediaWorker] HLS upload completed mediaId=${mediaId} playlistUrl=${hlsPlaylistUrl}`);
    } catch (hlsErr) {
      console.warn(
        `[MediaWorker] HLS generation/upload failed for mediaId=${mediaId}; keeping MP4 fallback only:`,
        hlsErr instanceof Error ? hlsErr.message : hlsErr
      );
    }

    // 5. Upload optimized assets to S3/MinIO
    const rand = crypto.randomBytes(10).toString("hex");
    const optKey = `${folder}/${ownerUserId}/${Date.now()}_${rand}_opt.mp4`;
    const thumbKey = `thumbnails/${ownerUserId}/${Date.now()}_${rand}.jpg`;

    console.log(`[MediaWorker] Uploading optimized video: ${optKey}`);
    await provider.putObject({
      key: optKey,
      body: fs.createReadStream(tempOutputPath),
      contentType: "video/mp4",
    });
    const optUrl = provider.buildPublicUrl(optKey);

    console.log(`[MediaWorker] Uploading thumbnail: ${thumbKey}`);
    await provider.putObject({
      key: thumbKey,
      body: fs.createReadStream(tempThumbPath),
      contentType: "image/jpeg",
    });
    const thumbUrl = provider.buildPublicUrl(thumbKey);

    // 5. Update Media record in DB
    const optimizedSize = fs.statSync(tempOutputPath).size;
    console.log(
      `[MediaWorker] saving media outputs mediaId=${mediaId} thumbnailUrl=${thumbUrl} playbackUrl=${optUrl} hlsUrl=${hlsGenerated ? hlsPlaylistUrl : ""}`
    );
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        url: optUrl,
        key: optKey,
        hlsUrl: hlsGenerated ? hlsPlaylistUrl : null,
        hlsKey: hlsGenerated ? hlsPlaylistKey : null,
        thumbnailUrl: thumbUrl,
        thumbnailKey: thumbKey,
        status: "READY",
        sizeBytes: optimizedSize,
      },
    });
    console.log(`[MediaWorker] media status changed to READY mediaId=${mediaId}`);

    // 6. Delete raw temporary S3 object to save space
    console.log(`[MediaWorker] Deleting original raw video key: ${rawKey}`);
    await provider.deleteObject(rawKey);

  } catch (error) {
    console.error(`[MediaWorker] Processing error on media ${mediaId}:`, error);
    
    // Set status to FAILED with error message
    const errorMessage = error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500);
    await prisma.media.update({
      where: { id: mediaId },
      data: { status: "FAILED", processingError: errorMessage },
    }).catch(e => console.error(`[MediaWorker] Failed to set Media ${mediaId} to FAILED status:`, e));
    
    throw error;
  } finally {
    // 7. Cleanup local disk temp files
    console.log(`[MediaWorker] Cleaning up local temporary files`);
    try { if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath); } catch (_) {}
    try { if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath); } catch (_) {}
    try { if (fs.existsSync(tempThumbPath)) fs.unlinkSync(tempThumbPath); } catch (_) {}
    try { if (fs.existsSync(tempHlsDir)) fs.rmSync(tempHlsDir, { recursive: true, force: true }); } catch (_) {}
  }
}

function startWorker() {
  const concurrency = Number(process.env.VIDEO_QUEUE_CONCURRENCY || 1);
  console.log(`[MediaWorker] media worker started`);
  console.log(`[MediaWorker] queue is listening name=${VIDEO_PROCESSING_QUEUE_NAME} concurrency=${concurrency}`);
  
  const worker = new Worker<VideoProcessingJobPayload>(
    VIDEO_PROCESSING_QUEUE_NAME,
    async (job) => {
      await processVideoJob(job);
    },
    { connection: redisConfig, concurrency }
  );

  worker.on("error", (err) => console.error("[MediaWorker] Worker general error:", err.message || err));
  worker.on("completed", (job) => console.log(`[MediaWorker] Job ${job?.id} completed successfully.`));
  worker.on("failed", (job, err) => console.warn(`[MediaWorker] Job ${job?.id} failed with error:`, err.message || err));
}

async function main(): Promise<void> {
  console.log(`[MediaWorker] REDIS_ENABLED=${isRedisEnabled()}`);
  console.log(`[MediaWorker] VIDEO_PROCESSING_ENABLED=${isVideoProcessingEnabled()}`);
  if (!isVideoProcessingEnabled()) {
    console.log("[MediaWorker] Video processing is disabled by configuration. Worker will exit.");
    process.exit(0);
  }

  if (!isRedisEnabled()) {
    console.log("[MediaWorker] Redis is disabled in configuration. Worker will exit.");
    process.exit(0);
  }

  const ready = await waitForRedisReady();
  if (!ready || !areRedisQueuesEnabled()) {
    console.log("[MediaWorker] Redis connection not ready or queues disabled. Worker exiting.");
    process.exit(1);
  }

  console.log("[MediaWorker] Redis connected");
  startWorker();
}

main().catch((err) => {
  console.error("[MediaWorker] Fatal startup error:", err);
  process.exit(1);
});

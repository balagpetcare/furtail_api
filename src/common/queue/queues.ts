/**
 * BullMQ queue for producer staff invite emails.
 * Worker: src/common/queue/workers/email.worker.ts
 */
import { Queue } from "bullmq";
import { areRedisQueuesEnabled, waitForRedisReady } from "../../infrastructure/redis/redis.client";
import { getRedisConnectionOptions, isRedisEnabled } from "../../infrastructure/redis/redisConnection";

export const QUEUE_NAME = "producer_staff_invite_email";

export type ProducerStaffInviteEmailJobPayload = {
  deliveryId: number;
  inviteId: number;
  to: string;
  inviteLink: string;
  producerName: string;
  roleLabel: string;
  expiresAt: string; // ISO date
  ownerName?: string;
  customMessage?: string;
};

function getConnection() {
  return getRedisConnectionOptions();
}

let _queue: Queue<ProducerStaffInviteEmailJobPayload> | null = null;

export function getProducerStaffInviteEmailQueue(): Queue<ProducerStaffInviteEmailJobPayload> | null {
  if (_queue) return _queue;
  if (!isRedisEnabled() || !areRedisQueuesEnabled()) return null;
  try {
    _queue = new Queue(QUEUE_NAME, {
      connection: getConnection(),
      defaultJobOptions: { attempts: 5, backoff: { type: "exponential", delay: 2000 } },
    }) as Queue<ProducerStaffInviteEmailJobPayload>;
  } catch {
    return null;
  }
  return _queue;
}

export async function addProducerStaffInviteEmailJob(
  payload: ProducerStaffInviteEmailJobPayload
): Promise<string | null> {
  const queue = getProducerStaffInviteEmailQueue();
  if (!queue) return null;
  const job = await queue.add("send", payload);
  return job?.id ?? null;
}

export const VIDEO_PROCESSING_QUEUE_NAME = "video_processing";

export function isVideoProcessingEnabled(): boolean {
  const raw = String(process.env.VIDEO_PROCESSING_ENABLED ?? "true").trim().toLowerCase();
  return raw !== "false" && raw !== "0";
}

export type VideoProcessingJobPayload = {
  mediaId: number;
  rawKey: string;
  folder: string;
  ownerUserId: number;
};

let _videoQueue: Queue<VideoProcessingJobPayload> | null = null;

export function getVideoProcessingQueue(): Queue<VideoProcessingJobPayload> | null {
  if (_videoQueue) return _videoQueue;
  if (!isVideoProcessingEnabled() || !isRedisEnabled() || !areRedisQueuesEnabled()) return null;
  try {
    _videoQueue = new Queue(VIDEO_PROCESSING_QUEUE_NAME, {
      connection: getConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    }) as Queue<VideoProcessingJobPayload>;
  } catch {
    return null;
  }
  return _videoQueue;
}

export async function addVideoProcessingJob(
  payload: VideoProcessingJobPayload
): Promise<string | null> {
  if (!isVideoProcessingEnabled() || !isRedisEnabled()) return null;
  const ready = await waitForRedisReady(2000);
  if (!ready) return null;
  const queue = getVideoProcessingQueue();
  if (!queue) return null;
  const job = await queue.add("transcode", payload);
  return job?.id ?? null;
}


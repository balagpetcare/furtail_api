import { getSharedRedisClient, isRedisAvailable } from "../../../infrastructure/redis/redis.client";
import { isRedisEnabled } from "../../../infrastructure/redis/redisConnection";

const REPLAY_TTL_SECONDS = 7 * 24 * 60 * 60;

function replayKey(eventKey: string): string {
  return `campaign:payment:event:${eventKey}`;
}

/**
 * Returns true if this payment event was already processed (replay).
 *
 * Fail-closed policy: when PAYMENT_PROVIDER=wpa and NODE_ENV=production,
 * Redis unavailability causes rejection (returns true) rather than allowing
 * potentially duplicate webhook processing through.
 */
export async function isPaymentEventReplay(eventKey: string): Promise<boolean> {
  const redisDown = !isRedisEnabled() || !isRedisAvailable();
  if (redisDown) {
    const isWpaProduction =
      process.env.PAYMENT_PROVIDER === "wpa" && process.env.NODE_ENV === "production";
    if (isWpaProduction) {
      console.error("[PaymentReplay] Redis unavailable in production with PAYMENT_PROVIDER=wpa — rejecting webhook (fail-closed)");
      return true;
    }
    return false;
  }
  const client = getSharedRedisClient();
  if (!client) return false;
  try {
    const exists = await client.exists(replayKey(eventKey));
    return exists === 1;
  } catch (err) {
    console.warn("[PaymentReplay] Redis unavailable, skipping replay check:", (err as Error).message);
    return false;
  }
}

export async function markPaymentEventProcessed(eventKey: string): Promise<void> {
  if (!isRedisEnabled() || !isRedisAvailable()) return;
  const client = getSharedRedisClient();
  if (!client) return;
  try {
    await client.setex(replayKey(eventKey), REPLAY_TTL_SECONDS, "1");
  } catch (err) {
    console.warn("[PaymentReplay] Failed to mark event:", (err as Error).message);
  }
}

export function buildPaymentEventKey(provider: string, eventId: string): string {
  return `${provider.toLowerCase()}:${eventId}`;
}

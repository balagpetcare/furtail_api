import type { Request, Response, NextFunction } from "express";
import { verifyWpaWebhook, getWpaConfig } from "../../../../services/wpa-gateway-client";
import { createPaymentIntent } from "../../modules/campaign/payment.service";
import { processPaymentWebhook } from "../../modules/campaign/payment.service";
import { buildPaymentEventKey, isPaymentEventReplay, markPaymentEventProcessed } from "../../providers/paymentReplay.guard";
import { logPaymentTransaction, updatePaymentTransactionLog } from "../paymentTransaction.service";
import type { WpaWebhookPayload } from "../../../../services/wpa-gateway-client";

// ─── Initiate ─────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/payments/wpa/initiate
 * Authenticated — creates a WPA payment session for a campaign booking.
 * Returns paymentUrl for the app to open. Does NOT mark payment as paid.
 */
export async function wpaInitiateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId, returnUrl, cancelUrl } = req.body as {
      bookingId?: unknown;
      returnUrl?: unknown;
      cancelUrl?: unknown;
    };

    if (!bookingId || typeof bookingId !== "number") {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "bookingId (number) is required" },
      });
    }
    if (!returnUrl || typeof returnUrl !== "string") {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "returnUrl (string) is required" },
      });
    }

    const result = await createPaymentIntent({
      bookingId,
      method: "CARD",
      returnUrl,
      cancelUrl: typeof cancelUrl === "string" ? cancelUrl : undefined,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: { code: "PAYMENT_CREATE_FAILED", message: result.error || "Failed to create WPA payment session" },
      });
    }

    return res.json({
      success: true,
      data: {
        paymentUrl: result.paymentUrl,
        orderId: result.orderId,
        transactionId: result.transactionId,
        status: "PENDING",
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Webhook ──────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/payments/wpa/webhook
 * WPA gateway merchant webhook receiver.
 * Verifies HMAC-SHA256 signature using raw body before processing.
 */
export async function wpaWebhookHandler(req: Request, res: Response, next: NextFunction) {
  const signature = String(req.headers["x-gateway-signature"] || "");
  const timestamp = String(req.headers["x-gateway-timestamp"] || "");
  const nonce = String(req.headers["x-gateway-nonce"] || "");
  const event = String(req.headers["x-gateway-event"] || "");

  const logId = await logPaymentTransaction({
    provider: "wpa",
    referenceId: "wpa_webhook_pending",
    phase: "WEBHOOK",
    status: "PENDING",
    requestJson: {
      event,
      timestamp,
      nonce,
      hasSignature: !!signature,
      bodyKeys: req.body ? Object.keys(req.body) : [],
    },
  }).catch(() => 0);

  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!rawBody) {
    console.error("[WPA Webhook] rawBody not captured — check express.json verify config in app.ts");
    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: "rawBody unavailable" }).catch(() => undefined);
    return res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "Webhook verification failed" } });
  }

  const config = getWpaConfig();
  if (!config.clientSecret) {
    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: "WPA_GATEWAY_CLIENT_SECRET not configured" }).catch(() => undefined);
    return res.status(500).json({ success: false, error: { code: "CONFIG_ERROR", message: "Gateway not configured" } });
  }

  // Verify HMAC signature using raw body
  if (!verifyWpaWebhook(rawBody, config.clientSecret, signature)) {
    console.warn("[WPA Webhook] Signature verification failed — rejecting webhook");
    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: "Invalid HMAC signature" }).catch(() => undefined);
    return res.status(401).json({ success: false, error: { code: "INVALID_SIGNATURE", message: "Webhook signature verification failed" } });
  }

  // Timestamp replay window ±300s
  const timestampNum = Number(timestamp);
  const nowSec = Math.floor(Date.now() / 1000);
  if (!timestamp || isNaN(timestampNum) || Math.abs(nowSec - timestampNum) > 300) {
    console.warn("[WPA Webhook] Timestamp out of allowed window", { timestamp, nowSec, diff: nowSec - timestampNum });
    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: "Timestamp out of allowed window" }).catch(() => undefined);
    return res.status(401).json({ success: false, error: { code: "TIMESTAMP_EXPIRED", message: "Webhook timestamp out of allowed window" } });
  }

  // Nonce replay protection
  if (!nonce) {
    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: "Missing nonce header" }).catch(() => undefined);
    return res.status(401).json({ success: false, error: { code: "MISSING_NONCE", message: "x-gateway-nonce header required" } });
  }
  const nonceKey = buildPaymentEventKey("wpa_nonce", nonce);
  if (await isPaymentEventReplay(nonceKey)) {
    console.warn("[WPA Webhook] Nonce already used — replay attack rejected", { nonce });
    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: "Replayed nonce" }).catch(() => undefined);
    return res.status(401).json({ success: false, error: { code: "REPLAY_DETECTED", message: "Webhook nonce already used" } });
  }

  const payload = req.body as WpaWebhookPayload;
  if (!payload.merchantOrderId || !payload.gatewayReference) {
    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: "Missing merchantOrderId or gatewayReference" }).catch(() => undefined);
    return res.status(400).json({ success: false, error: { code: "INVALID_PAYLOAD", message: "Invalid webhook payload" } });
  }

  await updatePaymentTransactionLog(logId, { referenceId: payload.merchantOrderId }).catch(() => undefined);

  // Idempotency: return 200 if success event already processed for this order
  const eventKey = buildPaymentEventKey("wpa", `${payload.merchantOrderId}:${event}`);
  if (payload.status === "SUCCESS" && await isPaymentEventReplay(eventKey)) {
    console.info("[WPA Webhook] Duplicate success event — idempotent 200", { merchantOrderId: payload.merchantOrderId });
    return res.json({ success: true, duplicate: true });
  }

  let unifiedStatus: "SUCCESS" | "FAILED" | "CANCELLED";
  if (payload.status === "SUCCESS") {
    unifiedStatus = "SUCCESS";
  } else if (payload.status === "CANCELLED") {
    unifiedStatus = "CANCELLED";
  } else {
    unifiedStatus = "FAILED";
  }

  try {
    const result = await processPaymentWebhook({
      provider: "wpa",
      transactionId: payload.merchantOrderId,
      status: unifiedStatus,
      amount: typeof payload.amount === "number" ? payload.amount : undefined,
      metadata: {
        gatewayReference: payload.gatewayReference,
        transactionReference: payload.transactionReference ?? undefined,
        event,
      },
    });

    if (result.success) {
      await markPaymentEventProcessed(nonceKey).catch(() => undefined);
      if (unifiedStatus === "SUCCESS") {
        await markPaymentEventProcessed(eventKey).catch(() => undefined);
      }
      await updatePaymentTransactionLog(logId, {
        status: "SUCCESS",
        providerTxId: payload.gatewayReference,
        amount: typeof payload.amount === "number" ? payload.amount : undefined,
        responseJson: payload as unknown as Record<string, unknown>,
      }).catch(() => undefined);

      return res.json({ success: true, duplicate: result.duplicate ?? false });
    }

    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: "processPaymentWebhook returned false" }).catch(() => undefined);
    return res.status(422).json({ success: false, error: { code: "WEBHOOK_PROCESS_FAILED", message: "Webhook could not be processed" } });
  } catch (error) {
    const message = (error as Error).message || "Webhook processing failed";
    await updatePaymentTransactionLog(logId, { status: "FAILED", errorMessage: message }).catch(() => undefined);
    next(error);
  }
}

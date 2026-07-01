import { Router } from "express";
import { wpaInitiateHandler, wpaWebhookHandler } from "./wpa.controller";

const router = Router();

/**
 * POST /api/v1/payments/wpa/initiate
 * Create a WPA Gateway payment session for a campaign booking.
 * Requires authenticated user (JWT enforced upstream or via requireAuth).
 * Returns { paymentUrl, orderId, transactionId } — never marks paid.
 */
router.post("/initiate", wpaInitiateHandler);

/**
 * POST /api/v1/payments/wpa/webhook
 * WPA Gateway merchant notification endpoint.
 * Verifies HMAC-SHA256 signature via raw body before processing.
 * Safe to be public — all trust established by signature verification.
 */
router.post("/webhook", wpaWebhookHandler);

export default router;
module.exports = router;

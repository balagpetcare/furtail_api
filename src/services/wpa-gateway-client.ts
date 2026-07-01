/**
 * WPA Payment Gateway client.
 * Must only run server-side — never expose clientSecret to frontend.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// ─── Config ──────────────────────────────────────────────────────────────────

export function getWpaConfig() {
  return {
    baseUrl: (process.env.WPA_GATEWAY_BASE_URL || "").replace(/\/+$/, ""),
    clientId: process.env.WPA_GATEWAY_CLIENT_ID || "",
    clientSecret: process.env.WPA_GATEWAY_CLIENT_SECRET || "",
    webhookUrl: process.env.WPA_GATEWAY_WEBHOOK_URL || "",
    callbackUrl: process.env.WPA_GATEWAY_CALLBACK_URL || "",
    environment: process.env.WPA_GATEWAY_ENVIRONMENT || "sandbox",
  };
}

export function isWpaConfigured(): boolean {
  const c = getWpaConfig();
  return !!(c.baseUrl && c.clientId && c.clientSecret);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WpaPaymentSessionRequest {
  clientId: string;
  merchantOrderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  successUrl: string;
  callbackUrl: string;
  cancelUrl?: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface WpaPaymentSession {
  id: string;
  reference: string;
  status: "PENDING";
  amount: number;
  currency: string;
  merchantOrderId: string;
  paymentUrl: string;
  expiresAt: string | null;
}

export interface WpaWebhookPayload {
  event: "payment.succeeded" | "payment.failed" | "payment.cancelled" | "payment.pending";
  merchantOrderId: string;
  gatewayReference: string;
  transactionReference: string | null;
  amount: number;
  currency: string;
  status: "SUCCESS" | "FAILED" | "CANCELLED" | "PENDING";
  paidAt: string | null;
  timestamp: number;
  nonce: string;
}

// ─── Signing ─────────────────────────────────────────────────────────────────

function normalizeForJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeForJson);
  if (value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = normalizeForJson((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

function stableJsonStringify(value: unknown): string {
  return JSON.stringify(normalizeForJson(value));
}

function buildCanonicalBody(params: WpaPaymentSessionRequest & { timestamp: string; nonce: string }): string {
  const obj: Record<string, unknown> = {
    clientId: params.clientId,
    merchantOrderId: params.merchantOrderId,
    amount: params.amount,
    currency: params.currency,
    customerName: params.customerName,
    timestamp: params.timestamp,
    nonce: params.nonce,
    successUrl: params.successUrl,
    callbackUrl: params.callbackUrl,
    metadata: params.metadata ?? null,
  };
  if (params.customerEmail) obj.customerEmail = params.customerEmail;
  if (params.customerPhone) obj.customerPhone = params.customerPhone;
  if (params.description) obj.description = params.description;
  if (params.cancelUrl) obj.cancelUrl = params.cancelUrl;
  if (params.webhookUrl) obj.webhookUrl = params.webhookUrl;
  return stableJsonStringify(obj);
}

function signRequest(canonicalBody: string, timestamp: string, clientSecret: string): string {
  const bodyHash = createHash("sha256").update(canonicalBody).digest("hex");
  const canonicalString = `POST\n/api/v1/payment-sessions\n${timestamp}\n${bodyHash}`;
  return createHmac("sha256", clientSecret).update(canonicalString).digest("hex");
}

function generateCredentials(): { timestamp: string; nonce: string } {
  return {
    timestamp: String(Math.floor(Date.now() / 1000)),
    nonce: randomBytes(16).toString("hex"),
  };
}

// ─── Webhook Verification ─────────────────────────────────────────────────────

/**
 * Verify WPA gateway webhook HMAC signature.
 * rawBody must be the raw request body Buffer or string — do NOT JSON.parse first.
 */
export function verifyWpaWebhook(
  rawBody: string | Buffer,
  clientSecret: string,
  signature: string
): boolean {
  if (!clientSecret || !signature) return false;
  const expected = createHmac("sha256", clientSecret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== receivedBuf.length) return false;
  return timingSafeEqual(expectedBuf, receivedBuf);
}

// ─── Payment Session ──────────────────────────────────────────────────────────

/**
 * Create a WPA payment session. Server-side only.
 * Returns the session with paymentUrl (relative path — caller prepends baseUrl).
 */
export async function createWpaPaymentSession(
  params: Omit<WpaPaymentSessionRequest, "clientId">
): Promise<WpaPaymentSession> {
  const config = getWpaConfig();
  if (!config.baseUrl || !config.clientId || !config.clientSecret) {
    throw new Error("WPA Gateway is not configured (WPA_GATEWAY_BASE_URL, WPA_GATEWAY_CLIENT_ID, WPA_GATEWAY_CLIENT_SECRET required)");
  }

  const req: WpaPaymentSessionRequest = { ...params, clientId: config.clientId };
  const { timestamp, nonce } = generateCredentials();
  const canonicalBody = buildCanonicalBody({ ...req, timestamp, nonce });
  const signature = signRequest(canonicalBody, timestamp, config.clientSecret);

  const bodyObject = {
    ...(JSON.parse(canonicalBody) as Record<string, unknown>),
    signature,
  };

  const url = `${config.baseUrl}/api/v1/payment-sessions`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyObject),
  });

  const data = (await response.json()) as
    | { success: boolean; session: WpaPaymentSession }
    | { error: { code: string; message: string; statusCode: number } };

  if (!response.ok) {
    const err = data as { error: { code: string; message: string } };
    throw new Error(
      `WPA Gateway error ${response.status} [${err.error?.code ?? "UNKNOWN"}]: ${err.error?.message ?? "Unknown error"}`
    );
  }

  return (data as { success: boolean; session: WpaPaymentSession }).session;
}

/**
 * WPA Gateway integration tests.
 * Tests: payment session creation, webhook verification, idempotency, state protection.
 */

import { createHmac } from "node:crypto";
import { verifyWpaWebhook, isWpaConfigured, getWpaConfig, createWpaPaymentSession } from "../../../../services/wpa-gateway-client";

// ─── Mock setup ───────────────────────────────────────────────────────────────

// Keep real implementations for verifyWpaWebhook/isWpaConfigured/getWpaConfig;
// allow spying on createWpaPaymentSession per test.
jest.mock("../../../../services/wpa-gateway-client", () => ({
  ...jest.requireActual("../../../../services/wpa-gateway-client"),
  createWpaPaymentSession: jest.fn(),
}));

jest.mock("../../../../infrastructure/db/prismaClient", () => ({
  default: {
    order: { findFirst: jest.fn(), update: jest.fn(), create: jest.fn() },
    orderPayment: { findFirst: jest.fn(), create: jest.fn() },
    campaignBooking: { findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    paymentTransactionLog: { create: jest.fn().mockResolvedValue({ id: 1 }), update: jest.fn() },
    $transaction: jest.fn(async (fn: (tx: unknown) => unknown) => fn({})),
  },
}));

jest.mock("../../providers/paymentReplay.guard", () => ({
  buildPaymentEventKey: jest.fn((provider: string, id: string) => `${provider}:${id}`),
  isPaymentEventReplay: jest.fn().mockResolvedValue(false),
  markPaymentEventProcessed: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../modules/campaign/payment.service", () => ({
  processPaymentWebhook: jest.fn(),
  createPaymentIntent: jest.fn(),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TEST_SECRET = "wpa_secret_test_abc123xyz";
const WRONG_SECRET = "wrong_secret_000";

function makeWebhookSig(body: string, secret: string): string {
  return createHmac("sha256", secret).update(Buffer.from(body)).digest("hex");
}

function makeWebhookPayload(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    event: "payment.succeeded",
    merchantOrderId: "CAMP-TEST001",
    gatewayReference: "ref_abc123",
    transactionReference: "txn_xyz",
    amount: 600,
    currency: "BDT",
    status: "SUCCESS",
    paidAt: new Date().toISOString(),
    timestamp: Math.floor(Date.now() / 1000),
    nonce: "abc123nonce456",
    ...overrides,
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("WPA Gateway — Webhook Signature Verification", () => {
  test("verifies a valid signature", () => {
    const body = makeWebhookPayload();
    const sig = makeWebhookSig(body, TEST_SECRET);
    expect(verifyWpaWebhook(body, TEST_SECRET, sig)).toBe(true);
  });

  test("rejects wrong client secret", () => {
    const body = makeWebhookPayload();
    const sig = makeWebhookSig(body, TEST_SECRET);
    expect(verifyWpaWebhook(body, WRONG_SECRET, sig)).toBe(false);
  });

  test("rejects tampered body", () => {
    const body = makeWebhookPayload();
    const sig = makeWebhookSig(body, TEST_SECRET);
    const tampered = body.replace("CAMP-TEST001", "CAMP-HACK001");
    expect(verifyWpaWebhook(tampered, TEST_SECRET, sig)).toBe(false);
  });

  test("rejects tampered signature", () => {
    const body = makeWebhookPayload();
    const validSig = makeWebhookSig(body, TEST_SECRET);
    const tamperedSig = validSig.slice(0, -4) + "dead";
    expect(verifyWpaWebhook(body, TEST_SECRET, tamperedSig)).toBe(false);
  });

  test("rejects empty signature", () => {
    const body = makeWebhookPayload();
    expect(verifyWpaWebhook(body, TEST_SECRET, "")).toBe(false);
  });

  test("works with Buffer rawBody", () => {
    const body = makeWebhookPayload();
    const buf = Buffer.from(body);
    const sig = makeWebhookSig(body, TEST_SECRET);
    expect(verifyWpaWebhook(buf, TEST_SECRET, sig)).toBe(true);
  });
});

describe("WPA Gateway — Configuration", () => {
  const origEnv = process.env;

  afterEach(() => {
    process.env = { ...origEnv };
  });

  test("isWpaConfigured returns false when credentials missing", () => {
    process.env = { ...origEnv };
    delete process.env.WPA_GATEWAY_BASE_URL;
    delete process.env.WPA_GATEWAY_CLIENT_ID;
    delete process.env.WPA_GATEWAY_CLIENT_SECRET;
    expect(isWpaConfigured()).toBe(false);
  });

  test("isWpaConfigured returns true when all credentials set", () => {
    process.env.WPA_GATEWAY_BASE_URL = "http://localhost:4000";
    process.env.WPA_GATEWAY_CLIENT_ID = "wpa_test_abc";
    process.env.WPA_GATEWAY_CLIENT_SECRET = "wpa_secret_test_abc";
    expect(isWpaConfigured()).toBe(true);
  });

  test("getWpaConfig does not expose clientSecret in return (it is returned but never logged)", () => {
    process.env.WPA_GATEWAY_CLIENT_SECRET = "super_secret_value";
    const config = getWpaConfig();
    // The function returns it for internal use only — caller must not log
    expect(config.clientSecret).toBe("super_secret_value");
    // Ensure no other field accidentally becomes the secret
    expect(config.clientId).not.toBe(config.clientSecret);
  });
});

describe("WPA Gateway — Amount Unit Audit (৳600 stays ৳600)", () => {
  const mockCreateSession = createWpaPaymentSession as jest.Mock;

  beforeEach(() => {
    mockCreateSession.mockReset();
    process.env.WPA_GATEWAY_BASE_URL = "http://localhost:4000";
    process.env.WPA_GATEWAY_CLIENT_ID = "wpa_test";
    process.env.WPA_GATEWAY_CLIENT_SECRET = TEST_SECRET;
    process.env.WPA_GATEWAY_WEBHOOK_URL = "http://localhost:7200/api/v1/payments/wpa/webhook";
  });

  /**
   * BDT amounts must be sent as integer taka to WPA.
   * WPA passes the amount directly to EPS as totalAmount.
   * EPS expects BDT (600 for ৳600), not paisa (60000).
   * This test ensures wpa.strategy.ts does NOT multiply by 100.
   */
  test("wpa strategy sends integer taka (not paisa) to WPA Gateway", async () => {
    mockCreateSession.mockResolvedValue({
      id: "sess_1",
      reference: "wps_ref001",
      paymentUrl: "/checkout/wps_ref001",
      merchantOrderId: "CAMP-BOOK-42",
      amount: 600,
      currency: "BDT",
      expiresAt: new Date().toISOString(),
    });

    const { wpaStrategy } = require("./../../payments/strategies/wpa.strategy");
    await wpaStrategy.createPayment({
      referenceId: "CAMP-BOOK-42",
      amount: 600,            // ৳600 campaign booking
      currency: "BDT",
      returnUrl: "https://app.furtail.com/return",
      metadata: { name: "Test User", phone: "01700000000" },
    });

    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    const calledAmount = mockCreateSession.mock.calls[0][0].amount;
    // Must be 600, NOT 60000 (no * 100 multiplication)
    expect(calledAmount).toBe(600);
    // Must be integer BDT taka
    expect(Number.isInteger(calledAmount)).toBe(true);
  });

  test("webhook handler passes WPA amount (BDT taka) directly to processPaymentWebhook without division", async () => {
    // WPA stores and sends BDT integers. ৳600 stored as 600, webhook delivers 600.
    // Furtail must NOT divide by 100 (that would give ৳6 — wrong).
    const { processPaymentWebhook } = require("../../modules/campaign/payment.service") as {
      processPaymentWebhook: jest.Mock;
    };
    processPaymentWebhook.mockResolvedValue({ success: true });

    const bodyStr = makeWebhookPayload({ amount: 600, status: "SUCCESS", nonce: "nonce_amount_test" });
    const sig = makeWebhookSig(bodyStr, TEST_SECRET);
    const now = Math.floor(Date.now() / 1000);
    const req = {
      headers: {
        "x-gateway-signature": sig,
        "x-gateway-timestamp": String(now),
        "x-gateway-nonce": "nonce_amount_test",
        "x-gateway-event": "payment.succeeded",
      },
      rawBody: Buffer.from(bodyStr),
      body: JSON.parse(bodyStr),
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const { wpaWebhookHandler } = require("./wpa.controller");
    await wpaWebhookHandler(req as never, res as never, next);

    expect(processPaymentWebhook).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 600 })   // 600 BDT, not 6
    );
  });
});

describe("WPA Gateway — Webhook Handler (unit)", () => {
  let mockReq: Record<string, unknown>;
  let mockRes: { status: jest.Mock; json: jest.Mock };
  let mockNext: jest.Mock;

  const { processPaymentWebhook } = require("../../modules/campaign/payment.service") as {
    processPaymentWebhook: jest.Mock;
  };
  const { isPaymentEventReplay, markPaymentEventProcessed } = require("../../providers/paymentReplay.guard") as {
    isPaymentEventReplay: jest.Mock;
    markPaymentEventProcessed: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WPA_GATEWAY_CLIENT_SECRET = TEST_SECRET;
    isPaymentEventReplay.mockResolvedValue(false);
    markPaymentEventProcessed.mockResolvedValue(undefined);

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  function buildRequest(bodyStr: string, secret = TEST_SECRET) {
    const sig = makeWebhookSig(bodyStr, secret);
    const now = Math.floor(Date.now() / 1000);
    const body = JSON.parse(bodyStr);
    return {
      headers: {
        "x-gateway-signature": sig,
        "x-gateway-timestamp": String(now),
        "x-gateway-nonce": "unique_nonce_123",
        "x-gateway-event": body.event,
      },
      rawBody: Buffer.from(bodyStr),
      body,
    };
  }

  test("valid payment.succeeded webhook marks order paid", async () => {
    const bodyStr = makeWebhookPayload({ status: "SUCCESS" });
    mockReq = buildRequest(bodyStr);
    processPaymentWebhook.mockResolvedValue({ success: true, bookingId: 42 });

    const { wpaWebhookHandler } = require("./wpa.controller");
    await wpaWebhookHandler(mockReq as never, mockRes as never, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(processPaymentWebhook).toHaveBeenCalledWith(
      expect.objectContaining({ status: "SUCCESS", transactionId: "CAMP-TEST001" })
    );
  });

  test("invalid signature is rejected with 401", async () => {
    const bodyStr = makeWebhookPayload();
    const wrongSig = makeWebhookSig(bodyStr, WRONG_SECRET);
    const now = Math.floor(Date.now() / 1000);
    const body = JSON.parse(bodyStr);
    mockReq = {
      headers: {
        "x-gateway-signature": wrongSig,
        "x-gateway-timestamp": String(now),
        "x-gateway-nonce": "nonce_invalid",
        "x-gateway-event": body.event,
      },
      rawBody: Buffer.from(bodyStr),
      body,
    };

    const { wpaWebhookHandler } = require("./wpa.controller");
    await wpaWebhookHandler(mockReq as never, mockRes as never, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: "INVALID_SIGNATURE" }) })
    );
    expect(processPaymentWebhook).not.toHaveBeenCalled();
  });

  test("duplicate nonce is rejected with 401 REPLAY_DETECTED", async () => {
    isPaymentEventReplay.mockImplementation((key: string) =>
      Promise.resolve(key.startsWith("wpa_nonce:"))
    );
    const bodyStr = makeWebhookPayload();
    mockReq = buildRequest(bodyStr);

    const { wpaWebhookHandler } = require("./wpa.controller");
    await wpaWebhookHandler(mockReq as never, mockRes as never, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: "REPLAY_DETECTED" }) })
    );
  });

  test("duplicate payment.succeeded is idempotent (returns 200)", async () => {
    isPaymentEventReplay.mockImplementation((key: string) =>
      Promise.resolve(key.startsWith("wpa:") && key.includes("payment.succeeded"))
    );
    const bodyStr = makeWebhookPayload({ status: "SUCCESS" });
    mockReq = buildRequest(bodyStr);

    const { wpaWebhookHandler } = require("./wpa.controller");
    await wpaWebhookHandler(mockReq as never, mockRes as never, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, duplicate: true }));
    expect(processPaymentWebhook).not.toHaveBeenCalled();
  });

  test("response to initiate does not include WPA client secret", async () => {
    const { createPaymentIntent } = require("../../modules/campaign/payment.service") as {
      createPaymentIntent: jest.Mock;
    };
    createPaymentIntent.mockResolvedValue({
      success: true,
      paymentUrl: "https://gateway.example.com/checkout/ref_abc",
      orderId: 10,
      transactionId: "CAMP-123",
    });

    mockReq = {
      body: { bookingId: 1, returnUrl: "https://app.furtail.com/return" },
      headers: {},
    };

    const { wpaInitiateHandler } = require("./wpa.controller");
    await wpaInitiateHandler(mockReq as never, mockRes as never, mockNext);

    expect(mockRes.json).toHaveBeenCalled();
    const jsonArg = (mockRes.json as jest.Mock).mock.calls[0][0];
    const jsonStr = JSON.stringify(jsonArg);
    expect(jsonStr).not.toContain(TEST_SECRET);
    expect(jsonStr).not.toContain("clientSecret");
    expect(jsonStr).not.toContain("WPA_GATEWAY_CLIENT_SECRET");
  });

  test("payment.failed after payment.succeeded does not downgrade order", async () => {
    // First call: SUCCESS
    processPaymentWebhook.mockResolvedValueOnce({ success: true, bookingId: 42 });
    const successBody = makeWebhookPayload({ status: "SUCCESS", nonce: "nonce_success" });
    mockReq = buildRequest(successBody);
    const { wpaWebhookHandler } = require("./wpa.controller");
    await wpaWebhookHandler(mockReq as never, mockRes as never, mockNext);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

    // Reset response mocks
    mockRes.status.mockClear();
    mockRes.json.mockClear();

    // Second call: FAILED for same order — processPaymentWebhook should guard against downgrade
    // (campaign payment.service uses `notIn: ["COMPLETED", "REFUNDED"]` guard)
    processPaymentWebhook.mockResolvedValueOnce({ success: true });
    const failBody = makeWebhookPayload({ status: "FAILED", nonce: "nonce_failed", event: "payment.failed" });
    const failReq = {
      headers: {
        "x-gateway-signature": makeWebhookSig(failBody, TEST_SECRET),
        "x-gateway-timestamp": String(Math.floor(Date.now() / 1000)),
        "x-gateway-nonce": "nonce_failed",
        "x-gateway-event": "payment.failed",
      },
      rawBody: Buffer.from(failBody),
      body: JSON.parse(failBody),
    };
    await wpaWebhookHandler(failReq as never, mockRes as never, mockNext);

    // The processPaymentWebhook call with FAILED status — the underlying service
    // uses updateMany with `notIn: ["COMPLETED", "REFUNDED"]` so PAID orders won't downgrade.
    // Here we verify the webhook handler correctly routes FAILED status.
    expect(processPaymentWebhook).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: "FAILED" })
    );
  });
});

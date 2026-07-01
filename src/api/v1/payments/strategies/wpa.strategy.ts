import type { PaymentProviderStrategy } from "../paymentProvider.interface";
import type { PaymentIntentRequest, PaymentIntentResponse, VerifiedPaymentEvent } from "../../providers/paymentProvider.types";
import type { WebhookHandleInput } from "../payment.types";
import {
  createWpaPaymentSession,
  isWpaConfigured,
  getWpaConfig,
} from "../../../../services/wpa-gateway-client";
import { getRequiredWpaEnvKeys } from "../../providers/paymentProvider.config";

export const wpaStrategy: PaymentProviderStrategy = {
  code: "wpa",

  isConfigured: isWpaConfigured,

  validateConfig() {
    return getRequiredWpaEnvKeys().filter((k) => !process.env[k]?.trim());
  },

  async createPayment(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    const config = getWpaConfig();

    const successUrl = request.returnUrl;
    const callbackUrl = config.callbackUrl || request.returnUrl;
    const cancelUrl = request.cancelUrl;
    const webhookUrl = config.webhookUrl || undefined;

    const customerPhone = request.metadata?.phone;
    const customerName = request.metadata?.name || "Customer";
    const description = request.metadata?.description;

    try {
      const session = await createWpaPaymentSession({
        merchantOrderId: request.referenceId,
        amount: Math.round(request.amount),
        currency: request.currency || "BDT",
        customerName,
        customerPhone,
        description,
        successUrl,
        callbackUrl,
        cancelUrl,
        webhookUrl,
        metadata: { referenceId: request.referenceId },
      });

      const paymentUrl = `${config.baseUrl}${session.paymentUrl}`;

      return {
        success: true,
        redirectUrl: paymentUrl,
        providerPaymentId: session.reference,
        metadata: {
          gatewayReference: session.reference,
          sessionId: session.id,
          merchantOrderId: session.merchantOrderId,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "WPA payment session creation failed",
      };
    }
  },

  async verifyPayment(): Promise<VerifiedPaymentEvent | null> {
    // WPA is webhook-only — no active polling endpoint
    return null;
  },

  async handleWebhook(_input: WebhookHandleInput): Promise<VerifiedPaymentEvent | null> {
    // WPA webhook HMAC verification requires raw body.
    // Use the dedicated POST /payments/wpa/webhook route instead of the generic webhook handler.
    // This strategy method is intentionally not used for WPA.
    return null;
  },
};

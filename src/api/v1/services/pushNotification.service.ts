import prisma from "../../../infrastructure/db/prismaClient";

type PushPayload = {
  notificationId: number;
  recipientUserId: number;
  type: string;
  title: string;
  body: string;
  actorId?: number | null;
  actorName?: string | null;
  actorAvatarUrl?: string | null;
  targetType?: string | null;
  targetId?: string | number | null;
  route?: string | null;
  deepLink?: string | null;
  actionUrl?: string | null;
};

let firebaseAdmin: any | null | undefined;

function normalizePrivateKey(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.replace(/\\n/g, "\n");
}

function getFirebaseAdmin(): any | null {
  if (firebaseAdmin !== undefined) return firebaseAdmin;
  try {
    // Optional dependency/config: social endpoints must not fail when push is not configured.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const admin = require("firebase-admin");
    if (admin.apps?.length) {
      firebaseAdmin = admin;
      return firebaseAdmin;
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = normalizePrivateKey(serviceAccount.private_key);
      }
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_USE_APPLICATION_DEFAULT === "true") {
      admin.initializeApp({ credential: admin.credential.applicationDefault() });
    } else {
      firebaseAdmin = null;
      return null;
    }

    firebaseAdmin = admin;
    return firebaseAdmin;
  } catch (e) {
    console.warn("[PushNotificationService] Firebase Admin unavailable:", (e as Error)?.message || e);
    firebaseAdmin = null;
    return null;
  }
}

function compactData(payload: PushPayload): Record<string, string> {
  const data: Record<string, string> = {
    notificationId: String(payload.notificationId),
    type: payload.type,
    recipientUserId: String(payload.recipientUserId),
  };
  const optional: Record<string, unknown> = {
    actorId: payload.actorId,
    actorName: payload.actorName,
    actorAvatarUrl: payload.actorAvatarUrl,
    targetType: payload.targetType,
    targetId: payload.targetId,
    route: payload.route,
    deepLink: payload.deepLink,
    actionUrl: payload.actionUrl || payload.route || payload.deepLink || null,
  };
  for (const [key, value] of Object.entries(optional)) {
    if (value !== undefined && value !== null && String(value).length > 0) {
      data[key] = String(value);
    }
  }
  return data;
}

function isInvalidTokenError(error: any): boolean {
  const code = String(error?.code || error?.errorInfo?.code || "");
  return code.includes("registration-token-not-registered") ||
    code.includes("invalid-registration-token") ||
    code.includes("messaging/registration-token-not-registered") ||
    code.includes("messaging/invalid-registration-token");
}

export async function sendPushToUser(payload: PushPayload): Promise<{ sent: number; failed: number; skipped: boolean }> {
  const admin = getFirebaseAdmin();
  if (!admin) return { sent: 0, failed: 0, skipped: true };

  const tokens = await (prisma as any).userDeviceToken.findMany({
    where: { userId: payload.recipientUserId, isActive: true },
    select: { id: true, token: true },
  });
  if (!tokens.length) return { sent: 0, failed: 0, skipped: false };

  const message = {
    tokens: tokens.map((row: { token: string }) => row.token),
    notification: {
      title: payload.title,
      body: payload.body,
      ...(payload.actorAvatarUrl ? { imageUrl: payload.actorAvatarUrl } : {}),
    },
    data: compactData(payload),
    android: {
      priority: "high",
      notification: {
        channelId: "social_notifications",
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
        ...(payload.actorAvatarUrl ? { imageUrl: payload.actorAvatarUrl } : {}),
      },
    },
    apns: {
      payload: { aps: { sound: "default" } },
      fcmOptions: payload.actorAvatarUrl ? { imageUrl: payload.actorAvatarUrl } : undefined,
    },
  };

  const response = await admin.messaging().sendEachForMulticast(message);
  const inactiveIds: number[] = [];
  response.responses.forEach((result: any, index: number) => {
    if (!result.success && isInvalidTokenError(result.error)) {
      inactiveIds.push(tokens[index].id);
    }
  });

  if (inactiveIds.length) {
    await (prisma as any).userDeviceToken.updateMany({
      where: { id: { in: inactiveIds } },
      data: { isActive: false },
    });
  }

  return { sent: response.successCount, failed: response.failureCount, skipped: false };
}

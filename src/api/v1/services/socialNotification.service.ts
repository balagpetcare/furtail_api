import prisma from "../../../infrastructure/db/prismaClient";
import { createNotification } from "./notification.service";
import { sendPushToUser } from "./pushNotification.service";
const { resolveClientMediaUrl } = require("../../../shared/storage/publicMediaUrl");

type SocialNotificationType =
  | "FRIEND_REQUEST_RECEIVED"
  | "FRIEND_REQUEST_ACCEPTED"
  | "USER_FOLLOWED"
  | "PET_FOLLOWED"
  | "PET_LIKED";

type TargetType = "USER" | "PET" | "FRIEND_REQUEST";

type SocialNotificationInput = {
  recipientUserId: number;
  actorUserId: number;
  type: SocialNotificationType;
  targetType?: TargetType | null;
  targetId?: number | string | null;
  route?: string | null;
  title?: string;
  body?: string;
  metadata?: Record<string, unknown> | null;
  dedupeKey?: string | null;
};

async function getActor(actorUserId: number): Promise<{ actorName: string; actorAvatarUrl: string | null }> {
  const actor = await prisma.user.findUnique({
    where: { id: actorUserId },
    select: {
      profile: {
        select: {
          displayName: true,
          username: true,
          avatarMedia: { select: { url: true, key: true } },
        },
      },
    },
  });
  const rawUrl = actor?.profile?.avatarMedia?.url;
  const key = actor?.profile?.avatarMedia?.key;
  return {
    actorName: actor?.profile?.displayName || actor?.profile?.username || "Someone",
    actorAvatarUrl: rawUrl ? resolveClientMediaUrl({ url: rawUrl, key }) : null,
  };
}

function defaultCopy(type: SocialNotificationType, actorName: string, metadata?: Record<string, unknown> | null) {
  const petName = metadata?.petName ? String(metadata.petName) : "your pet";
  switch (type) {
    case "FRIEND_REQUEST_RECEIVED":
      return { title: "New friend request", body: `${actorName} sent you a friend request` };
    case "FRIEND_REQUEST_ACCEPTED":
      return { title: "Friend request accepted", body: `${actorName} accepted your friend request` };
    case "USER_FOLLOWED":
      return { title: "New follower", body: `${actorName} followed you` };
    case "PET_FOLLOWED":
      return { title: "New pet follower", body: `${actorName} followed ${petName}` };
    case "PET_LIKED":
      return { title: "New pet like", body: `${actorName} liked ${petName}` };
  }
}

export async function createSocialNotification(input: SocialNotificationInput) {
  if (!input.recipientUserId || !input.actorUserId) return { created: false, notification: null };
  if (input.recipientUserId === input.actorUserId) return { created: false, notification: null };

  const actor = await getActor(input.actorUserId);
  const copy = defaultCopy(input.type, actor.actorName, input.metadata);
  const route = input.route ||
    (input.targetType === "PET" && input.targetId ? `/pet/${input.targetId}` : `/profile/${input.actorUserId}`);

  const meta = {
    ...(input.metadata || {}),
    actorId: input.actorUserId,
    actorName: actor.actorName,
    actorAvatarUrl: actor.actorAvatarUrl,
    targetType: input.targetType ?? null,
    targetId: input.targetId ?? null,
    route,
    deepLink: route,
  };

  const result = await createNotification({
    userId: input.recipientUserId,
    type: input.type as any,
    title: input.title || copy.title,
    message: input.body || copy.body,
    meta,
    priority: "P2",
    actionUrl: route,
    dedupeKey: input.dedupeKey || `${input.type}:${input.recipientUserId}:${input.actorUserId}:${input.targetType || ""}:${input.targetId || ""}`,
    senderId: input.actorUserId,
    source: "social",
    severity: "info",
  });

  if (result.created && result.notification) {
    const push = await sendPushToUser({
      notificationId: result.notification.id,
      recipientUserId: input.recipientUserId,
      type: input.type,
      title: result.notification.title,
      body: result.notification.message,
      actorId: input.actorUserId,
      actorName: actor.actorName,
      actorAvatarUrl: actor.actorAvatarUrl,
      targetType: input.targetType ?? null,
      targetId: input.targetId ?? null,
      route,
      deepLink: route,
    }).catch((e) => {
      console.warn("[SocialNotification] push failed:", (e as Error)?.message || e);
      return { sent: 0, failed: 1, skipped: false };
    });

    await prisma.notificationDelivery.create({
      data: {
        notificationId: result.notification.id,
        channel: "PUSH" as any,
        status: push.sent > 0 ? "SENT" : push.skipped ? "QUEUED" : "FAILED",
        attemptCount: push.skipped ? 0 : 1,
        error: push.skipped ? "FCM not configured or no active token" : push.failed > 0 && push.sent === 0 ? "Push delivery failed" : undefined,
      },
    }).catch(() => {});
  }

  return result;
}

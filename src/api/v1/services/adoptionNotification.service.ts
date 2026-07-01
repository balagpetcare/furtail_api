import prisma from "../../../infrastructure/db/prismaClient";
import { createNotification } from "./notification.service";
import { sendPushToUser } from "./pushNotification.service";

type AdoptionNotificationInput = {
  recipientUserId: number;
  actorUserId?: number | null;
  type:
    | "ADOPTION_LIKE"
    | "ADOPTION_COMMENT"
    | "ADOPTION_APPLICATION_SUBMITTED"
    | "ADOPTION_APPLICATION_APPROVED"
    | "ADOPTION_APPLICATION_REJECTED"
    | "ADOPTION_APPLICATION_SHORTLISTED"
    | "ADOPTION_APPLICATION_INTERVIEW_SCHEDULED"
    | "ADOPTION_APPLICATION_MORE_INFO_REQUESTED"
    | "ADOPTION_LISTING_STATUS_CHANGED";
  title: string;
  body: string;
  route: string;
  targetId: number;
  targetType: "ADOPTION" | "ADOPTION_COMMENTS" | "ADOPTION_APPLICATION";
  metadata?: Record<string, unknown> | null;
  dedupeKey?: string | null;
  priority?: "P0" | "P1" | "P2";
};

async function getActor(actorUserId?: number | null): Promise<{
  actorName: string | null;
  actorAvatarUrl: string | null;
}> {
  if (!actorUserId) {
    return { actorName: null, actorAvatarUrl: null };
  }

  const actor = await prisma.user.findUnique({
    where: { id: actorUserId },
    select: {
      profile: {
        select: {
          displayName: true,
          username: true,
          avatarMedia: { select: { url: true } },
        },
      },
    },
  });

  return {
    actorName: actor?.profile?.displayName || actor?.profile?.username || "Someone",
    actorAvatarUrl: actor?.profile?.avatarMedia?.url || null,
  };
}

export async function createAdoptionNotification(input: AdoptionNotificationInput) {
  if (!input.recipientUserId) return { created: false, notification: null };
  if (input.actorUserId && Number(input.recipientUserId) === Number(input.actorUserId)) {
    return { created: false, notification: null };
  }

  const actor = await getActor(input.actorUserId);
  const meta = {
    ...(input.metadata || {}),
    actorId: input.actorUserId ?? null,
    actorName: actor.actorName,
    actorAvatarUrl: actor.actorAvatarUrl,
    targetType: input.targetType,
    targetId: input.targetId,
    route: input.route,
    deepLink: input.route,
  };

  const result = await createNotification({
    userId: input.recipientUserId,
    type: input.type as any,
    title: input.title,
    message: input.body,
    meta,
    priority: input.priority || "P2",
    actionUrl: input.route,
    dedupeKey: input.dedupeKey || null,
    senderId: input.actorUserId ?? undefined,
    source: "adoptions",
    severity: "info",
  });

  if (result.created && result.notification) {
    const push = await sendPushToUser({
      notificationId: result.notification.id,
      recipientUserId: input.recipientUserId,
      type: input.type.toLowerCase(),
      title: input.title,
      body: input.body,
      actorId: input.actorUserId ?? null,
      actorName: actor.actorName,
      actorAvatarUrl: actor.actorAvatarUrl,
      targetType: input.targetType,
      targetId: input.targetId,
      route: input.route,
      deepLink: input.route,
      actionUrl: input.route,
    }).catch(() => ({ sent: 0, failed: 1, skipped: false }));

    await prisma.notificationDelivery.create({
      data: {
        notificationId: result.notification.id,
        channel: "PUSH" as any,
        status: push.sent > 0 ? "SENT" : push.skipped ? "QUEUED" : "FAILED",
        attemptCount: push.skipped ? 0 : 1,
        error: push.skipped
          ? "FCM not configured or no active token"
          : push.failed > 0 && push.sent === 0
          ? "Push delivery failed"
          : undefined,
      },
    }).catch(() => {});
  }

  return result;
}

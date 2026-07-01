ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'FRIEND_REQUEST_RECEIVED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'FRIEND_REQUEST_ACCEPTED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'USER_FOLLOWED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PET_FOLLOWED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PET_LIKED';

ALTER TYPE "NotificationDeliveryChannel" ADD VALUE IF NOT EXISTS 'PUSH';

CREATE TABLE IF NOT EXISTS "user_device_tokens" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "token" TEXT NOT NULL,
  "platform" VARCHAR(32) NOT NULL,
  "deviceId" VARCHAR(255),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_device_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_device_tokens_token_key" ON "user_device_tokens"("token");
CREATE INDEX IF NOT EXISTS "user_device_tokens_userId_isActive_idx" ON "user_device_tokens"("userId", "isActive");
CREATE INDEX IF NOT EXISTS "user_device_tokens_platform_idx" ON "user_device_tokens"("platform");

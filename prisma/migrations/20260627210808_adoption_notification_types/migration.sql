-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'ADOPTION_LIKE';
ALTER TYPE "NotificationType" ADD VALUE 'ADOPTION_COMMENT';
ALTER TYPE "NotificationType" ADD VALUE 'ADOPTION_APPLICATION_SUBMITTED';
ALTER TYPE "NotificationType" ADD VALUE 'ADOPTION_APPLICATION_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'ADOPTION_APPLICATION_REJECTED';
ALTER TYPE "NotificationType" ADD VALUE 'ADOPTION_LISTING_STATUS_CHANGED';

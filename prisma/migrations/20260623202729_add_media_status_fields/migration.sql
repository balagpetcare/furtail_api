-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "originalKey" TEXT,
ADD COLUMN     "status" "MediaStatus" NOT NULL DEFAULT 'READY',
ADD COLUMN     "thumbnailKey" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT;

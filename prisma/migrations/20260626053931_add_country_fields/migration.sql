-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "contentEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "currencySymbol" TEXT,
ADD COLUMN     "flagAssetUrl" TEXT,
ADD COLUMN     "flagEmoji" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSupported" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "iso3" TEXT,
ADD COLUMN     "paymentEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "supportEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "songArtist" TEXT,
ADD COLUMN     "songDurationMs" INTEGER,
ADD COLUMN     "songStartMs" INTEGER,
ADD COLUMN     "songTitle" TEXT;

-- AlterTable
ALTER TABLE "user_device_tokens" ALTER COLUMN "updatedAt" DROP DEFAULT;

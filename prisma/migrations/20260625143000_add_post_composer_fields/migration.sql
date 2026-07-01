DO $$ BEGIN
  CREATE TYPE "ComposerPostType" AS ENUM ('GENERAL', 'HEALTH_UPDATE', 'VACCINATION', 'LOST_PET', 'ADOPTION', 'SERVICE_REVIEW');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "posts"
  ADD COLUMN IF NOT EXISTS "postType" "ComposerPostType" NOT NULL DEFAULT 'GENERAL',
  ADD COLUMN IF NOT EXISTS "backgroundStyle" TEXT,
  ADD COLUMN IF NOT EXISTS "lostPetName" TEXT,
  ADD COLUMN IF NOT EXISTS "lostPetLocation" TEXT,
  ADD COLUMN IF NOT EXISTS "lostPetContactVisible" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "post_tagged_pets" (
  "id" SERIAL NOT NULL,
  "postId" INTEGER NOT NULL,
  "petId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "post_tagged_pets_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "post_tagged_pets"
    ADD CONSTRAINT "post_tagged_pets_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "post_tagged_pets"
    ADD CONSTRAINT "post_tagged_pets_petId_fkey"
    FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "post_tagged_pets_postId_petId_key" ON "post_tagged_pets"("postId", "petId");
CREATE INDEX IF NOT EXISTS "post_tagged_pets_petId_idx" ON "post_tagged_pets"("petId");

ALTER TABLE "media"
  ADD COLUMN IF NOT EXISTS "trimStartMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "trimEndMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "mute" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "volume" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "coverTimestampMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "aspectRatio" TEXT,
  ADD COLUMN IF NOT EXISTS "quality" TEXT;

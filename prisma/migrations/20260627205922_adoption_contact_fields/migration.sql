-- AlterTable
ALTER TABLE "adoption_applications" ADD COLUMN     "applicantCityAreaText" VARCHAR(160),
ADD COLUMN     "applicantName" VARCHAR(160),
ADD COLUMN     "applicantWhatsappPhone" VARCHAR(32);

-- AlterTable
ALTER TABLE "adoption_pets" ADD COLUMN     "ownerCityAreaText" VARCHAR(160),
ADD COLUMN     "ownerContactPhone" VARCHAR(32),
ADD COLUMN     "ownerWhatsappPhone" VARCHAR(32),
ADD COLUMN     "pickupLocationNotes" TEXT;

/**
 * Furtail public contact details for booking confirmation PDFs.
 * Override via env when needed for staging.
 */

export const BPA_PDF_ORG = {
  name: "Furtail (Furtail)",
  website: process.env.BPA_WEBSITE_URL || "https://furtail.world",
  email: process.env.BPA_CONTACT_EMAIL || "vetandpetcare@gmail.com",
  phone: process.env.BPA_CONTACT_PHONE || "01575-008300",
  address:
    process.env.BPA_CONTACT_ADDRESS ||
    "364 DIT Road, East Rampura, Dhaka 1219, Bangladesh",
} as const;

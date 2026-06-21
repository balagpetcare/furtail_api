# Furtail Vaccination 2026 — Booking PDF Download: Audit & Implementation Plan

**Date:** 2026-06-07  
**Project:** Furtail Vaccination Campaign 2026  
**Repos:** `backend-api`, `vaccination_2026`, `bpa_web` (admin/staff — certificate only), `furtail_app` (certificate wallet)  
**Status:** **Released** — see `docs/releases/pdf-booking-download-release.md`

**Related docs:**
- `docs/booking-confirmation-pdf.md` — API reference & deployment
- `docs/plans/vaccination-download-pdf-and-mobile-fix.md` — prior client-PDF plan (superseded)
- `docs/plans/vaccination-download-pdf-and-mobile-fix-implementation-report.md` — mobile + SMS work

---

## 1. Executive summary

| Question | Answer |
|----------|--------|
| Does a **booking confirmation PDF** feature exist? | **Yes** — server-generated PDF via `GET /api/v1/campaign/bookings/:reference/pdf` |
| Is PDF generated from client-only data? | **No** — data loaded from `campaign_bookings` and related Prisma relations |
| Can users re-download later? | **Yes** — My Booking lookup (`/booking/[ref]`) after claim; optional JWT owner path on API |
| Is this the same as **vaccination certificate PDF**? | **No** — certificate PDF is post-vaccination, Puppeteer/HTML, different endpoint |

**Library search (requested terms):**

| Library / pattern | Found in vaccination booking flow? | Where used elsewhere |
|-------------------|-----------------------------------|----------------------|
| jsPDF | **No** | — |
| html2canvas | **No** | — |
| pdfmake | **No** | — |
| `@react-pdf/renderer` / react-pdf | **Removed** from `vaccination_2026` (was interim client PDF) | — |
| pdfkit | **Yes (backend)** | `bookingPdf.service.ts`, `campaignExportFormats.ts`, admin export |
| Puppeteer | **No** for booking PDF | `certificate.service.ts` (vaccination certificate) |
| qrcode (npm) | **Yes (backend PDF embed)** | `bookingPdf.service.ts` |
| qrcode.react | **Yes (UI only)** | Success, confirm, lookup pages — not PDF export |

---

## 2. Codebase audit

### 2.1 Repositories scanned

| Repo | Role in booking PDF |
|------|---------------------|
| `backend-api` | PDF generation, security, route |
| `vaccination_2026` | Success/lookup UI, download client |
| `bpa_web` | Admin booking **export** PDF (CSV/XLSX/PDF rows), staff **certificate** PDF — not booking confirmation |
| `furtail_app` | Certificate wallet/share — not booking confirmation |
| `furtail-landing` | No PDF code |

### 2.2 Existing PDF-related features (distinction)

| Feature | Purpose | Generator | Endpoint / UI |
|---------|---------|-----------|---------------|
| **Booking confirmation PDF** | Pre-vaccination booking record | pdfkit + qrcode | `GET /api/v1/campaign/bookings/:ref/pdf` |
| **Vaccination certificate PDF** | Post-vaccination proof | Puppeteer (HTML → PDF) | `GET /api/v1/campaign/public/certificates/:token/pdf` |
| **Admin bookings export PDF** | Operator spreadsheet-style export | pdfkit | `GET /api/v1/admin/campaigns/:id/bookings/export?format=pdf` |

### 2.3 Page-by-page inspection (`vaccination_2026`)

| Route | File | PDF today | Notes |
|-------|------|-----------|-------|
| `/book/success` | `app/book/success/page.tsx` | **Yes** | Polls checkout status → `PostCheckoutSuccess` with `autoDownloadPdf` |
| `/book/payment/success` | `app/book/payment/success/page.tsx` | **No** | Legacy EPS redirect page; links to `/book/confirm/[ref]` only |
| `/book/confirm/[ref]` | `app/book/confirm/[ref]/page.tsx` | **No** | QR + booking summary; no download card |
| `/booking` | `app/booking/page.tsx` | **Indirect** | Claim form → stores `bpa_claim_{ref}` → redirects to detail |
| `/booking/[ref]` | `app/booking/[ref]/page.tsx` | **Yes** | `BookingPdfCard` when verification code in session |
| `/booking/list` | `app/booking/list/page.tsx` | **Partial gap** | Lists JWT bookings; detail page expects claim sessionStorage |
| `/verify/certificate` | `app/verify/certificate/page.tsx` | **N/A** | Certificate token verification, not booking PDF |

### 2.4 Frontend components (booking PDF)

| File | Responsibility |
|------|----------------|
| `lib/bookingPdfApi.ts` | `downloadBookingConfirmationPdf()`, sessionStorage auto-download guard |
| `components/booking/BookingPdfCard.tsx` | Download button, loading, error UI |
| `components/booking/PostCheckoutSuccess.tsx` | Payment success layout + one-time auto-download |
| `components/booking/steps/StepSuccess.tsx` | Booking ID, verification code, on-screen QR (`qrcode.react`) |
| `components/booking/SmsDeliveryBadge.tsx` | SMS status; prompts user to save PDF on failure |

**Removed (client-only PDF — no longer in repo):**
- `lib/bookingPdf.tsx`, `lib/bookingPdfData.ts`, `lib/bookingPdfTypes.ts`
- `components/booking/BookingPdfDocument.tsx`
- Dependency `@react-pdf/renderer`

### 2.5 QR code components (UI)

| Component / page | Library | QR payload |
|------------------|---------|------------|
| `StepSuccess.tsx` | `qrcode.react` | `booking.qrToken` (check-in token) |
| `StepConfirm.tsx` | `qrcode.react` | `{origin}/c/{qrToken}` |
| `app/book/confirm/[ref]/page.tsx` | `qrcode.react` | Same as confirm step |
| `app/booking/[ref]/page.tsx` | `qrcode.react` | `qrToken` or booking ref fallback |
| `components/landing/QrVerificationDemo.tsx` | `qrcode.react` | Demo verify URL |
| **PDF embedded QR** | `qrcode` (Node) | `https://vaccination.furtail.world/verify/certificate?ref={bookingRef}` |

### 2.6 Backend PDF utilities

| File | Role |
|------|------|
| `bookingPdf.service.ts` | Load booking payload, access control, rate limit, pdfkit layout, QR PNG |
| `bookingPdf.controller.ts` | HTTP handler, query `code` / `verificationCode`, optional JWT |
| `bookingPdf.service.test.ts` | Filename sanitization unit test |
| `certificate.service.ts` | Vaccination certificate (separate concern) |
| `export.service.ts` + `campaignExportFormats.ts` | Admin analytics/bookings export PDF |

### 2.7 Booking data sources

**Primary DB model:** `CampaignBooking` (+ relations)

| Field / relation | Used in PDF |
|------------------|-------------|
| `bookingRef` | Booking ID |
| `qrToken` → `generateVerificationCode()` | Verification code + access check |
| `ownerName`, `ownerPhone` | Customer (Guest → mobile as name) |
| `campaign.name` | Campaign title |
| `location`, `bookingArea`, `coverageZoneName` | Location / venue |
| `bookingDate`, `slot`, `bookingMode`, `status` | Schedule or “Will be sent via SMS” |
| `pets[]` + `animalType`, `breed`, `gender` | Pet details |
| `paymentStatus`, `paidAmount`, `checkoutSession` | Payment block |
| `ownerUserId` | JWT owner bypass for PDF without code |
| `smsSentAt` | Not in PDF; shown in UI badge only |

**Frontend types:** `BookingDetails` in `vaccination_2026/lib/campaignApi.ts`

**APIs feeding booking UI (not PDF body directly):**

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/campaign/public/checkout/init` | Start checkout |
| POST | `/api/v1/campaign/public/checkout/confirm-free` | Free booking confirm |
| GET | `/api/v1/campaign/public/checkout/:checkoutId/status` | Success page poll; returns `booking`, `verificationCode` |
| POST | `/api/v1/campaign/public/booking/claim` | My Booking lookup (phone + ref + code) |
| GET | `/api/v1/campaign/bookings/:reference/pdf` | **PDF download** |
| GET | `/api/v1/campaign/booking/my` | Authenticated booking list |

### 2.8 Campaign data structures (relevant subset)

```typescript
// vaccination_2026/lib/campaignApi.ts (abbreviated)
type BookingDetails = {
  bookingRef: string;
  qrToken: string;
  verificationCode?: string;
  status: string;
  bookingDate: string;
  paymentStatus?: string;
  petCount?: number;
  bookingMode?: "VENUE" | "ZONE_INTEREST";
  slot?: { startTime; endTime; sessionName? } | null;
  location?: { name; address? } | null;
  bookingArea?: string | null;
  coverageZoneName?: string | null;
  owner: { phone; name };
  pets: Array<{ name; vaccinationStatus; certificateToken? }>;
  campaign?: { name; slug };
  paidAmount?: number;
  paymentMethod?: string;
  smsDeliveryStatus?: "sent" | "pending" | "failed";
};
```

---

## 3. As-built architecture

```
Payment fulfilled
       │
       ▼
GET /checkout/:id/status  ──► booking + verificationCode
       │
       ▼
/book/success (PostCheckoutSuccess)
       │
       ├── sessionStorage bpa_booking_pdf_auto_{ref}  (once)
       └── GET /bookings/:ref/pdf?code=...  ──► pdfkit PDF blob ──► browser download

My Booking claim
       │
       ▼
POST /booking/claim  ──► sessionStorage bpa_claim_{ref}
       │
       ▼
/booking/[ref]  ──► BookingPdfCard ──► same PDF endpoint
```

**Security (implemented):**
- Path param `reference` required
- Query `code` or `verificationCode` must match `generateVerificationCode(qrToken)` **OR** JWT user matches `ownerUserId`
- Rate limit: 10 requests / 15 min per `ref:clientIp` (in-memory)
- Response: `application/pdf` attachment, `Cache-Control: private, no-store`

**Naming convention:** `Furtail-Vaccination-Booking-{BOOKING_REF}.pdf` (unsafe chars stripped)

---

## 4. Implementation plan

> **Note:** Sections A–D describe the **target design**. Items marked ✅ are implemented; items marked ⚠️ are gaps or enhancements.

### A. PDF download feature

#### Button locations

| Location | Status | Behavior |
|----------|--------|----------|
| `/book/success` (`PostCheckoutSuccess`) | ✅ | Auto-download once + manual “Download Booking PDF” |
| `/booking/[ref]` (My Booking detail) | ✅ | Manual download after claim |
| `/book/confirm/[ref]` | ⚠️ | No download button today |
| `/book/payment/success` (legacy) | ⚠️ | No PDF; consider redirect merge with `/book/success` |
| `/booking/list` (JWT list) | ⚠️ | Links to detail but detail needs claim session or owner JWT on API |

#### UI design

- **Pattern:** WowDash/Furtail booking card — `booking-card`, `booking-cta`, `booking-alert`
- **Copy:** “Official confirmation from Furtail servers…”
- **Mobile:** Full-width CTA (`w-100`), container max-width ~520px on lookup pages
- **Loading:** Button label “Downloading…” + `disabled` while fetch in flight ✅
- **Error:** Inline `booking-alert--danger` with API message ✅
- **Auto-download:** `sessionStorage` key `bpa_booking_pdf_auto_{ref}`; refresh does not repeat ✅

#### Recommended enhancements (optional)

1. Add `BookingPdfCard` to `/book/confirm/[ref]` for users who land there without visiting success.
2. For `/booking/list` → use JWT on PDF endpoint (no code) when opening detail as logged-in owner.
3. Add explicit “Print” hint (“Open downloaded PDF to print”) — browser print of PDF file is sufficient; no separate print HTML required for booking confirmation.

---

### B. PDF content

| Section | Required field | Implemented | Source |
|---------|----------------|-------------|--------|
| Header | Furtail logo | ✅ (drawn logo block) | pdfkit `drawBpaLogo` |
| Header | Organization name | ✅ | Static + campaign subtitle |
| Campaign | Campaign title | ✅ | `campaign.name` |
| Booking | Booking ID | ✅ | `bookingRef` |
| Booking | Verification code | ✅ | `generateVerificationCode(qrToken)` |
| Customer | Name | ✅ | `ownerName` or mobile if Guest |
| Customer | Mobile | ✅ | `ownerPhone` (normalized) |
| Location | Area / zone | ✅ | `bookingArea` / `coverageZoneName` / `location.name` |
| Venue | Venue name | ✅ | `location.name` when distinct |
| Schedule | Date/time | ✅ | Slot labels or “Will be sent via SMS” |
| Pets | Per-pet name, species, breed, gender | ✅ | `pets` relations |
| Pets | Pet count | ⚠️ implicit | Count = `pets.length`; not a separate labeled row |
| Payment | Status, method, amount | ✅ | `paymentStatus`, checkout session |
| QR | Verification URL | ✅ | `CAMPAIGN_LANDING_URL/verify/certificate?ref=` |
| Footer | Generation timestamp | ✅ | ISO → locale string |
| Footer | “Generated by Furtail Vaccination System” | ✅ | Static |
| **Contact** | Furtail phone / email / hotline | ⚠️ **Not in PDF today** | Available in `vaccination_2026/config/organization.ts` |

**Recommended PDF content additions:**
- Footer block: `01575-008300`, `vetandpetcare@gmail.com`, `/contact` URL
- Optional: explicit “Pet count: N” row
- Optional: embed real Furtail logo PNG/SVG from assets instead of drawn placeholder

**Furtail contact reference (frontend config):**

| Field | Value |
|-------|-------|
| Phone | `01575-008300` |
| Email | `vetandpetcare@gmail.com` |
| Website | `https://furtail.world` |
| Address | 364 DIT Road, East Rampura, Dhaka 1219 |

---

### C. Technical design

#### Library selection (decision record)

| Option | Verdict | Rationale |
|--------|---------|-----------|
| jsPDF / html2canvas / pdfmake | **Rejected** | Not in stack; client-only data risk |
| `@react-pdf/renderer` | **Rejected (removed)** | Duplicated server truth; extra client bundle |
| **pdfkit + qrcode (server)** | **Selected ✅** | Matches certificate/export patterns; authoritative DB data |
| Puppeteer for booking | **Not used** | Heavier; reserved for certificate HTML layout |

#### Component architecture

```
vaccination_2026                          backend-api
─────────────────                         ────────────
BookingPdfCard.tsx                        bookingPdf.controller.ts
    └── bookingPdfApi.ts                      └── bookingPdf.service.ts
            └── fetch → /api/.../pdf              ├── loadBookingPdfPayload()
            └── blob → <a download>             └── generateBookingConfirmationPdfBuffer()
PostCheckoutSuccess.tsx
    └── useEffect auto-download (once)
```

#### Reusable utilities

| Utility | Location | Functions |
|---------|----------|-----------|
| PDF download client | `vaccination_2026/lib/bookingPdfApi.ts` | `downloadBookingConfirmationPdf`, auto-download keys |
| Verification code | `backend-api/.../qr.service.ts` | `generateVerificationCode` |
| Phone normalize | `campaign.utils.ts` / `vaccination_2026/lib/phone.ts` | BD phone formatting |
| PDF filename | `bookingPdf.service.ts` | `bookingPdfFilename` |

#### Print support

- **Primary:** User downloads PDF → opens in OS/browser PDF viewer → Print (A4 layout, margin 48pt) ✅
- **No** separate `@media print` HTML page for booking confirmation (certificate module may add later)
- PDF is print-friendly: single A4, high-contrast Furtail teal `#00695C`

#### PDF naming convention

```
Furtail-Vaccination-Booking-{BOOKING_REF}.pdf
```

Example: `Furtail-Vaccination-Booking-VAC-ABC123.pdf`

---

### D. Deployment impact

#### Routes affected

| Layer | Route / endpoint |
|-------|------------------|
| API | `GET /api/v1/campaign/bookings/:reference/pdf` |
| Next rewrite | `/api/*` → `API_BASE_URL` (port **3000** fixed) |
| UI | `/book/success`, `/booking/[ref]` |

#### Components / files (touch map)

**backend-api**

- `src/api/v1/modules/campaign/bookingPdf.service.ts`
- `src/api/v1/modules/campaign/bookingPdf.controller.ts`
- `src/api/v1/modules/campaign/campaign.routes.ts`
- `src/api/v1/modules/campaign/bookingPdf.service.test.ts`
- `docs/booking-confirmation-pdf.md`

**vaccination_2026**

- `lib/bookingPdfApi.ts`
- `components/booking/BookingPdfCard.tsx`
- `components/booking/PostCheckoutSuccess.tsx`
- `app/book/success/page.tsx`
- `app/booking/[ref]/page.tsx`

#### Dependencies

| Package | Repo | Purpose |
|---------|------|---------|
| `pdfkit` | backend-api | PDF layout |
| `@types/pdfkit` | backend-api | Types |
| `qrcode` | backend-api | QR PNG in PDF |
| `qrcode.react` | vaccination_2026 | On-screen QR only |

**Not required:** jsPDF, html2canvas, pdfmake, `@react-pdf/renderer`

#### Environment

| Variable | Purpose |
|----------|---------|
| `CAMPAIGN_LANDING_URL` | QR + footer verify URL in PDF (default: production vaccination host) |
| `API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL` | Next.js proxy to API (dev) |

#### Deploy order

1. Deploy **backend-api** (route + pdfkit service)
2. Deploy **vaccination_2026** (download client)
3. Smoke test (see §5)

**No migration required** — uses existing booking columns.

---

## 5. Test plan

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Paid checkout → `/book/success` | PDF auto-downloads once |
| 2 | Refresh success page | No duplicate auto-download |
| 3 | Manual “Download Booking PDF” | PDF downloads with correct filename |
| 4 | My Booking claim → `/booking/[ref]` | Download works with stored code |
| 5 | Wrong verification code | 401 / error message in UI |
| 6 | PDF on Android / iPhone / Windows | Opens in native PDF viewer |
| 7 | QR in PDF | Opens `/verify/certificate?ref=...` |
| 8 | Rate limit (>10/15min) | 429 |

**Automated:** `bookingPdf.service.test.ts` (filename sanitization). Integration/e2e PDF binary tests optional.

---

## 6. Gaps & future work (prioritized)

| Priority | Item | Effort |
|----------|------|--------|
| P1 | Add Furtail contact block to PDF footer | Low |
| P2 | JWT owner download from `/booking/list` without re-claim | Medium |
| P3 | Add PDF card to `/book/confirm/[ref]` | Low |
| P4 | Replace drawn logo with asset PNG | Low |
| P5 | Explicit pet count line in PDF | Trivial |
| P6 | Deprecate `/book/payment/success` in favor of unified success flow | Medium |

---

## 7. Certificate verification page (related, not booking PDF)

`/verify/certificate` validates **vaccination certificate tokens** after service — not booking references. The booking PDF QR currently points to `?ref={bookingRef}` on that page; ensure that page (or a dedicated `/verify/booking`) resolves booking refs if product intent is booking verification vs certificate verification. **Audit note:** verify page today accepts certificate token only — confirm product alignment separately.

---

## 8. Document history

| Date | Change |
|------|--------|
| 2026-06-07 | Initial audit + as-built plan (feature implemented server-side) |

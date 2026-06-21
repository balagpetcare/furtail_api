const router = require("express").Router();
const countryScopeGuard = require("../../middlewares/countryScopeGuard");

// =============================================================================
// Furtail MOBILE API — ACTIVE ROUTES (Phase 3 scope: Furtail Flutter app only)
// All enterprise modules (clinic, doctor, inventory, warehouse, owner-enterprise,
// products, pricing, pos, orders, medicine, vendors, ai, producer, governance,
// workspace) are NOT mounted here. Their module folders remain on disk for Phase 4.
// =============================================================================

// Files (secure streaming for uploaded media)
router.use(require("../../routes/files.routes"));

// ── Auth ─────────────────────────────────────────────────────────────────────
router.use("/auth", require("./modules/auth/auth.routes"));
router.use("/me", require("./modules/me/me.routes"));
router.use("/notifications", require("./modules/notifications/notifications.routes"));

// ── User & Pets ───────────────────────────────────────────────────────────────
router.use("/common", require("./modules/common/common.routes"));
router.use("/user", require("./modules/profile/profile.routes"));
router.use("/user/pets", require("./modules/pets/pets.routes"));

// ── Media ─────────────────────────────────────────────────────────────────────
router.use("/media", require("./modules/media/media.routes"));

// ── Social (follow, friend requests, profile likes) ──────────────────────────
// [Furtail-FIX] This mount was missing — Flutter social features were returning 404.
// Added in Phase 3 cleanup.
router.use("/social", require("./modules/social/social.routes"));

// ── Ads (public, no auth; feature-gated via /meta/features policy) ────────────
// [REVIEW] Keep: Flutter policyFeaturesProvider checks adsEnabled flag.
router.use("/ads", require("./modules/ads/ads.routes"));

// ── Locations ─────────────────────────────────────────────────────────────────
router.use("/locations", require("./modules/locations/locations.routes"));
router.use("/location-master", require("../../modules/location/location.routes"));
router.use("/geo", require("./modules/geo/geo.routes"));

// ── Meta / Policy features ────────────────────────────────────────────────────
// [KEEP] Flutter policyFeaturesProvider calls GET /api/v1/meta/features at startup.
router.use("/meta", require("./modules/meta/meta.routes"));

// ── Campaign & Payments (EPS) ─────────────────────────────────────────────────
// Use 503-fallback wrapper so a bad config doesn't kill all routes at startup.
function mountWith503(path: string, modulePath: string) {
  try {
    router.use(path, require(modulePath));
  } catch (err) {
    console.error(`[routes] ${path} failed to load:`, err);
    router.use(path, (_req: any, res: any) =>
      res.status(503).json({ success: false, message: `${path} not loaded; check server logs and restart API.` }));
  }
}

mountWith503("/campaign", "./modules/campaign/campaign.routes");
mountWith503("/payments", "./payments/payment.routes");
mountWith503("/payment/eps", "./modules/payment/eps/eps.routes");
mountWith503("/payments/eps", "./modules/payment/eps/eps.routes");

// Campaign linking — authenticated user bookings, certificates, vaccinations
router.use("/campaign-link", require("./modules/campaign/campaignLink.routes").default);

// ── Social feed & Fundraising ─────────────────────────────────────────────────
router.use("/posts", require("./modules/posts/posts.routes"));
router.use("/fundraising", countryScopeGuard, require("./modules/fundraising/fundraising.routes"));

// ── Wallet ────────────────────────────────────────────────────────────────────
router.use('/wallet', require('./modules/wallet/wallet.routes'));

// ── Webhooks (payout callbacks — EPS, fundraising) ───────────────────────────
// [REVIEW] Keep: Required for EPS campaign checkout callbacks and fundraising payouts.
router.use('/webhooks', require('./modules/webhooks/payout_webhooks.routes'));

// ── Reports & Achievements ────────────────────────────────────────────────────
router.use("/reports", require("./modules/reports/reports.routes"));
// [REVIEW] Keep: achievements data is embedded in visitor profile responses.
router.use("/achievements", require("./modules/achievements/achievements.routes"));

module.exports = router;

export {};

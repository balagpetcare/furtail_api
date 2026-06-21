const router = require("express").Router();
const countryScopeGuard = require("../../middlewares/countryScopeGuard");

// Files (secure streaming for uploaded media)
router.use(require("../../routes/files.routes"));

router.use("/auth", require("./modules/auth/auth.routes"));
router.use("/me", require("./modules/me/me.routes"));
router.use("/notifications", require("./modules/notifications/notifications.routes"));

router.use("/common", require("./modules/common/common.routes"));
router.use("/user", require("./modules/profile/profile.routes"));
router.use("/user/pets", require("./modules/pets/pets.routes"));

// Media
router.use("/media", require("./modules/media/media.routes"));

// Phase 4: Ads (public serve – no auth; country from X-Country-Code)
router.use("/ads", require("./modules/ads/ads.routes"));

// Locations
router.use("/locations", require("./modules/locations/locations.routes"));
router.use("/location-master", require("../../modules/location/location.routes"));
router.use("/geo", require("./modules/geo/geo.routes"));
router.use("/meta", require("./modules/meta/meta.routes"));

// Governance-related public modules with 503 fallback if load fails
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

// BPA app campaign linking (authenticated)
router.use("/campaign-link", require("./modules/campaign/campaignLink.routes").default);

router.use("/posts", require("./modules/posts/posts.routes"));
router.use("/fundraising", countryScopeGuard, require("./modules/fundraising/fundraising.routes"));

// Wallet (Donation credit + Withdraw reservations)
router.use('/wallet', require('./modules/wallet/wallet.routes'));

// Payout Webhooks (bKash/Nagad/Rocket)
router.use('/webhooks', require('./modules/webhooks/payout_webhooks.routes'));

// Reports (posts, fundraising, users, pets)
router.use("/reports", require("./modules/reports/reports.routes"));

// Achievements
router.use("/achievements", require("./modules/achievements/achievements.routes"));

module.exports = router;

export {};

const router = require("express").Router();

const authenticateToken = require("../../../../middleware/auth.middleware");
const requireAdmin = require("../../../../middleware/admin.middleware");
const requirePermission = require("../../../../middlewares/requirePermission");
const ctrl = require("./adoptions.admin.controller");

router.get("/adoptions", authenticateToken, requireAdmin, requirePermission("adoption.read"), ctrl.list);
router.get("/adoptions/pending", authenticateToken, requireAdmin, requirePermission("adoption.read"), ctrl.pending);
router.get("/adoptions/reports", authenticateToken, requireAdmin, requirePermission("adoption.report.manage"), ctrl.reports);
router.get("/adoptions/:id", authenticateToken, requireAdmin, requirePermission("adoption.read"), ctrl.getById);

router.post("/adoptions/:id/approve", authenticateToken, requireAdmin, requirePermission("adoption.review"), ctrl.approve);
router.post("/adoptions/:id/reject", authenticateToken, requireAdmin, requirePermission("adoption.review"), ctrl.reject);
router.post("/adoptions/:id/request-changes", authenticateToken, requireAdmin, requirePermission("adoption.review"), ctrl.requestChanges);
router.post("/adoptions/:id/pause", authenticateToken, requireAdmin, requirePermission("adoption.moderate"), ctrl.pause);
router.post("/adoptions/:id/remove", authenticateToken, requireAdmin, requirePermission("adoption.moderate"), ctrl.remove);

router.get("/adoption-country-rules", authenticateToken, requireAdmin, requirePermission("adoption.country_rules.manage"), ctrl.listCountryRules);
router.post("/adoption-country-rules", authenticateToken, requireAdmin, requirePermission("adoption.country_rules.manage"), ctrl.createCountryRule);
router.patch("/adoption-country-rules/:id", authenticateToken, requireAdmin, requirePermission("adoption.country_rules.manage"), ctrl.updateCountryRule);

module.exports = router;

export {};

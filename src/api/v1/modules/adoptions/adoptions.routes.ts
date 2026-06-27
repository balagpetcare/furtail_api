const express = require("express");

const auth = require("../../../../middleware/auth.middleware");
const optionalAuth = require("../../../../middlewares/optionalAuth");
const controller = require("./adoptions.controller");

const router = express.Router();
const meRouter = express.Router();

router.get("/", controller.listPublic);
router.get("/:id", optionalAuth, controller.getById);
router.post("/", auth, controller.create);
router.patch("/:id", auth, controller.update);
router.post("/:id/submit-review", auth, controller.submitReview);
router.post("/:id/apply", auth, controller.apply);

meRouter.get("/adoptions", auth, controller.listMine);
meRouter.get("/adoption-applications", auth, controller.listMyApplications);

module.exports = router;
module.exports.meRouter = meRouter;

export {};

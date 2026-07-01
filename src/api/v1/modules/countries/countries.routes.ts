const router = require("express").Router();
const ctl = require("./countries.controller");

// Public country endpoints (no auth required)
router.get("/", ctl.listActive);
router.get("/default", ctl.getDefault);

module.exports = router;

export {};

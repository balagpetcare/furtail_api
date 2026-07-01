const router = require("express").Router();
const auth = require("../../../../middleware/auth.middleware");
const optionalAuth = require("../../../../middleware/optionalAuth.middleware");
const social = require("./pets.social.controller");

// ── My pets (authenticated owner) ──────────────────────────────────────────
router.get("/my", auth, social.getMyPets);

// ── Public profile by slug (optional auth for personalized data) ────────────
// IMPORTANT: must come before /:petId to avoid slug being parsed as petId
router.get("/slug/:slug", optionalAuth, social.getPetBySlug);

// ── Public pet profile by id ────────────────────────────────────────────────
router.get("/:petId", optionalAuth, social.getPublicPet);

// ── Update public profile fields (owner only) ───────────────────────────────
router.patch("/:petId/profile", auth, social.updatePetProfile);

// ── Social: Follow ──────────────────────────────────────────────────────────
router.post("/:petId/follow", auth, social.followPet);
router.delete("/:petId/follow", auth, social.unfollowPet);

// ── Social: Like ────────────────────────────────────────────────────────────
router.post("/:petId/like", auth, social.likePet);
router.delete("/:petId/like", auth, social.unlikePet);

// ── Social status ────────────────────────────────────────────────────────────
router.get("/:petId/social-status", auth, social.getPetSocialStatus);

// ── Pet posts ────────────────────────────────────────────────────────────────
router.get("/:petId/posts", optionalAuth, social.getPetPosts);
router.post("/:petId/posts", auth, social.createPetPost);

module.exports = router;

export {};

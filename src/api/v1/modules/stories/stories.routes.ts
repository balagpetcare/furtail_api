const router = require('express').Router();
const multer = require('multer');
const auth = require('../../../../middleware/auth.middleware');
const appConfig = require('../../../../config/appConfig');
const stories = require('./stories.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(
      appConfig.mediaPolicy?.maxUploadBytes ||
        process.env.MAX_UPLOAD_BYTES ||
        100 * 1024 * 1024,
    ),
  },
});

// GET /api/v1/stories/feed
router.get('/feed', auth, stories.getFeed);

// POST /api/v1/stories  — multipart with field "media"
router.post('/', auth, upload.single('media'), stories.create);

// POST /api/v1/stories/:id/view
router.post('/:id/view', auth, stories.markViewed);

// DELETE /api/v1/stories/:id
router.delete('/:id', auth, stories.deleteStory);

module.exports = router;
export {};

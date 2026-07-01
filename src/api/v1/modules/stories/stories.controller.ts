const storyService = require('./stories.service');
const { processUploadFile } = require('../media/media.processor');
const mediaService = require('../media/media.service');

function pickFile(req: any) {
  if (Array.isArray(req.files) && req.files.length) return req.files[0];
  if (req.file) return req.file;
  return null;
}

exports.getFeed = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const stories = await storyService.getFeed(Number(userId));
    return res.json({ success: true, stories });
  } catch (err: any) {
    console.error('[stories] getFeed error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load stories' });
  }
};

exports.create = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const file = pickFile(req);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No media file uploaded. Send multipart/form-data with field name "media".',
      });
    }

    // Process (resize/compress) and upload to object storage
    const processed = await processUploadFile(file);
    const media = await mediaService.uploadAndCreateMedia({
      ownerUserId: Number(userId),
      file: processed,
      folder: 'stories',
      countryCode: req.countryContext?.countryCode,
    });

    const mimeType = String(file.mimetype || '').toLowerCase();
    const mediaType = mimeType.startsWith('video/') ? 'video' : 'image';
    const caption = String(req.body?.caption || '').trim() || undefined;

    const story = await storyService.create(Number(userId), {
      mediaUrl: media.url,
      mediaType,
      caption,
    });

    return res.status(201).json({ success: true, story });
  } catch (err: any) {
    console.error('[stories] create error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to create story' });
  }
};

exports.markViewed = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const storyId = Number(req.params.id);
    if (!storyId || isNaN(storyId)) {
      return res.status(400).json({ success: false, message: 'Invalid story id' });
    }

    await storyService.markViewed(storyId, Number(userId));
    return res.json({ success: true });
  } catch (err: any) {
    console.error('[stories] markViewed error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to mark viewed' });
  }
};

exports.deleteStory = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const storyId = Number(req.params.id);
    if (!storyId || isNaN(storyId)) {
      return res.status(400).json({ success: false, message: 'Invalid story id' });
    }

    await storyService.deleteStory(storyId, Number(userId));
    return res.json({ success: true });
  } catch (err: any) {
    const code = err.statusCode || 500;
    console.error('[stories] delete error:', err.message);
    return res.status(code).json({ success: false, message: err.message || 'Failed to delete story' });
  }
};

export {};

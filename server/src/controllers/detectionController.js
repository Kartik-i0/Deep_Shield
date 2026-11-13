import { orchestrateDetection } from '../services/detectionOrchestrator.js';

export async function detectImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const report = await orchestrateDetection({
      mediaType: 'image',
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

export async function detectVideo(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file uploaded.' });
    }

    const report = await orchestrateDetection({
      mediaType: 'video',
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

export async function detectAudio(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file uploaded.' });
    }

    const report = await orchestrateDetection({
      mediaType: 'audio',
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

export async function detectText(req, res, next) {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid non-empty text content to analyze.' });
    }

    const report = await orchestrateDetection({
      mediaType: 'text',
      textContent: text,
      fileName: 'direct_text_input',
      mimeType: 'text/plain',
    });

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}


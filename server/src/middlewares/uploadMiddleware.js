import multer from 'multer';
import { config } from '../config/env.js';

// Memory storage allows direct passing of buffers to Sharp, Gemini, and HuggingFace
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a',
    'video/mp4', 'video/webm', 'video/quicktime',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: Images (JPG, PNG, WebP), Audio (MP3, WAV), Video (MP4, WebM)`), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSizeMB * 1024 * 1024,
  },
  fileFilter,
});


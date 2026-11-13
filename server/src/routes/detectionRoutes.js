import express from 'express';
import { detectImage, detectVideo, detectAudio, detectText } from '../controllers/detectionController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/image', upload.single('file'), detectImage);
router.post('/video', upload.single('file'), detectVideo);
router.post('/audio', upload.single('file'), detectAudio);
router.post('/text', detectText);

export default router;


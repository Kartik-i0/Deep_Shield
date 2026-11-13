import express from 'express';
import { exportReportPdf, exportReportJson } from '../controllers/reportController.js';

const router = express.Router();

router.get('/:id/pdf', exportReportPdf);
router.get('/:id/json', exportReportJson);

export default router;


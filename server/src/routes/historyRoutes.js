import express from 'express';
import { getScanHistory, getScanById, deleteScan } from '../controllers/historyController.js';

const router = express.Router();

router.get('/', getScanHistory);
router.get('/:id', getScanById);
router.delete('/:id', deleteScan);

export default router;


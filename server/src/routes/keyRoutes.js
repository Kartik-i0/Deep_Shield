import express from 'express';
import { getApiKeys, addApiKey, removeApiKey, resetCooldowns, testKey } from '../controllers/keyManagerController.js';

const router = express.Router();

router.get('/', getApiKeys);
router.post('/', addApiKey);
router.delete('/:provider/:id', removeApiKey);
router.post('/reset-cooldowns', resetCooldowns);
router.post('/test', testKey);

export default router;


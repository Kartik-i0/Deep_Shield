import express from 'express';
import { isDbConnected } from '../config/db.js';
import { geminiKeyPool } from '../services/geminiKeyPool.js';
import { hfKeyPool } from '../services/hfKeyPool.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected(),
      mode: isDbConnected() ? 'MongoDB' : 'In-Memory Fallback',
    },
    keyPools: {
      geminiTotal: geminiKeyPool.keys.length,
      geminiActive: geminiKeyPool.keys.filter(k => k.status === 'ACTIVE').length,
      hfTotal: hfKeyPool.tokens.length,
      hfActive: hfKeyPool.tokens.filter(t => t.status === 'ACTIVE').length,
    },
  });
});

export default router;


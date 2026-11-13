import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function parseKeyList(envVal, fallbackSingle) {
  const keys = [];
  if (envVal) {
    envVal.split(',').map(k => k.trim()).filter(Boolean).forEach(k => {
      if (!keys.includes(k)) keys.push(k);
    });
  }
  if (fallbackSingle && fallbackSingle.trim() && !keys.includes(fallbackSingle.trim())) {
    keys.unshift(fallbackSingle.trim());
  }
  return keys;
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deepshield',
  pythonServiceUrl: process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000/api/v1',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  geminiKeys: parseKeyList(process.env.GEMINI_API_KEYS, process.env.GEMINI_API_KEY),
  hfTokens: parseKeyList(process.env.HF_API_TOKENS, process.env.HF_API_TOKEN),
  uploadDir: path.resolve(__dirname, '../../uploads'),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
};


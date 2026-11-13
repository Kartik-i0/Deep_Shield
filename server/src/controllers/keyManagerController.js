import { geminiKeyPool } from '../services/geminiKeyPool.js';
import { hfKeyPool } from '../services/hfKeyPool.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export async function getApiKeys(req, res) {
  res.status(200).json({
    success: true,
    data: {
      gemini: {
        total: geminiKeyPool.keys.length,
        active: geminiKeyPool.keys.filter(k => k.status === 'ACTIVE').length,
        rateLimited: geminiKeyPool.keys.filter(k => k.status === 'RATE_LIMITED').length,
        keys: geminiKeyPool.getPoolStatus(),
      },
      huggingFace: {
        total: hfKeyPool.tokens.length,
        active: hfKeyPool.tokens.filter(t => t.status === 'ACTIVE').length,
        rateLimited: hfKeyPool.tokens.filter(t => t.status === 'RATE_LIMITED').length,
        tokens: hfKeyPool.getPoolStatus(),
      },
    },
  });
}

export async function addApiKey(req, res) {
  const { provider, key } = req.body;

  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or missing key.' });
  }

  const cleanKey = key.trim();

  if (provider === 'gemini') {
    geminiKeyPool.addKey(cleanKey, 'USER_ADDED');
    return res.status(201).json({
      success: true,
      message: 'Gemini API key added to rotation pool successfully.',
      key: geminiKeyPool.maskKey(cleanKey),
    });
  } else if (provider === 'huggingface' || provider === 'hf') {
    hfKeyPool.addToken(cleanKey, 'USER_ADDED');
    return res.status(201).json({
      success: true,
      message: 'Hugging Face API token added to rotation pool successfully.',
      token: hfKeyPool.maskToken(cleanKey),
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid provider. Must be "gemini" or "huggingface".',
    });
  }
}

export async function removeApiKey(req, res) {
  const { provider, id } = req.params;

  if (provider === 'gemini') {
    const ok = geminiKeyPool.removeKey(id);
    return res.status(200).json({ success: ok, message: ok ? 'Key removed.' : 'Key not found.' });
  } else if (provider === 'huggingface' || provider === 'hf') {
    const ok = hfKeyPool.removeToken(id);
    return res.status(200).json({ success: ok, message: ok ? 'Token removed.' : 'Token not found.' });
  }

  return res.status(400).json({ success: false, message: 'Invalid provider.' });
}

export async function resetCooldowns(req, res) {
  geminiKeyPool.resetAllCooldowns();
  hfKeyPool.resetAllCooldowns();
  res.status(200).json({ success: true, message: 'All API key cooldowns and quotas have been reset.' });
}

export async function testKey(req, res) {
  const { provider, key } = req.body;
  if (!key) return res.status(400).json({ success: false, message: 'Key required.' });

  try {
    if (provider === 'gemini') {
      const genAI = new GoogleGenerativeAI(key.trim());
      const testModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
      let verified = false;
      let lastErr = null;

      for (const mName of testModels) {
        try {
          const model = genAI.getGenerativeModel({ model: mName });
          await model.generateContent('ping');
          verified = true;
          break;
        } catch (mErr) {
          lastErr = mErr;
          if (mErr.message && (mErr.message.includes('404') || mErr.message.includes('no longer available') || mErr.message.includes('not found'))) {
            continue;
          }
          throw mErr;
        }
      }

      if (!verified) throw lastErr || new Error('Validation ping failed.');
      return res.status(200).json({ success: true, message: 'Gemini API Key is valid and active!' });
    } else if (provider === 'huggingface') {
      const hfRes = await axios.get('https://huggingface.co/api/whoami-v2', {
        headers: { Authorization: `Bearer ${key.trim()}` },
        timeout: 5000,
      });
      return res.status(200).json({
        success: true,
        message: `Hugging Face token is valid! User: ${hfRes.data?.name || 'verified'}`,
      });
    }
    return res.status(400).json({ success: false, message: 'Invalid provider' });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Key validation failed: ${err.response?.data?.error || err.message}`,
    });
  }
}


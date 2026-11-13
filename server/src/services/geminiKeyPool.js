import { config } from '../config/env.js';

class GeminiKeyPool {
  constructor() {
    this.keys = [];
    this.currentIndex = 0;
    this.cooldownDurationMs = 60 * 1000; // 60 seconds cooldown for 429 rate limit
    
    // Initialize with keys from config/env
    if (config.geminiKeys && config.geminiKeys.length > 0) {
      config.geminiKeys.forEach(k => this.addKey(k, 'ENV'));
    }
  }

  maskKey(key) {
    if (!key || key.length < 8) return '****';
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  }

  addKey(keyStr, source = 'USER') {
    if (!keyStr || typeof keyStr !== 'string') return false;
    const cleanKey = keyStr.trim();
    if (!cleanKey) return false;

    // Check if already in pool
    const existing = this.keys.find(k => k.raw === cleanKey);
    if (existing) {
      existing.status = 'ACTIVE';
      existing.cooldownUntil = 0;
      return true;
    }

    this.keys.push({
      id: 'gemini-' + Math.random().toString(36).substring(2, 9),
      raw: cleanKey,
      masked: this.maskKey(cleanKey),
      source,
      status: 'ACTIVE',
      requestCount: 0,
      errorCount: 0,
      cooldownUntil: 0,
      lastUsed: null,
      lastError: null,
      createdAt: new Date(),
    });

    console.log(`[GeminiKeyPool] Added key (${this.maskKey(cleanKey)}) from ${source}. Total active keys: ${this.keys.length}`);
    return true;
  }

  removeKey(keyIdOrMasked) {
    const idx = this.keys.findIndex(k => k.id === keyIdOrMasked || k.masked === keyIdOrMasked);
    if (idx !== -1) {
      const removed = this.keys.splice(idx, 1)[0];
      console.log(`[GeminiKeyPool] Removed key ${removed.masked}`);
      return true;
    }
    return false;
  }

  resetAllCooldowns() {
    this.keys.forEach(k => {
      k.status = 'ACTIVE';
      k.cooldownUntil = 0;
      k.lastError = null;
    });
    console.log('[GeminiKeyPool] All Gemini keys reset to ACTIVE.');
  }

  getNextAvailableKey() {
    if (this.keys.length === 0) return null;

    const now = Date.now();
    // Refresh any keys whose cooldown expired
    for (const item of this.keys) {
      if (item.status === 'RATE_LIMITED' && item.cooldownUntil <= now) {
        item.status = 'ACTIVE';
        item.cooldownUntil = 0;
        console.log(`[GeminiKeyPool] Key ${item.masked} cooldown expired. Restored to ACTIVE.`);
      }
    }

    // Try to find next ACTIVE key starting from currentIndex
    for (let i = 0; i < this.keys.length; i++) {
      const idx = (this.currentIndex + i) % this.keys.length;
      const candidate = this.keys[idx];
      if (candidate.status === 'ACTIVE') {
        this.currentIndex = (idx + 1) % this.keys.length;
        candidate.lastUsed = new Date();
        return candidate;
      }
    }

    // If all are rate limited, find the one that will cool down earliest
    const rateLimited = this.keys.filter(k => k.status === 'RATE_LIMITED');
    if (rateLimited.length > 0) {
      rateLimited.sort((a, b) => a.cooldownUntil - b.cooldownUntil);
      console.warn(`[GeminiKeyPool] All keys currently cooling down. Earliest ready in ${Math.max(0, Math.round((rateLimited[0].cooldownUntil - now)/1000))}s`);
      return null;
    }

    return null;
  }

  reportSuccess(keyObj) {
    if (!keyObj) return;
    const item = this.keys.find(k => k.raw === keyObj.raw);
    if (item) {
      item.requestCount += 1;
      item.status = 'ACTIVE';
    }
  }

  reportRateLimit(keyObj, errMessage = 'Quota limit reached (429)') {
    if (!keyObj) return;
    const item = this.keys.find(k => k.raw === keyObj.raw);
    if (item) {
      item.status = 'RATE_LIMITED';
      item.errorCount += 1;
      item.cooldownUntil = Date.now() + this.cooldownDurationMs;
      item.lastError = errMessage;
      console.warn(`[GeminiKeyPool] Rate limit triggered on ${item.masked}. Cooldown set for ${this.cooldownDurationMs / 1000}s`);
    }
  }

  reportInvalid(keyObj, errMessage = 'API Key rejected / invalid') {
    if (!keyObj) return;
    const item = this.keys.find(k => k.raw === keyObj.raw);
    if (item) {
      item.status = 'INVALID';
      item.errorCount += 1;
      item.lastError = errMessage;
      console.error(`[GeminiKeyPool] Key ${item.masked} marked INVALID.`);
    }
  }

  getPoolStatus() {
    const now = Date.now();
    return this.keys.map(k => ({
      id: k.id,
      masked: k.masked,
      source: k.source,
      status: k.status,
      requestCount: k.requestCount,
      errorCount: k.errorCount,
      lastUsed: k.lastUsed,
      lastError: k.lastError,
      cooldownRemainingSeconds: k.cooldownUntil > now ? Math.round((k.cooldownUntil - now) / 1000) : 0,
    }));
  }

  hasAvailableKey() {
    return this.getNextAvailableKey() !== null;
  }
}

export const geminiKeyPool = new GeminiKeyPool();


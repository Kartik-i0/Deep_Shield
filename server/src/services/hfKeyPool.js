import { config } from '../config/env.js';

class HuggingFaceKeyPool {
  constructor() {
    this.tokens = [];
    this.currentIndex = 0;
    this.cooldownDurationMs = 60 * 1000;
    
    if (config.hfTokens && config.hfTokens.length > 0) {
      config.hfTokens.forEach(t => this.addToken(t, 'ENV'));
    }
  }

  maskToken(token) {
    if (!token || token.length < 8) return '****';
    return `${token.slice(0, 7)}...${token.slice(-4)}`;
  }

  addToken(tokenStr, source = 'USER') {
    if (!tokenStr || typeof tokenStr !== 'string') return false;
    const cleanToken = tokenStr.trim();
    if (!cleanToken) return false;

    const existing = this.tokens.find(t => t.raw === cleanToken);
    if (existing) {
      existing.status = 'ACTIVE';
      existing.cooldownUntil = 0;
      return true;
    }

    this.tokens.push({
      id: 'hf-' + Math.random().toString(36).substring(2, 9),
      raw: cleanToken,
      masked: this.maskToken(cleanToken),
      source,
      status: 'ACTIVE',
      requestCount: 0,
      errorCount: 0,
      cooldownUntil: 0,
      lastUsed: null,
      lastError: null,
      createdAt: new Date(),
    });

    console.log(`[HuggingFaceKeyPool] Added HF token (${this.maskToken(cleanToken)}) from ${source}. Total active tokens: ${this.tokens.length}`);
    return true;
  }

  removeToken(tokenIdOrMasked) {
    const idx = this.tokens.findIndex(t => t.id === tokenIdOrMasked || t.masked === tokenIdOrMasked);
    if (idx !== -1) {
      const removed = this.tokens.splice(idx, 1)[0];
      console.log(`[HuggingFaceKeyPool] Removed token ${removed.masked}`);
      return true;
    }
    return false;
  }

  resetAllCooldowns() {
    this.tokens.forEach(t => {
      t.status = 'ACTIVE';
      t.cooldownUntil = 0;
      t.lastError = null;
    });
    console.log('[HuggingFaceKeyPool] All HF tokens reset to ACTIVE.');
  }

  getNextAvailableToken() {
    if (this.tokens.length === 0) return null;

    const now = Date.now();
    for (const item of this.tokens) {
      if (item.status === 'RATE_LIMITED' && item.cooldownUntil <= now) {
        item.status = 'ACTIVE';
        item.cooldownUntil = 0;
        console.log(`[HuggingFaceKeyPool] Token ${item.masked} cooldown expired. Restored to ACTIVE.`);
      }
    }

    for (let i = 0; i < this.tokens.length; i++) {
      const idx = (this.currentIndex + i) % this.tokens.length;
      const candidate = this.tokens[idx];
      if (candidate.status === 'ACTIVE') {
        this.currentIndex = (idx + 1) % this.tokens.length;
        candidate.lastUsed = new Date();
        return candidate;
      }
    }

    return null;
  }

  reportSuccess(tokenObj) {
    if (!tokenObj) return;
    const item = this.tokens.find(t => t.raw === tokenObj.raw);
    if (item) {
      item.requestCount += 1;
      item.status = 'ACTIVE';
    }
  }

  reportRateLimit(tokenObj, errMessage = 'HuggingFace rate limit reached (429)') {
    if (!tokenObj) return;
    const item = this.tokens.find(t => t.raw === tokenObj.raw);
    if (item) {
      item.status = 'RATE_LIMITED';
      item.errorCount += 1;
      item.cooldownUntil = Date.now() + this.cooldownDurationMs;
      item.lastError = errMessage;
      console.warn(`[HuggingFaceKeyPool] Rate limit on ${item.masked}. Cooldown set.`);
    }
  }

  reportInvalid(tokenObj, errMessage = 'Invalid HuggingFace token') {
    if (!tokenObj) return;
    const item = this.tokens.find(t => t.raw === tokenObj.raw);
    if (item) {
      item.status = 'INVALID';
      item.errorCount += 1;
      item.lastError = errMessage;
    }
  }

  getPoolStatus() {
    const now = Date.now();
    return this.tokens.map(t => ({
      id: t.id,
      masked: t.masked,
      source: t.source,
      status: t.status,
      requestCount: t.requestCount,
      errorCount: t.errorCount,
      lastUsed: t.lastUsed,
      lastError: t.lastError,
      cooldownRemainingSeconds: t.cooldownUntil > now ? Math.round((t.cooldownUntil - now) / 1000) : 0,
    }));
  }
}

export const hfKeyPool = new HuggingFaceKeyPool();


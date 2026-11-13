import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';

const scanReportSchema = new mongoose.Schema(
  {
    scanId: { type: String, required: true, unique: true, index: true },
    mediaType: { type: String, enum: ['image', 'video', 'audio', 'text'], required: true },
    fileName: { type: String, default: 'unnamed' },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: 'application/octet-stream' },
    
    // Core Results
    verdict: {
      type: String,
      enum: ['AUTHENTIC', 'AI_GENERATED', 'LIKELY_AUTHENTIC', 'SUSPICIOUS', 'LIKELY_DEEPFAKE', 'DEEPFAKE_CONFIRMED'],
      required: true,
    },
    deepfakeScore: { type: Number, required: true, min: 0, max: 100 }, // 0 = 100% real, 100 = 100% deepfake
    authenticityScore: { type: Number, required: true, min: 0, max: 100 }, // 100 - deepfakeScore
    confidenceLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'], default: 'HIGH' },
    
    // Forensic Engine Details
    engines: {
      gemini: {
        used: { type: Boolean, default: false },
        score: { type: Number },
        model: { type: String },
        reasoning: { type: String },
        anomalies: [{ type: String }],
        keyUsedMasked: { type: String },
      },
      huggingFace: {
        used: { type: Boolean, default: false },
        model: { type: String },
        score: { type: Number },
        label: { type: String },
        tokenUsedMasked: { type: String },
      },
      localForensics: {
        elaScore: { type: Number },
        meanError: { type: Number },
        elaHeatmapUrl: { type: String },
        metadataAnomalies: [{ type: String }],
        softwareTag: { type: String },
      },
      pythonEngine: {
        used: { type: Boolean, default: false },
        flickerIndex: { type: Number },
        syntheticAudioProb: { type: Number },
        anomalies: [{ type: String }],
      },
    },

    detectedAnomalies: [{ type: String }],
    forensicBreakdown: {
      facialConsistency: { type: Number, default: 100 },
      lightingAcousticPhysics: { type: Number, default: 100 },
      compressionFrequencyPurity: { type: Number, default: 100 },
      metadataIntegrity: { type: Number, default: 100 },
    },
    
    summaryText: { type: String },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

const MongooseScanReport = mongoose.model('ScanReport', scanReportSchema);

// In-Memory Fallback Store when MongoDB is not connected
const inMemoryReports = [];

export const ScanReport = {
  async create(data) {
    if (isDbConnected()) {
      try {
        return await MongooseScanReport.create(data);
      } catch (e) {
        console.warn('[ScanReport] Falling back to in-memory store:', e.message);
      }
    }
    const record = {
      ...data,
      _id: data.scanId || Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryReports.unshift(record);
    if (inMemoryReports.length > 500) inMemoryReports.pop(); // Keep top 500
    return record;
  },

  async find(query = {}, sort = { createdAt: -1 }, limit = 50) {
    if (isDbConnected()) {
      try {
        return await MongooseScanReport.find(query).sort(sort).limit(limit).lean();
      } catch (e) {
        console.warn('[ScanReport] Mongo find failed, fallback to memory');
      }
    }
    let res = [...inMemoryReports];
    if (query.mediaType) res = res.filter(r => r.mediaType === query.mediaType);
    if (query.verdict) res = res.filter(r => r.verdict === query.verdict);
    return res.slice(0, limit);
  },

  async findOne(query) {
    if (isDbConnected()) {
      try {
        return await MongooseScanReport.findOne(query).lean();
      } catch (e) {
        console.warn('[ScanReport] Mongo findOne failed, fallback to memory');
      }
    }
    if (query.scanId) return inMemoryReports.find(r => r.scanId === query.scanId) || null;
    return inMemoryReports[0] || null;
  },

  async deleteOne(query) {
    if (isDbConnected()) {
      try {
        return await MongooseScanReport.deleteOne(query);
      } catch (e) {
        console.warn('[ScanReport] Mongo deleteOne failed');
      }
    }
    const idx = inMemoryReports.findIndex(r => r.scanId === query.scanId);
    if (idx !== -1) {
      inMemoryReports.splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  },

  async countDocuments(query = {}) {
    if (isDbConnected()) {
      try {
        return await MongooseScanReport.countDocuments(query);
      } catch (e) {}
    }
    return inMemoryReports.length;
  }
};


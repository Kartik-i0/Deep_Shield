import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[DeepShield DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[DeepShield DB] MongoDB connection failed (${err.message}). Running with in-memory memory persistence fallback.`);
    isConnected = false;
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}


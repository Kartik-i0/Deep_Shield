import express from 'express';
import cors from 'cors';
import { config } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import detectionRoutes from './src/routes/detectionRoutes.js';
import keyRoutes from './src/routes/keyRoutes.js';
import historyRoutes from './src/routes/historyRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import healthRoutes from './src/routes/healthRoutes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/detect', detectionRoutes);
app.use('/api/keys', keyRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/report', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'DeepShield AI Deepfake & Synthetic Media Detection API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
function startServer() {
  // Connect to DB asynchronously without delaying server startup
  connectDB().catch(err => {
    console.warn('[DeepShield DB] Background DB connection attempt finished:', err.message);
  });
  
  app.listen(config.port, () => {
    console.log(`=================================================`);
    console.log(`🛡️  DEEPSHIELD FORENSIC ENGINE STARTED ON PORT ${config.port}`);
    console.log(`🔗 API Base: http://localhost:${config.port}`);
    console.log(`🔑 Gemini Keys Pool: ${config.geminiKeys.length} keys loaded`);
    console.log(`🤗 Hugging Face Tokens: ${config.hfTokens.length} tokens loaded`);
    console.log(`=================================================`);
  });
}

startServer();

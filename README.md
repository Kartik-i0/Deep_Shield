# 🛡️ DeepShield - Multi-Modal AI Deepfake & Synthetic Content Detection System

DeepShield is an enterprise-grade digital forensics platform engineered to detect AI-generated and manipulated media across **Images**, **Videos**, **Audio / Voice Clones**, and **AI-Generated Text**.

Built with a modular **MERN stack (MongoDB, Express, React, Node.js) + Shadcn UI + Tailwind CSS + Python (FastAPI/Signal Processing)**, integrating **Google Gemini 1.5/2.0 Multimodal AI** and **Hugging Face open-source inference models**.

---

## 🌟 Key Features

1. **Multi-Key Pool & Automatic Rate-Limit Failover (Zero-Downtime)**:
   - Configure **multiple free Gemini API keys** and **Hugging Face tokens**.
   - If an API key encounters an HTTP 429 quota/rate limit, DeepShield automatically places it into a temporary cooldown and seamlessly fails over to the next available key without interrupting scans!
   - Built-in UI Key Manager to add, test, monitor, and remove keys dynamically at runtime.

2. **Image Deepfake & Generative Audit**:
   - Error Level Analysis (ELA) heatmap generation to spot inpainting boundaries, spliced pixels, and compression disparities.
   - EXIF hardware sensor verification & AI generation signature parser (Midjourney, DALL-E, Stable Diffusion, ComfyUI).
   - Hugging Face ViT classifier + Gemini Vision forensic reasoning.

3. **Video Deepfake Detection**:
   - Temporal consistency and frame-to-frame boundary jitter detection.
   - Lip-sync alignment and ocular blink cadence evaluation.

4. **Synthetic Audio & Voice Clone Detection**:
   - High-frequency vocoder cutoff and acoustic phase distortion analysis.
   - Ambient reverberation and natural breath cadence inspection.

5. **AI-Generated Text Forensics**:
   - Sentence burstiness (length variance) and stylometric perplexity evaluation.
   - LLM transitional marker detection (overused AI cliché buzzwords).

6. **Verifiable Audit Reports**:
   - Download cryptographic PDF Forensic Certificates and raw JSON audit records.
   - Historical scan archive with filtering and export capabilities.

---

## 🏗️ Structured Component-Based Architecture ("1 File = 1 Functionality")

```
DEEP_SHIELD/
│
├── client/                               # Frontend (React + Vite + Tailwind + Shadcn UI)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                       # Shadcn-style primitives
│   │   │   │   ├── button.jsx            # Customizable button component
│   │   │   │   ├── card.jsx              # Card wrapper & header/content/footer
│   │   │   │   ├── badge.jsx             # Status and verdict badges
│   │   │   │   ├── progress.jsx          # Progress bar with color variants
│   │   │   │   ├── tabs.jsx              # Tab navigation component
│   │   │   │   ├── dialog.jsx            # Modal dialog overlay
│   │   │   │   └── alert.jsx             # Notification & warning banners
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx            # Header with live health pill & key counter
│   │   │   │   └── Footer.jsx            # Footer with credits & tech stack
│   │   │   ├── detector/
│   │   │   │   ├── DropZoneUploader.jsx  # Drag-and-drop file upload with preview
│   │   │   │   ├── ElaViewerModal.jsx    # Interactive Error Level Analysis comparison
│   │   │   │   ├── ImageDetector.jsx     # Image deepfake scanner interface
│   │   │   │   ├── VideoDetector.jsx     # Video deepfake scanner interface
│   │   │   │   ├── AudioDetector.jsx     # Audio voice clone scanner interface
│   │   │   │   └── TextDetector.jsx      # AI text & LLM scanner interface
│   │   │   ├── report/
│   │   │   │   ├── ForensicScoreGauge.jsx# SVG circular risk score gauge
│   │   │   │   ├── VerdictBanner.jsx     # Prominent verdict display
│   │   │   │   ├── ForensicMatrixRadar.jsx# Detailed 4-pillar forensic breakdown
│   │   │   │   ├── AnomaliesList.jsx     # Detected artifacts itemization
│   │   │   │   ├── EngineProvenanceBadge.jsx# AI engine contribution badges
│   │   │   │   └── ExportReportButtons.jsx# PDF & JSON report download buttons
│   │   │   ├── keys/
│   │   │   │   ├── KeyStatusCard.jsx     # Individual key status tile with cooldown
│   │   │   │   ├── AddKeyDialog.jsx      # Dialog to validate and add keys
│   │   │   │   └── ApiKeyDashboard.jsx   # Master API key rotation dashboard
│   │   │   └── history/
│   │   │       └── HistoryTable.jsx      # Filterable scan history table
│   │   ├── services/
│   │   │   ├── api.js                    # Axios instance with base config
│   │   │   ├── detectionApi.js           # Endpoints for media scanning
│   │   │   ├── keyApi.js                 # Endpoints for key pool management
│   │   │   └── historyApi.js             # Endpoints for audit logs & downloads
│   │   ├── lib/
│   │   │   └── utils.js                  # Formatting and class merging helpers
│   │   ├── App.jsx                       # Main application shell
│   │   ├── index.css                     # Cyber glassmorphism & radar styles
│   │   └── main.jsx                      # React DOM entrypoint
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                               # Node.js Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js                    # Environment variables & key pool parser
│   │   │   └── db.js                     # MongoDB connection with in-memory fallback
│   │   ├── models/
│   │   │   └── ScanReport.js             # Schema & persistence for scan records
│   │   ├── services/
│   │   │   ├── geminiKeyPool.js          # Multi-key rotation & cooldown manager
│   │   │   ├── hfKeyPool.js              # Hugging Face token pool & rotator
│   │   │   ├── geminiForensicService.js  # Multimodal Gemini reasoning & analysis
│   │   │   ├── hfInferenceService.js     # Hugging Face inference caller
│   │   │   ├── elaAnalysisService.js     # Native Sharp-based Error Level Analysis
│   │   │   ├── metadataService.js        # EXIF & AI software tag inspection
│   │   │   ├── textForensicService.js    # Perplexity & burstiness text analysis
│   │   │   ├── pythonBridgeService.js    # Communicator with Python microservice
│   │   │   └── detectionOrchestrator.js  # Master ensemble scoring engine
│   │   ├── controllers/
│   │   │   ├── detectionController.js    # Scan endpoints (Image, Video, Audio, Text)
│   │   │   ├── keyManagerController.js   # API key pool management
│   │   │   ├── historyController.js      # Audit log retrieval & deletion
│   │   │   └── reportController.js       # PDF & JSON report generation
│   │   ├── routes/
│   │   │   ├── detectionRoutes.js
│   │   │   ├── keyRoutes.js
│   │   │   ├── historyRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   └── healthRoutes.js
│   │   └── middlewares/
│   │       ├── uploadMiddleware.js       # Memory buffer Multer file upload
│   │       └── errorHandler.js           # Central error handler
│   ├── .env
│   ├── .env.example
│   ├── server.js                         # Express entrypoint
│   └── package.json
│
├── python-service/                       # Python FastAPI Signal Processing Engine
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py                 # FastAPI configuration
│   │   ├── services/
│   │   │   ├── ela_service.py            # PIL/NumPy image compression analysis
│   │   │   ├── audio_service.py          # Waveform FFT & vocoder cutoff analysis
│   │   │   └── video_service.py          # Temporal frame consistency estimator
│   │   ├── routers/
│   │   │   └── forensics.py              # Forensic endpoints
│   │   └── main.py                       # FastAPI application entrypoint
│   └── requirements.txt
│
├── package.json                          # Monorepo root scripts
├── start-all.bat                         # 1-Click Windows batch launcher
├── start-all.ps1                         # 1-Click PowerShell launcher
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Configure Environment (`server/.env`)
Open `server/.env` and paste your Gemini API keys (comma-separated if you have multiple):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/deepshield

# Add one or more Gemini API keys separated by commas:
GEMINI_API_KEYS=AIzaSyD...,AIzaSyB...

# Add one or more Hugging Face tokens (optional for higher rate limits):
HF_API_TOKENS=hf_...
```

> **Note**: You can also add keys dynamically through the UI at `http://localhost:5173` in the **API Key Pool** tab!

### 2. Start All Services (1-Click)
Run the automated launcher:
```powershell
.\start-all.ps1
```
*Or double click `start-all.bat`.*

### 3. Manual Start (Individual terminals)
**Terminal 1 (Python Engine):**
```bash
cd python-service
.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
```

**Terminal 2 (Node.js Server):**
```bash
cd server
npm run dev
```

**Terminal 3 (React Client):**
```bash
cd client
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🔒 Security & Resilience
- **Database Fallback**: If MongoDB is not running locally, DeepShield automatically activates in-memory persistence without crashing.
- **Failover Pool**: Never worry about 429 quota exhaustion; DeepShield distributes requests across all registered keys and handles cooldown periods seamlessly.


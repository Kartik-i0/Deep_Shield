import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ImageDetector } from '@/components/detector/ImageDetector';
import { VideoDetector } from '@/components/detector/VideoDetector';
import { AudioDetector } from '@/components/detector/AudioDetector';
import { TextDetector } from '@/components/detector/TextDetector';
import { ApiKeyDashboard } from '@/components/keys/ApiKeyDashboard';
import { HistoryTable } from '@/components/history/HistoryTable';
import { Shield, Sparkles, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 radar-grid">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner for active tab */}
        {activeTab !== 'keys' && activeTab !== 'history' && (
          <div className="mb-8 p-6 rounded-2xl glass-panel relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Multi-Modal Deepfake & Synthetic Intelligence
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  Authenticate Digital Media with Scientific Precision
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                  DeepShield inspects image compression noise (ELA), facial boundary jitter, vocoder acoustic cutoffs, and linguistic burstiness using Google Gemini multimodal AI and Hugging Face models.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                <button
                  onClick={() => setActiveTab('keys')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600/20 text-sky-300 border border-sky-500/30 hover:bg-sky-600/30 transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4 text-sky-400" />
                  Manage API Keys
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Views */}
        <div className="transition-opacity duration-200">
          {activeTab === 'image' && <ImageDetector />}
          {activeTab === 'video' && <VideoDetector />}
          {activeTab === 'audio' && <AudioDetector />}
          {activeTab === 'text' && <TextDetector />}
          {activeTab === 'keys' && <ApiKeyDashboard />}
          {activeTab === 'history' && <HistoryTable />}
        </div>
      </main>

      <Footer />
    </div>
  );
}


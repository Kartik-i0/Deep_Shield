import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ImageDetector } from '@/components/detector/ImageDetector';
import { VideoDetector } from '@/components/detector/VideoDetector';
import { AudioDetector } from '@/components/detector/AudioDetector';
import { TextDetector } from '@/components/detector/TextDetector';
import { ApiKeyDashboard } from '@/components/keys/ApiKeyDashboard';
import { HistoryTable } from '@/components/history/HistoryTable';
import { Shield, Key, History } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('image');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deepshield-theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('deepshield-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Understated Minimalist Header */}
        {activeTab !== 'keys' && activeTab !== 'history' && (
          <div className="mb-6 pb-5 border-b border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                Deepfake & Synthetic Media Detector
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Fast, clear verification to identify whether photos, videos, voice recordings, or text are human-made or created by AI.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('keys')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Key className="w-3.5 h-3.5 text-zinc-400" />
                API Keys
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <History className="w-3.5 h-3.5 text-zinc-400" />
                History
              </button>
            </div>
          </div>
        )}

        {/* Tab Views with 100% State Retention across Navigation */}
        <div className="relative">
          <div className={activeTab === 'image' ? 'block' : 'hidden'}>
            <ImageDetector />
          </div>
          <div className={activeTab === 'video' ? 'block' : 'hidden'}>
            <VideoDetector />
          </div>
          <div className={activeTab === 'audio' ? 'block' : 'hidden'}>
            <AudioDetector />
          </div>
          <div className={activeTab === 'text' ? 'block' : 'hidden'}>
            <TextDetector />
          </div>
          <div className={activeTab === 'keys' ? 'block' : 'hidden'}>
            <ApiKeyDashboard />
          </div>
          <div className={activeTab === 'history' ? 'block' : 'hidden'}>
            <HistoryTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


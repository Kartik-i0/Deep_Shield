import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Key, History, Activity } from 'lucide-react';
import { api } from '@/services/api';

export function Navbar({ activeTab, onTabChange }) {
  const [health, setHealth] = useState({ status: 'connecting', keyPools: { geminiActive: 0, hfActive: 0 } });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        setHealth(res.data);
      } catch (e) {
        setHealth({ status: 'offline', keyPools: { geminiActive: 0, hfActive: 0 } });
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'image', label: 'Image Detector' },
    { id: 'video', label: 'Video Deepfake' },
    { id: 'audio', label: 'Voice Clone' },
    { id: 'text', label: 'AI Text' },
    { id: 'keys', label: 'API Key Pool', icon: Key },
    { id: 'history', label: 'Audit History', icon: History },
  ];

  const isHealthy = health.status === 'healthy';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onTabChange('image')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-600/30 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">DEEPSHIELD</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                AI FORENSICS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              Deepfake & Synthetic Media Detection System
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Live Status Pill & Key Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('keys')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Configure Multiple Gemini & Hugging Face Keys"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
              Keys: {health.keyPools?.geminiActive ?? 0} Gemini / {health.keyPools?.hfActive ?? 0} HF
            </span>
            <span className="text-slate-300 font-mono text-[11px] sm:hidden">
              Keys ({health.keyPools?.geminiActive ?? 0})
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Submenu */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/50 gap-1 bg-slate-950/40">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === item.id ? 'bg-sky-600 text-white' : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}


import React, { useEffect, useState } from 'react';
import { Shield, Key, History, Image, Video, Mic, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';

export function Navbar({ activeTab, onTabChange }) {
  const [health, setHealth] = useState({ status: 'online', keyPools: { geminiActive: 1, hfActive: 1 } });

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get('/health');
        setHealth(res.data);
      } catch (e) {
        setHealth({ status: 'offline', keyPools: { geminiActive: 0, hfActive: 0 } });
      }
    };
    check();
    const timer = setInterval(check, 20000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'image', label: 'Image', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'keys', label: 'API Keys', icon: Key },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onTabChange('image')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4 fill-zinc-950 text-zinc-950" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tracking-tight text-white">DeepShield</span>
            <span className="text-[10px] text-zinc-500 font-medium">Detector</span>
          </div>
        </div>

        {/* Central Segmented Pill Navigation */}
        <nav className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="hidden sm:inline">Engine Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}

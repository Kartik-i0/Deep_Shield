import React, { useEffect, useState } from 'react';
import { Shield, Key, History, Image, Video, Mic, FileText, Sun, Moon } from 'lucide-react';
import { api } from '@/services/api';

export function Navbar({ activeTab, onTabChange, theme = 'dark', onToggleTheme }) {
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onTabChange('image')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4 fill-current" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">DeepShield</span>
            <span className="text-[10px] text-zinc-500 font-medium">Detector</span>
          </div>
        </div>

        {/* Central Segmented Pill Navigation */}
        <nav className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Top Right Corner Controls: Engine Status & Dark/White Switch */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Engine Active</span>
          </div>

          {/* Dark / White Mode Switch */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Dark / White Mode"
            title={theme === 'dark' ? 'Switch to White (Light) Mode' : 'Switch to Dark Mode'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-medium hidden sm:inline">White</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-[11px] font-medium hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/60 bg-slate-950/40 py-8 mt-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200">DeepShield Forensics</span>
          <span>• Open-Source Deepfake Detection System</span>
        </div>

        <div className="text-slate-400 text-[11px]">
          Powered by Google Gemini 1.5/2.0 API, Hugging Face Transformers, ELA Signal Processing & MERN
        </div>
      </div>
    </footer>
  );
}


import React from 'react';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-6 mt-16 text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-medium text-zinc-300">DeepShield</span>
          <span>— Digital Content Authenticity Checker</span>
        </div>
        <div className="text-zinc-600 text-[11px]">
          Powered by Gemini Vision AI & Open Source Detection Models
        </div>
      </div>
    </footer>
  );
}

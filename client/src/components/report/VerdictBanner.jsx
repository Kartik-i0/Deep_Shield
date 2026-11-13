import React from 'react';
import { getVerdictTheme } from '@/lib/utils';
import { ShieldCheck, AlertTriangle, ShieldAlert, FileSearch } from 'lucide-react';

export function VerdictBanner({ verdict, confidenceLevel = 'HIGH', scanId }) {
  const theme = getVerdictTheme(verdict);

  const getIcon = () => {
    switch (verdict) {
      case 'AUTHENTIC':
      case 'LIKELY_AUTHENTIC':
        return <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />;
      case 'SUSPICIOUS':
        return <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />;
      default:
        return <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0 animate-pulse" />;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 ${theme.bg} ${theme.border} ${theme.glow} transition-all`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
            {getIcon()}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              DeepShield Verdict
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              <span className="text-slate-300 font-mono text-[11px]">ID: {scanId}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight mt-0.5 ${theme.color}`}>
              {theme.label}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</div>
            <span className="text-xs font-bold text-slate-200">{confidenceLevel}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badge}`}>
            {verdict.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}


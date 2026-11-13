import React from 'react';
import { getVerdictTheme } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

export function VerdictBanner({ verdict, confidenceLevel = 'HIGH', scanId }) {
  const theme = getVerdictTheme(verdict);

  return (
    <div
      className={`rounded-xl border p-5 ${theme.bg} ${theme.border} transition-all`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`p-2 rounded-lg border ${theme.border} bg-zinc-950/80`}>
            {theme.isAI ? (
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              <span>SCAN RESULT</span>
              <span>•</span>
              <span>ID: {scanId}</span>
            </div>
            <h2 className={`text-xl font-bold tracking-tight mt-0.5 ${theme.color}`}>
              {theme.label}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {theme.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className={`px-3 py-1 rounded-md text-xs font-semibold ${theme.badge}`}>
            {theme.isAI ? 'AI GENERATED' : 'AUTHENTIC'}
          </span>
        </div>
      </div>
    </div>
  );
}

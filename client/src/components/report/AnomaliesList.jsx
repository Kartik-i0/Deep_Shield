import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function AnomaliesList({ anomalies = [] }) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>No signs of AI tampering, synthetic diffusion, or face-swapping detected.</span>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {anomalies.map((anomaly, idx) => (
        <li
          key={idx}
          className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0 mt-1.5" />
          <span className="leading-relaxed">{anomaly}</span>
        </li>
      ))}
    </ul>
  );
}

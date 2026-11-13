import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function AnomaliesList({ anomalies = [] }) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 text-xs">
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>No critical digital anomalies, deepfake boundaries, or synthetic voice artifacts identified.</span>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {anomalies.map((anomaly, index) => (
        <li
          key={index}
          className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-200"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{anomaly}</span>
        </li>
      ))}
    </ul>
  );
}


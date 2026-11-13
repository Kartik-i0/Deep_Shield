import React from 'react';
import { Progress } from '@/components/ui/progress';

export function ForensicScoreGauge({ deepfakeScore = 0, authenticityScore = 100 }) {
  const isAI = deepfakeScore >= 60;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-xs font-medium text-zinc-400">Authenticity Confidence</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
            {isAI ? `${100 - deepfakeScore}%` : `${authenticityScore}%`}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-medium text-zinc-400">AI Likelihood</span>
          <div className={`text-xl font-bold mt-0.5 ${isAI ? 'text-rose-400' : 'text-emerald-400'}`}>
            {deepfakeScore}%
          </div>
        </div>
      </div>

      <Progress
        value={authenticityScore}
        color={isAI ? 'rose' : 'emerald'}
        className="h-2 bg-zinc-900"
      />

      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
        <span>0% Fake</span>
        <span className="text-zinc-400 font-medium">
          {isAI ? 'Identified as AI Generated' : 'Identified as Genuine'}
        </span>
        <span>100% Real</span>
      </div>
    </div>
  );
}

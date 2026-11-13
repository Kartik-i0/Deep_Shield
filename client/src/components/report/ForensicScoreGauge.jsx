import React from 'react';

export function ForensicScoreGauge({ deepfakeScore = 0, authenticityScore = 100 }) {
  // SVG circular gauge
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (deepfakeScore / 100) * circumference;

  let strokeColor = '#10b981'; // Green
  let riskLabel = 'AUTHENTIC';

  if (deepfakeScore >= 75) {
    strokeColor = '#f43f5e'; // Rose
    riskLabel = 'CRITICAL DEEPFAKE RISK';
  } else if (deepfakeScore >= 50) {
    strokeColor = '#f97316'; // Orange
    riskLabel = 'HIGH RISK';
  } else if (deepfakeScore >= 30) {
    strokeColor = '#f59e0b'; // Amber
    riskLabel = 'MODERATE SUSPICION';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#1e293b"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated score ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Score Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {deepfakeScore}%
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            Synthetic Risk
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <div className="text-xs font-bold tracking-wider" style={{ color: strokeColor }}>
          {riskLabel}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          Authenticity Index: <span className="font-semibold text-emerald-400">{authenticityScore}%</span>
        </div>
      </div>
    </div>
  );
}


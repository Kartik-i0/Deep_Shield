import React from 'react';
import { Progress } from '@/components/ui/progress';

export function ForensicMatrixRadar({ breakdown }) {
  if (!breakdown) return null;

  const metrics = [
    {
      key: 'facialConsistency',
      label: 'Facial & Structural Geometry',
      desc: 'Checks eye reflection, ear symmetry, and teeth contours',
      val: breakdown.facialConsistency ?? 90,
    },
    {
      key: 'lightingAcousticPhysics',
      label: 'Lighting & Physics Consistency',
      desc: 'Shadow vectors, room acoustic reflections, and ambient reverb',
      val: breakdown.lightingAcousticPhysics ?? 88,
    },
    {
      key: 'compressionFrequencyPurity',
      label: 'Compression & Frequency Spectrum',
      desc: 'High-frequency vocoder cutoff, DCT noise, and ELA error',
      val: breakdown.compressionFrequencyPurity ?? 85,
    },
    {
      key: 'metadataIntegrity',
      label: 'Metadata & Hardware Provenance',
      desc: 'Camera EXIF profile, software headers, and C2PA markers',
      val: breakdown.metadataIntegrity ?? 80,
    },
  ];

  const getColor = (v) => {
    if (v >= 80) return 'emerald';
    if (v >= 50) return 'amber';
    return 'rose';
  };

  return (
    <div className="space-y-4">
      {metrics.map((m) => (
        <div key={m.key} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-200">{m.label}</span>
              <span className="text-slate-400 text-[11px] ml-2 hidden sm:inline">({m.desc})</span>
            </div>
            <span className="font-mono font-bold text-slate-100">{m.val}%</span>
          </div>
          <Progress value={m.val} color={getColor(m.val)} className="h-2 bg-slate-800" />
        </div>
      ))}
    </div>
  );
}


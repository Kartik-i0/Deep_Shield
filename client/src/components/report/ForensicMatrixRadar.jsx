import React from 'react';
import { Progress } from '@/components/ui/progress';

export function ForensicMatrixRadar({ breakdown }) {
  if (!breakdown) return null;

  const checks = [
    {
      title: 'Physical Reality & Details',
      desc: 'Checks hands, facial features, edges, and texture naturalness',
      val: breakdown.facialConsistency ?? 95,
    },
    {
      title: 'Lighting & Environment',
      desc: 'Verifies if shadows, reflections, and ambient lighting look real',
      val: breakdown.lightingAcousticPhysics ?? 92,
    },
    {
      title: 'Digital Quality & Artifacts',
      desc: 'Looks for telltale AI blur, diffusion noise, or compression seams',
      val: breakdown.compressionFrequencyPurity ?? 90,
    },
    {
      title: 'Source & Origin Checks',
      desc: 'Analyzes digital camera traces and file integrity',
      val: breakdown.metadataIntegrity ?? 94,
    },
  ];

  const getColor = (v) => {
    if (v >= 70) return 'emerald';
    if (v >= 45) return 'amber';
    return 'rose';
  };

  return (
    <div className="space-y-4">
      {checks.map((c, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-medium text-zinc-200">{c.title}</span>
              <span className="text-zinc-500 text-[11px] ml-2 hidden sm:inline">— {c.desc}</span>
            </div>
            <span className="font-mono text-zinc-300 font-semibold">{c.val}%</span>
          </div>
          <Progress value={c.val} color={getColor(c.val)} className="h-1.5 bg-zinc-900" />
        </div>
      ))}
    </div>
  );
}

import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Layers, Eye, Info } from 'lucide-react';

export function ElaViewerModal({ open, onClose, originalUrl, elaHeatmapUrl, meanError }) {
  const [activeView, setActiveView] = useState('heatmap'); // 'heatmap' | 'original' | 'split'

  return (
    <Dialog open={open} onClose={onClose} className="max-w-3xl">
      <DialogHeader>
        <div className="flex items-center gap-2 text-sky-400">
          <Layers className="w-5 h-5" />
          <DialogTitle>Error Level Analysis (ELA) Forensic Heatmap</DialogTitle>
        </div>
        <DialogDescription>
          ELA detects compression error discrepancies. Spliced regions, generative inpainting, or synthetic AI overlays appear with stark brightness variations compared to the baseline texture.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-lg">
          <Button
            size="sm"
            variant={activeView === 'heatmap' ? 'default' : 'ghost'}
            onClick={() => setActiveView('heatmap')}
            className="h-7 text-xs"
          >
            ELA Heatmap
          </Button>
          <Button
            size="sm"
            variant={activeView === 'original' ? 'default' : 'ghost'}
            onClick={() => setActiveView('original')}
            className="h-7 text-xs"
          >
            Original
          </Button>
          <Button
            size="sm"
            variant={activeView === 'split' ? 'default' : 'ghost'}
            onClick={() => setActiveView('split')}
            className="h-7 text-xs"
          >
            Side-by-Side
          </Button>
        </div>

        <div className="font-mono text-slate-300">
          Mean Error: <span className="font-bold text-sky-400">{meanError || 'N/A'}</span>
        </div>
      </div>

      <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-2 overflow-hidden min-h-[300px] flex items-center justify-center">
        {activeView === 'heatmap' && (
          <img
            src={elaHeatmapUrl}
            alt="ELA Heatmap"
            className="max-h-[440px] w-auto rounded-lg object-contain shadow-2xl"
          />
        )}

        {activeView === 'original' && originalUrl && (
          <img
            src={originalUrl}
            alt="Original Preview"
            className="max-h-[440px] w-auto rounded-lg object-contain"
          />
        )}

        {activeView === 'split' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 font-semibold mb-1 block">Original Photo</span>
              <img
                src={originalUrl}
                alt="Original"
                className="max-h-[280px] w-full rounded-lg object-contain border border-slate-800"
              />
            </div>
            <div className="text-center">
              <span className="text-[11px] text-sky-400 font-semibold mb-1 block">ELA Artifact Heatmap</span>
              <img
                src={elaHeatmapUrl}
                alt="ELA Heatmap"
                className="max-h-[280px] w-full rounded-lg object-contain border border-sky-900/60"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-white">How to read this:</span> Authentic camera photos produce a homogenous, speckled noise floor conforming to surface detail. Bright glowing patches or unnatural smooth black islands reveal edited or synthetic regions.
        </p>
      </div>
    </Dialog>
  );
}


import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Info } from 'lucide-react';

export function ElaViewerModal({ open, onClose, originalUrl, elaHeatmapUrl, meanError }) {
  const [activeView, setActiveView] = useState('heatmap'); // 'heatmap' | 'original' | 'split'

  return (
    <Dialog open={open} onClose={onClose} className="max-w-2xl">
      <DialogHeader>
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200">
          <Eye className="w-4 h-4 text-zinc-400" />
          <DialogTitle>Image Compression & Edit Inspection</DialogTitle>
        </div>
        <DialogDescription>
          This test checks the difference in compression. If a region of an image was secretly edited, pasted, or AI-generated, it shows up with noticeable brightness differences.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <Button
            size="sm"
            variant={activeView === 'heatmap' ? 'default' : 'ghost'}
            onClick={() => setActiveView('heatmap')}
            className="h-6 text-[11px]"
          >
            Heatmap
          </Button>
          <Button
            size="sm"
            variant={activeView === 'original' ? 'default' : 'ghost'}
            onClick={() => setActiveView('original')}
            className="h-6 text-[11px]"
          >
            Original
          </Button>
          <Button
            size="sm"
            variant={activeView === 'split' ? 'default' : 'ghost'}
            onClick={() => setActiveView('split')}
            className="h-6 text-[11px]"
          >
            Compare Both
          </Button>
        </div>

        <div className="font-mono text-zinc-500 dark:text-zinc-400 text-xs">
          Noise Level: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{meanError || 'N/A'}</span>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-2 overflow-hidden min-h-[260px] flex items-center justify-center">
        {activeView === 'heatmap' && (
          <img
            src={elaHeatmapUrl}
            alt="Heatmap"
            className="max-h-[380px] w-auto rounded object-contain"
          />
        )}

        {activeView === 'original' && originalUrl && (
          <img
            src={originalUrl}
            alt="Original"
            className="max-h-[380px] w-auto rounded object-contain"
          />
        )}

        {activeView === 'split' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="text-center">
              <span className="text-[10px] text-zinc-500 font-medium mb-1 block">Original Photo</span>
              <img
                src={originalUrl}
                alt="Original"
                className="max-h-[220px] w-full rounded object-contain border border-zinc-200 dark:border-zinc-800"
              />
            </div>
            <div className="text-center">
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium mb-1 block">Compression Difference</span>
              <img
                src={elaHeatmapUrl}
                alt="Heatmap"
                className="max-h-[220px] w-full rounded object-contain border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-3.5 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-medium text-zinc-900 dark:text-zinc-200">How to read this:</span> Authentic real-world camera photos show smooth, even noise throughout the frame. Sudden bright or discolored patches highlight areas that were spliced, edited, or drawn by AI.
        </p>
      </div>
    </Dialog>
  );
}

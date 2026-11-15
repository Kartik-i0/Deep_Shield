import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Cpu, Layers } from 'lucide-react';

export function EngineProvenanceBadge({ engines }) {
  if (!engines) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
        Verified By:
      </span>

      {engines.gemini?.used && (
        <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
          <Sparkles className="w-3 h-3 text-zinc-400" />
          Google Gemini Vision ({engines.gemini.model})
        </Badge>
      )}

      {engines.huggingFace?.used && (
        <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
          <Cpu className="w-3 h-3 text-zinc-400" />
          Hugging Face ({engines.huggingFace.model})
        </Badge>
      )}

      {engines.localForensics?.used && (
        <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400">
          <Layers className="w-3 h-3 text-zinc-400" />
          Error Level Analysis (ELA)
        </Badge>
      )}
    </div>
  );
}

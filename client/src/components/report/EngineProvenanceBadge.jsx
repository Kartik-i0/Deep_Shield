import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Cpu, Layers, ShieldCheck, Activity } from 'lucide-react';

export function EngineProvenanceBadge({ engines }) {
  if (!engines) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-sky-400" />
        Inspection Stack:
      </span>

      {engines.gemini?.used && (
        <Badge variant="default" className="bg-sky-950/60 text-sky-300 border-sky-800">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Google Gemini ({engines.gemini.model}) • Key: {engines.gemini.keyUsedMasked || 'Active Pool'}
        </Badge>
      )}

      {engines.huggingFace?.used && (
        <Badge variant="purple" className="bg-purple-950/60 text-purple-300 border-purple-800">
          <Cpu className="w-3 h-3 text-purple-400" />
          HuggingFace ({engines.huggingFace.model})
        </Badge>
      )}

      {engines.localForensics?.used && (
        <Badge variant="success" className="bg-emerald-950/60 text-emerald-300 border-emerald-800">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          DeepShield Native Signal Forensics
        </Badge>
      )}

      {engines.localForensics?.elaScore !== undefined && (
        <Badge variant="outline" className="bg-slate-800/80 text-slate-300">
          <Activity className="w-3 h-3 text-sky-400" />
          ELA Compression Analysis
        </Badge>
      )}

      {engines.localForensics?.softwareTag && (
        <Badge variant="warning" className="bg-amber-950/50 text-amber-300 border-amber-800">
          Tag: {engines.localForensics.softwareTag}
        </Badge>
      )}
    </div>
  );
}

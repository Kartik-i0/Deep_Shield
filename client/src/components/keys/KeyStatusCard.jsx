import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, Trash2, Clock, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export function KeyStatusCard({ keyItem, provider, onDelete }) {
  const isRateLimited = keyItem.status === 'RATE_LIMITED';
  const isInvalid = keyItem.status === 'INVALID';
  const isActive = keyItem.status === 'ACTIVE';

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs hover:border-slate-700 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-sky-950/60 text-sky-400' : isRateLimited ? 'bg-amber-950/60 text-amber-400' : 'bg-rose-950/60 text-rose-400'}`}>
          <Key className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-100">{keyItem.masked}</span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 uppercase">
              {keyItem.source}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
            <span>Requests: <strong className="text-slate-200">{keyItem.requestCount}</strong></span>
            {keyItem.errorCount > 0 && (
              <span>Errors: <strong className="text-rose-400">{keyItem.errorCount}</strong></span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isActive && (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </Badge>
        )}

        {isRateLimited && (
          <Badge variant="warning" className="gap-1 animate-pulse">
            <Clock className="w-3 h-3" />
            Cooldown ({keyItem.cooldownRemainingSeconds}s)
          </Badge>
        )}

        {isInvalid && (
          <Badge variant="destructive" className="gap-1">
            <ShieldAlert className="w-3 h-3" />
            Invalid
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(provider, keyItem.id)}
          className="text-slate-500 hover:text-rose-400 h-8 w-8"
          title="Remove key from pool"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}


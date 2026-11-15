import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, Trash2, Clock, CheckCircle2 } from 'lucide-react';

export function KeyStatusCard({ keyItem, provider, onDelete }) {
  const isRateLimited = keyItem.status === 'RATE_LIMITED';
  const isActive = keyItem.status === 'ACTIVE';

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-1.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          <Key className="w-3.5 h-3.5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium text-zinc-900 dark:text-zinc-200">{keyItem.masked}</span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 uppercase border-zinc-200 dark:border-zinc-800 text-zinc-500">
              {keyItem.source}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
            <span>Requests: <strong className="text-zinc-800 dark:text-zinc-300">{keyItem.requestCount}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {isActive && (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Active
          </Badge>
        )}

        {isRateLimited && (
          <Badge variant="warning" className="gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Cooldown ({keyItem.cooldownRemainingSeconds}s)
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(provider, keyItem.id)}
          className="text-zinc-500 hover:text-rose-400 h-7 w-7"
          title="Remove key"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

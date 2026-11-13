import React from 'react';
import { cn } from '@/lib/utils';

export function Progress({ value = 0, max = 100, className, color = 'emerald' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    zinc: 'bg-zinc-200',
  };

  return (
    <div className={cn("relative w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-300 ease-out rounded-full", colors[color] || colors.emerald)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

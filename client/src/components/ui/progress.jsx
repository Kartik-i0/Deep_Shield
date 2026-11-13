import React from 'react';
import { cn } from '@/lib/utils';

export function Progress({ value = 0, max = 100, className, indicatorClassName, color = 'sky' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorStyles = {
    sky: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500',
  };

  return (
    <div className={cn("relative w-full h-2 bg-slate-800 rounded-full overflow-hidden", className)}>
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full",
          colorStyles[color] || colorStyles.sky,
          indicatorClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}


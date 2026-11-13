import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-zinc-800 text-zinc-200 border-zinc-700",
    success: "bg-emerald-950/40 text-emerald-300 border-emerald-800/60",
    warning: "bg-amber-950/40 text-amber-300 border-amber-800/60",
    destructive: "bg-rose-950/40 text-rose-300 border-rose-800/60",
    outline: "bg-transparent text-zinc-400 border-zinc-800",
    secondary: "bg-zinc-900 text-zinc-300 border-zinc-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export function Alert({ variant = 'info', className, title, children }) {
  const styles = {
    info: {
      bg: 'bg-zinc-900 border-zinc-800 text-zinc-300',
      icon: Info,
      iconColor: 'text-zinc-400',
    },
    success: {
      bg: 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    warning: {
      bg: 'bg-amber-950/20 border-amber-900/40 text-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    destructive: {
      bg: 'bg-rose-950/20 border-rose-900/40 text-rose-300',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
    },
  };

  const current = styles[variant] || styles.info;
  const IconComponent = current.icon;

  return (
    <div
      className={cn(
        "flex gap-3 p-3.5 rounded-lg border text-xs",
        current.bg,
        className
      )}
    >
      <IconComponent className={cn("w-4 h-4 shrink-0 mt-0.5", current.iconColor)} />
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5 text-zinc-200">{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

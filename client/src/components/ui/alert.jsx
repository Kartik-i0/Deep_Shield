import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export function Alert({ variant = 'info', className, title, children }) {
  const styles = {
    info: {
      bg: 'bg-sky-950/40 border-sky-800/60 text-sky-200',
      icon: Info,
      iconColor: 'text-sky-400',
    },
    success: {
      bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    warning: {
      bg: 'bg-amber-950/40 border-amber-800/60 text-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    destructive: {
      bg: 'bg-rose-950/40 border-rose-800/60 text-rose-200',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
    },
  };

  const current = styles[variant] || styles.info;
  const IconComponent = current.icon;

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl border text-sm backdrop-blur-sm",
        current.bg,
        className
      )}
    >
      <IconComponent className={cn("w-5 h-5 shrink-0 mt-0.5", current.iconColor)} />
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-1 text-white">{title}</h5>}
        <div className="text-slate-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}


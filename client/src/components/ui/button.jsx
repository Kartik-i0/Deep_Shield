import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] cursor-pointer select-none";

    const variants = {
      default: "bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm font-semibold",
      secondary: "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border border-zinc-800",
      outline: "border border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white",
      ghost: "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50",
      destructive: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm",
      success: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm",
    };

    const sizes = {
      default: "h-9 px-4 py-2 text-xs",
      sm: "h-7 px-3 text-[11px] rounded-md",
      lg: "h-11 px-6 text-sm rounded-lg font-semibold",
      icon: "h-8 w-8 p-0 rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

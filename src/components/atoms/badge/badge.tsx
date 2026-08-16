import React from 'react';
import { cn } from '../../../utils/cn';
import './badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'red' | 'slate' | 'green' | 'yellow' | 'blue';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  className,
  children,
  ...props
}) => {
  const variants = {
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  };

  return (
    <div
      className={cn(
        'f1-badge inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

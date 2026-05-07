import React from 'react';
import { cn } from '../../../utils/cn';
import './skeleton.scss';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn('f1-skeleton animate-pulse rounded bg-slate-800', className)} {...props} />;
};

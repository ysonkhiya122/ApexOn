/**
 * Timeline Skeleton Component
 * 
 * Loading skeleton for timeline feed.
 * Shows 5 placeholder entries while data loads.
 */

import React from 'react';
import { Skeleton } from '../../shared/components/atoms/skeleton';
import './TimelineSkeleton.scss';

export const TimelineSkeleton: React.FC = () => {
  return (
    <div className="timeline-skeleton">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="timeline-skeleton__entry">
          <div className="timeline-skeleton__time">
            <Skeleton className="timeline-skeleton__lap" />
            <Skeleton className="timeline-skeleton__relative" />
          </div>
          <Skeleton className="timeline-skeleton__icon" />
          <div className="timeline-skeleton__content">
            <Skeleton className="timeline-skeleton__message" />
            <Skeleton className="timeline-skeleton__submessage" />
          </div>
        </div>
      ))}
    </div>
  );
};

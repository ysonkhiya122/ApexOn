/**
 * Timeline Feed Component
 * 
 * Main timeline feed with auto-scroll behavior.
 * 
 * Features:
 * - Auto-scrolls to newest entries during live race
 * - Pauses auto-scroll when user manually scrolls
 * - Shows "Jump to Live" button when paused
 * - Visual hierarchy by priority (critical/high/medium/low)
 * - Relative race time display (Lap 42, 2 min ago)
 * - Mobile responsive
 */

import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { TimelineEntry } from '../../types/timeline.types';
import { formatRaceTime } from '../../utils/timeline/formatRaceTime';
import { Button } from '@/components/atoms/button';
import * as Icons from 'lucide-react';
import './timeline-feed.scss';

// Temporary skeleton until we create the component
const TimelineSkeleton = () => (
  <div className="timeline-skeleton">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="timeline-skeleton__item animate-pulse" />
    ))}
  </div>
);

export const TimelineFeed: React.FC = () => {
  const timeline = useAppSelector((state) => state.raceState.timeline.entries);
  const isLoading = useAppSelector((state) => state.raceState.isLoading);
  const isRaceLive = useAppSelector((state) => state.raceState.sessionStatus === 'live');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [showJumpButton, setShowJumpButton] = useState(false);
  
  // Auto-scroll to top (newest) when new entries arrive
  useEffect(() => {
    if (isLoading || !containerRef.current) return;
    
    // Only auto-scroll if user hasn't manually scrolled
    if (!userScrolled && isRaceLive) {
      containerRef.current.scrollTop = 0; // Newest entries at top
    } else if (userScrolled && isRaceLive) {
      // Show "Jump to Live" button
      setShowJumpButton(true);
    }
  }, [timeline, isLoading, userScrolled, isRaceLive]);
  
  // Detect manual scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop } = containerRef.current;
    
    // If user scrolled down more than 100px from top
    if (scrollTop > 100) {
      setUserScrolled(true);
      setShowJumpButton(true);
    } else {
      setUserScrolled(false);
      setShowJumpButton(false);
    }
  };
  
  // Jump to live (top)
  const jumpToLive = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setUserScrolled(false);
      setShowJumpButton(false);
    }
  };
  
  if (isLoading) {
    return <TimelineSkeleton />;
  }
  
  if (timeline.length === 0) {
    return (
      <div className="timeline-empty">
        <p>No race events yet. Check back when the session starts!</p>
      </div>
    );
  }
  
  return (
    <div className="timeline-feed-container">
      <div 
        ref={containerRef}
        className="timeline-feed"
        onScroll={handleScroll}
      >
        {timeline.map((entry: TimelineEntry) => (
          <TimelineEntry key={entry.id} entry={entry} />
        ))}
      </div>
      
      {/* Jump to Live Button */}
      {showJumpButton && isRaceLive && (
        <Button
          variant="primary"
          size="sm"
          onClick={jumpToLive}
          className="timeline-jump-button"
        >
          Jump to Live
        </Button>
      )}
    </div>
  );
};

/**
 * Single timeline entry component.
 * Visual hierarchy by priority and color.
 */
const TimelineEntry = ({ entry }: { entry: TimelineEntry }) => {
  const renderIcon = () => {
    switch (entry.icon) {
      case 'safety-car':
        return <Icons.Car size={20} />;
      case 'flag':
        return <Icons.Flag size={20} />;
      case 'stop':
        return <Icons.AlertCircle size={20} />;
      case 'check':
        return <Icons.CheckCircle size={20} />;
      case 'pit-stop':
        return <Icons.Wrench size={20} />;
      case 'overtake':
        return <Icons.TrendingUp size={20} />;
      case 'drs':
        return <Icons.Zap size={20} />;
      default:
        return <Icons.Info size={20} />;
    }
  };
  
  return (
    <div className={`timeline-entry timeline-entry--${entry.priority} timeline-entry--${entry.color}`}>
      <div className="timeline-entry__time">
        <span className="timeline-entry__lap">{formatRaceTime(entry.timestamp, entry.lap)}</span>
      </div>
      <div className={`timeline-entry__icon timeline-entry__icon--${entry.color}`}>
        {renderIcon()}
      </div>
      <div className="timeline-entry__content">
        <div className="timeline-entry__message">{entry.message}</div>
        {entry.subMessage && (
          <div className="timeline-entry__submessage">{entry.subMessage}</div>
        )}
        {entry.driverName && (
          <div className="timeline-entry__driver">{entry.driverName}</div>
        )}
        {entry.teamName && (
          <div className="timeline-entry__team">{entry.teamName}</div>
        )}
      </div>
    </div>
  );
};

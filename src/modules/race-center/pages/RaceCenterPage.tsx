/**
 * Race Center Page — TASK 7 Phase A
 * 
 * CRITICAL: This is the SINGLE POLLING OWNER for the entire live system.
 * 
 * DO NOT add polling to other components.
 */

import React, { useMemo, useEffect, useState } from 'react';
import { useGetSessionsQuery, useGetLiveTimingQuery } from '../../../store/services/openF1Service';
import { 
  findActiveSession, 
  getSessionStatus, 
  getPollingInterval,
  getSessionName 
} from '../../../utils/race/sessionDiscovery';
import { LeaderboardPanel } from '../../../components/organisms/LeaderboardPanel';
import { TimelineFeed } from '../../../components/organisms/TimelineFeed';
import { Badge } from '../../../shared/components/atoms/badge';
import { Skeleton } from '../../../shared/components/atoms/skeleton';
import { FreshnessIndicator } from '../../../components/common/FreshnessIndicator';
import { RealtimeErrorBoundary } from '../../../components/common/RealtimeErrorBoundary';
import './race-center.scss';

export const RaceCenterPage: React.FC = () => {
  // Tab visibility state (for polling optimization)
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Track tab visibility (reduces polling when hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Session discovery
  const { data: sessionsData, isLoading: sessionsLoading, error: sessionsError } = useGetSessionsQuery({});
  
  // Find active session
  const activeSession = useMemo(() => {
    if (!sessionsData || !Array.isArray(sessionsData)) {
      return null;
    }
    return findActiveSession(sessionsData);
  }, [sessionsData]);

  // Get session status
  const sessionStatus = useMemo(() => {
    return getSessionStatus(activeSession);
  }, [activeSession]);

  // Get polling interval based on session type (optimized for tab visibility)
  const pollingInterval = useMemo(() => {
    const sessionType = activeSession?.session_type as 'race' | 'qualifying' | 'practice' | 'ended' | 'none' || 'none';
    return getPollingInterval(sessionType, isTabVisible);
  }, [activeSession, isTabVisible]);

  // Live timing query - ONLY POLLING POINT IN ENTIRE APP
  useGetLiveTimingQuery(
    activeSession?.session_key ?? 0,
    {
      pollingInterval,
      skip: !activeSession?.session_key,
    }
  );

  // Render session status indicator
  const renderSessionStatus = () => {
    const statusConfig = {
      live: { color: 'green', label: 'LIVE' },
      upcoming: { color: 'yellow', label: 'UPCOMING' },
      ended: { color: 'slate', label: 'ENDED' },
    };

    const config = statusConfig[sessionStatus as keyof typeof statusConfig] || statusConfig.ended;

    return (
      <Badge variant={config.color as any} className="race-center-page__status">
        {config.label}
      </Badge>
    );
  };

  return (
    <RealtimeErrorBoundary>
      <div className="race-center-page">
        <div className="race-center-page__header">
          <div className="race-center-page__header-top">
            <h1 className="race-center-page__title">Race Center</h1>
            {sessionsLoading ? (
              <Skeleton className="race-center-page__status-skeleton" />
            ) : sessionsError ? (
              <Badge variant="red">ERROR</Badge>
            ) : (
              renderSessionStatus()
            )}
          </div>
          <p className="race-center-page__subtitle">
            {activeSession ? getSessionName(activeSession) : 'No active session'}
          </p>
          <div className="race-center-page__info">
            <span>Polling: {pollingInterval}ms</span>
            {activeSession && (
              <FreshnessIndicator lastUpdate={Date.now()} />
            )}
          </div>
        </div>

        <div className="race-center-page__content">
          {/* Live Leaderboard - CORE FEATURE */}
          <div className="race-center-page__leaderboard">
            <h2 className="race-center-page__section-title">Live Standings</h2>
            <LeaderboardPanel />
          </div>

        {/* Timeline Feed */}
        <div className="race-center-page__timeline">
          <h2 className="race-center-page__section-title">Race Timeline</h2>
          <TimelineFeed />
        </div>
      </div>
    </div>
    </RealtimeErrorBoundary>
  );
};

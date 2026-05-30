/**
 * Race Center Page
 *
 * CRITICAL: This page is the single polling owner for the live race-center
 * experience. Presentation components read normalized Redux state only.
 */

import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useGetSessionsQuery,
  useGetLiveTimingQuery,
  useGetDriversQuery,
  useGetRaceControlQuery,
  useGetPitStopsQuery,
} from '../../../store/services/openF1Service';
import {
  findActiveSession,
  getSessionStatus,
  getPollingInterval,
  getSessionName,
} from '../../../utils/race/sessionDiscovery';
import { LeaderboardPanel } from '../../../components/organisms/LeaderboardPanel';
import { TimelineFeed } from '../../../components/organisms/TimelineFeed';
import { Badge } from '../../../shared/components/atoms/badge';
import { Skeleton } from '../../../shared/components/atoms/skeleton';
import { FreshnessIndicator } from '../../../components/common/FreshnessIndicator';
import { RealtimeErrorBoundary } from '../../../components/common/RealtimeErrorBoundary';
import {
  updateLeaderboard,
  updateSessionStatus as updateLeaderboardSessionStatus,
  setLoading as setLeaderboardLoading,
  setError as setLeaderboardError,
} from '../../../store/slices/leaderboardSlice';
import {
  updateDrivers,
  updateRaceControl,
  updatePitStops,
  updateSessionStatus as updateRaceSessionStatus,
  setLoading as setRaceLoading,
  setError as setRaceError,
} from '../../../store/slices/raceStateSlice';
import type { Driver, PitStop, RaceControlMessage } from '../../../types/timeline.types';
import type { LeaderboardEntry } from '../../../types/leaderboard.types';
import './race-center.scss';

const mapSessionStatus = (status: 'live' | 'upcoming' | 'ended') => {
  if (status === 'live') return 'live';
  if (status === 'upcoming') return 'scheduled';
  return 'completed';
};

const makeStableId = (...parts: Array<string | number | undefined | null>) =>
  parts
    .filter((part) => part !== undefined && part !== null && part !== '')
    .join('-')
    .replace(/\s+/g, '-')
    .toLowerCase();

const normalizeDrivers = (drivers: any[] = []): Driver[] =>
  drivers.map((driver) => ({
    id: `driver-${driver.driver_number}`,
    firstName: driver.first_name || driver.firstName || driver.broadcast_name || 'Unknown',
    lastName: driver.last_name || driver.lastName || `#${driver.driver_number}`,
    fullName:
      driver.full_name ||
      driver.fullName ||
      [driver.first_name, driver.last_name].filter(Boolean).join(' ') ||
      driver.broadcast_name ||
      `Driver #${driver.driver_number}`,
    number: Number(driver.driver_number ?? driver.number ?? 0),
    team: driver.team_name || driver.team || 'Unknown',
  }));

const normalizeRaceControl = (messages: any[] = [], sessionKey: number): RaceControlMessage[] =>
  messages.map((message, index) => ({
    id: makeStableId('rc', message.date, message.category, message.message, message.lap_number, index),
    session_key: Number(message.session_key ?? sessionKey),
    lap: Number(message.lap_number ?? message.lap ?? 0),
    date: message.date || new Date().toISOString(),
    category: String(message.category || message.flag || message.scope || 'INFO').toUpperCase(),
    message: message.message,
  }));

const normalizePitStops = (pitStops: any[] = [], sessionKey: number): PitStop[] =>
  pitStops.map((stop, index) => ({
    id: makeStableId('pit', stop.date, stop.driver_number, stop.lap_number, index),
    session_key: Number(stop.session_key ?? sessionKey),
    driver_number: Number(stop.driver_number ?? 0),
    lap: Number(stop.lap_number ?? stop.lap ?? 0),
    date: stop.date || new Date().toISOString(),
    duration: Number(stop.pit_duration ?? stop.duration ?? 0),
  }));

export const RaceCenterPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const { data: sessionsData, isLoading: sessionsLoading, error: sessionsError } = useGetSessionsQuery();

  const activeSession = useMemo(() => {
    if (!sessionsData || !Array.isArray(sessionsData)) return null;
    return findActiveSession(sessionsData);
  }, [sessionsData]);

  const sessionStatus = useMemo(() => getSessionStatus(activeSession), [activeSession]);
  const normalizedSessionStatus = useMemo(() => mapSessionStatus(sessionStatus), [sessionStatus]);
  const sessionKey = activeSession?.session_key;

  const pollingInterval = useMemo(() => {
    const sessionType =
      (activeSession?.session_type as 'race' | 'qualifying' | 'practice' | 'ended' | 'none') || 'none';

    if (sessionStatus !== 'live') {
      return 0;
    }

    // Public OpenF1 rate limits are easy to hit in development. Use a safer
    // minimum interval even for live races, and let tab visibility increase it.
    return Math.max(getPollingInterval(sessionType, isTabVisible), 10000);
  }, [activeSession, isTabVisible, sessionStatus]);

  const contextPollingInterval = sessionStatus === 'live' ? 30000 : 0;
  const driverPollingInterval = sessionStatus === 'live' ? 60000 : 0;

  const liveTimingQuery = useGetLiveTimingQuery(sessionKey ?? 0, {
    pollingInterval,
    skip: !sessionKey,
  });

  const driversQuery = useGetDriversQuery(
    { session_key: sessionKey ?? 0 },
    {
      pollingInterval: driverPollingInterval,
      skip: !sessionKey,
    }
  );

  const raceControlQuery = useGetRaceControlQuery(
    { session_key: sessionKey ?? 0 },
    {
      pollingInterval: contextPollingInterval,
      skip: !sessionKey,
    }
  );

  const pitStopsQuery = useGetPitStopsQuery(
    { session_key: sessionKey ?? 0 },
    {
      pollingInterval: contextPollingInterval,
      skip: !sessionKey,
    }
  );

  useEffect(() => {
    dispatch(updateLeaderboardSessionStatus(normalizedSessionStatus));
    dispatch(updateRaceSessionStatus(normalizedSessionStatus));
  }, [dispatch, normalizedSessionStatus]);

  useEffect(() => {
    dispatch(setLeaderboardLoading(liveTimingQuery.isLoading));
    dispatch(setLeaderboardError(liveTimingQuery.error ? 'Unable to load live timing data.' : null));

    if (Array.isArray(liveTimingQuery.data)) {
      dispatch(updateLeaderboard(liveTimingQuery.data as LeaderboardEntry[]));
    }
  }, [dispatch, liveTimingQuery.data, liveTimingQuery.error, liveTimingQuery.isLoading]);

  useEffect(() => {
    dispatch(setRaceLoading(raceControlQuery.isLoading || pitStopsQuery.isLoading));
    dispatch(
      setRaceError(
        raceControlQuery.error || pitStopsQuery.error
          ? 'Unable to load complete race timeline data.'
          : null
      )
    );
  }, [dispatch, raceControlQuery.error, raceControlQuery.isLoading, pitStopsQuery.error, pitStopsQuery.isLoading]);

  useEffect(() => {
    if (Array.isArray(driversQuery.data)) {
      dispatch(updateDrivers(normalizeDrivers(driversQuery.data)));
    }
  }, [dispatch, driversQuery.data]);

  useEffect(() => {
    if (sessionKey && Array.isArray(raceControlQuery.data)) {
      dispatch(updateRaceControl(normalizeRaceControl(raceControlQuery.data, sessionKey)));
    }
  }, [dispatch, raceControlQuery.data, sessionKey]);

  useEffect(() => {
    if (sessionKey && Array.isArray(pitStopsQuery.data)) {
      dispatch(updatePitStops(normalizePitStops(pitStopsQuery.data, sessionKey)));
    }
  }, [dispatch, pitStopsQuery.data, sessionKey]);

  const renderSessionStatus = () => {
    const statusConfig = {
      live: { color: 'green', label: 'LIVE' },
      upcoming: { color: 'yellow', label: 'UPCOMING' },
      ended: { color: 'slate', label: 'ENDED' },
    };

    const config = statusConfig[sessionStatus] || statusConfig.ended;

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
            <span>Polling: {sessionKey && pollingInterval > 0 ? `${pollingInterval}ms` : 'paused'}</span>
            <FreshnessIndicator lastUpdate={liveTimingQuery.fulfilledTimeStamp || Date.now()} />
          </div>
        </div>

        <div className="race-center-page__content">
          <div className="race-center-page__leaderboard">
            <h2 className="race-center-page__section-title">Live Standings</h2>
            <LeaderboardPanel />
          </div>

          <div className="race-center-page__timeline">
            <h2 className="race-center-page__section-title">Race Timeline</h2>
            <TimelineFeed />
          </div>
        </div>
      </div>
    </RealtimeErrorBoundary>
  );
};

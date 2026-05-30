/**
 * Race Center Page
 *
 * CRITICAL: This page is the single polling owner for the live race-center
 * experience. Presentation components read normalized Redux state only.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  useGetDriversQuery,
  useGetLiveTimingQuery,
  useGetPitStopsQuery,
  useGetRaceControlQuery,
  useGetSessionsQuery,
} from '../../../store/services/openF1Service';
import {
  findActiveSession,
  getPollingInterval,
  getSessionName,
  getSessionStatus,
  type Session,
} from '../../../utils/race/sessionDiscovery';
import { LeaderboardPanel } from '../../../components/organisms/LeaderboardPanel';
import { TimelineFeed } from '../../../components/organisms/TimelineFeed';
import { Badge } from '../../../shared/components/atoms/badge';
import { Skeleton } from '../../../shared/components/atoms/skeleton';
import { FreshnessIndicator } from '../../../components/common/FreshnessIndicator';
import { RealtimeErrorBoundary } from '../../../components/common/RealtimeErrorBoundary';
import {
  clearLeaderboard,
  setError as setLeaderboardError,
  setLoading as setLeaderboardLoading,
  updateLeaderboard,
  updateSessionStatus as updateLeaderboardSessionStatus,
} from '../../../store/slices/leaderboardSlice';
import {
  clearTimeline,
  setError as setRaceError,
  setLoading as setRaceLoading,
  updateDrivers,
  updatePitStops,
  updateRaceControl,
  updateSessionStatus as updateRaceSessionStatus,
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

const formatSessionDate = (value?: string) => {
  if (!value) return 'Date unavailable';

  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface RaceCenterIdleStateProps {
  session: Session | null;
  status: 'upcoming' | 'ended';
  onRefresh: () => void;
}

const RaceCenterIdleState: React.FC<RaceCenterIdleStateProps> = ({ session, status, onRefresh }) => {
  const isUpcoming = status === 'upcoming';

  return (
    <section className="race-center-idle" aria-labelledby="race-center-idle-title">
      <div className="race-center-idle__eyebrow">Race Center standby</div>
      <h2 id="race-center-idle-title" className="race-center-idle__title">
        {isUpcoming ? 'Next session is not live yet' : 'No live session right now'}
      </h2>
      <p className="race-center-idle__copy">
        {isUpcoming
          ? 'Live timing, race control, and pit-lane feeds will activate automatically when the session starts.'
          : 'The latest OpenF1 session is completed, so live endpoints are paused to avoid public API rate limits.'}
      </p>

      {session && (
        <div className="race-center-idle__session">
          <div>
            <span className="race-center-idle__label">Session</span>
            <strong>{getSessionName(session)}</strong>
          </div>
          <div>
            <span className="race-center-idle__label">Starts</span>
            <strong>{formatSessionDate(session.date_start)}</strong>
          </div>
          {session.date_end && (
            <div>
              <span className="race-center-idle__label">Ends</span>
              <strong>{formatSessionDate(session.date_end)}</strong>
            </div>
          )}
        </div>
      )}

      <div className="race-center-idle__actions">
        <button type="button" className="race-center-idle__button" onClick={onRefresh}>
          Check again
        </button>
        <Link className="race-center-idle__link" to="/race-center/test">
          Open timeline demo
        </Link>
        <Link className="race-center-idle__link" to="/race-center/test-leaderboard">
          Open leaderboard demo
        </Link>
      </div>
    </section>
  );
};

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

  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useGetSessionsQuery();

  const activeSession = useMemo(() => {
    if (!sessionsData || !Array.isArray(sessionsData)) return null;
    return findActiveSession(sessionsData);
  }, [sessionsData]);

  const sessionStatus = useMemo(() => getSessionStatus(activeSession), [activeSession]);
  const normalizedSessionStatus = useMemo(() => mapSessionStatus(sessionStatus), [sessionStatus]);
  const sessionKey = activeSession?.session_key;
  const isLiveSession = sessionStatus === 'live' && !!sessionKey;

  const pollingInterval = useMemo(() => {
    const sessionType =
      (activeSession?.session_type as 'race' | 'qualifying' | 'practice' | 'ended' | 'none') || 'none';

    if (!isLiveSession) return 0;

    // Public OpenF1 rate limits are easy to hit in development. Use a safer
    // minimum interval even for live races, and let tab visibility increase it.
    return Math.max(getPollingInterval(sessionType, isTabVisible), 10000);
  }, [activeSession, isLiveSession, isTabVisible]);

  const contextPollingInterval = isLiveSession ? 30000 : 0;
  const driverPollingInterval = isLiveSession ? 60000 : 0;

  const liveTimingQuery = useGetLiveTimingQuery(sessionKey ?? 0, {
    pollingInterval,
    skip: !isLiveSession,
  });

  const driversQuery = useGetDriversQuery(
    { session_key: sessionKey ?? 0 },
    {
      pollingInterval: driverPollingInterval,
      skip: !isLiveSession,
    }
  );

  const raceControlQuery = useGetRaceControlQuery(
    { session_key: sessionKey ?? 0 },
    {
      pollingInterval: contextPollingInterval,
      skip: !isLiveSession,
    }
  );

  const pitStopsQuery = useGetPitStopsQuery(
    { session_key: sessionKey ?? 0 },
    {
      pollingInterval: contextPollingInterval,
      skip: !isLiveSession,
    }
  );

  useEffect(() => {
    dispatch(updateLeaderboardSessionStatus(normalizedSessionStatus));
    dispatch(updateRaceSessionStatus(normalizedSessionStatus));
  }, [dispatch, normalizedSessionStatus]);

  useEffect(() => {
    if (!isLiveSession) {
      dispatch(clearLeaderboard());
      dispatch(clearTimeline());
      dispatch(setLeaderboardLoading(false));
      dispatch(setRaceLoading(false));
      dispatch(setLeaderboardError(null));
      dispatch(setRaceError(null));
    }
  }, [dispatch, isLiveSession]);

  useEffect(() => {
    if (!isLiveSession) return;

    dispatch(setLeaderboardLoading(liveTimingQuery.isLoading));
    dispatch(setLeaderboardError(liveTimingQuery.error ? 'Unable to load live timing data.' : null));

    if (Array.isArray(liveTimingQuery.data)) {
      dispatch(updateLeaderboard(liveTimingQuery.data as LeaderboardEntry[]));
    }
  }, [dispatch, isLiveSession, liveTimingQuery.data, liveTimingQuery.error, liveTimingQuery.isLoading]);

  useEffect(() => {
    if (!isLiveSession) return;

    dispatch(setRaceLoading(raceControlQuery.isLoading || pitStopsQuery.isLoading));
    dispatch(
      setRaceError(
        raceControlQuery.error || pitStopsQuery.error
          ? 'Unable to load complete race timeline data.'
          : null
      )
    );
  }, [dispatch, isLiveSession, raceControlQuery.error, raceControlQuery.isLoading, pitStopsQuery.error, pitStopsQuery.isLoading]);

  useEffect(() => {
    if (isLiveSession && Array.isArray(driversQuery.data)) {
      dispatch(updateDrivers(normalizeDrivers(driversQuery.data)));
    }
  }, [dispatch, driversQuery.data, isLiveSession]);

  useEffect(() => {
    if (isLiveSession && sessionKey && Array.isArray(raceControlQuery.data)) {
      dispatch(updateRaceControl(normalizeRaceControl(raceControlQuery.data, sessionKey)));
    }
  }, [dispatch, isLiveSession, raceControlQuery.data, sessionKey]);

  useEffect(() => {
    if (isLiveSession && sessionKey && Array.isArray(pitStopsQuery.data)) {
      dispatch(updatePitStops(normalizePitStops(pitStopsQuery.data, sessionKey)));
    }
  }, [dispatch, isLiveSession, pitStopsQuery.data, sessionKey]);

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
            <span>Polling: {isLiveSession && pollingInterval > 0 ? `${pollingInterval}ms` : 'paused'}</span>
            {isLiveSession && <FreshnessIndicator lastUpdate={liveTimingQuery.fulfilledTimeStamp || Date.now()} />}
          </div>
        </div>

        {sessionsError ? (
          <section className="race-center-idle race-center-idle--error" aria-live="polite">
            <div className="race-center-idle__eyebrow">Connection issue</div>
            <h2 className="race-center-idle__title">Unable to discover OpenF1 sessions</h2>
            <p className="race-center-idle__copy">
              The Race Center is still available, but live session discovery failed. This may be a temporary public API limit.
            </p>
            <div className="race-center-idle__actions">
              <button type="button" className="race-center-idle__button" onClick={refetchSessions}>
                Retry session lookup
              </button>
            </div>
          </section>
        ) : !isLiveSession ? (
          <RaceCenterIdleState
            session={activeSession}
            status={sessionStatus === 'upcoming' ? 'upcoming' : 'ended'}
            onRefresh={refetchSessions}
          />
        ) : (
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
        )}
      </div>
    </RealtimeErrorBoundary>
  );
};

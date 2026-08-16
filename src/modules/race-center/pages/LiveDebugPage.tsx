/**
 * Live Debug Page — TASK 7 Testing
 *
 * CRITICAL: This is for testing ONLY. Do not use in production.
 *
 * Monitors:
 * - Session status
 * - Polling interval
 * - Last update time
 * - API latency
 * - Driver count
 * - Error count
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useGetSessionsQuery, useGetLiveTimingQuery } from '../../../store/services/openF1Service';
import {
  findActiveSession,
  getSessionStatus,
  getPollingInterval,
  getSessionName,
} from '../../../utils/race/sessionDiscovery';
import { Badge } from '@/components/atoms/badge';
import './LiveDebugPage.scss';

export const LiveDebugPage: React.FC = () => {
  // Metrics tracking
  const [errorCount, setErrorCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [startTime] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  // Session discovery
  const { data: sessionsData } = useGetSessionsQuery({});

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

  // Get polling interval. Avoid polling completed historical sessions; this
  // prevents public OpenF1 rate-limit errors during local debugging.
  const pollingInterval = useMemo(() => {
    if (sessionStatus !== 'live') {
      return 0;
    }

    const sessionType =
      (activeSession?.session_type as 'race' | 'qualifying' | 'practice' | 'ended' | 'none') ||
      'none';

    return Math.max(getPollingInterval(sessionType, document.visibilityState === 'visible'), 10000);
  }, [activeSession, sessionStatus]);

  // Live timing query
  const { isLoading, isFetching, error, data } = useGetLiveTimingQuery(
    activeSession?.session_key ?? 0,
    {
      pollingInterval,
      skip: !activeSession?.session_key || sessionStatus !== 'live',
    }
  );

  // Track metrics. Counting query lifecycle events is exactly the
  // "subscribe to an external system" case the rule carves out, but it can't
  // see through RTK Query's flags — so it's suppressed deliberately here.
  useEffect(() => {
    if (isFetching) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequestCount((prev) => prev + 1);
      const latency = Date.now() - startTime;
      setLatencies((prev) => [...prev.slice(-99), latency]); // Keep last 100
    }

    if (error) {
      setErrorCount((prev) => prev + 1);
    }
  }, [isFetching, error, startTime]);

  // Calculate averages
  const avgLatency = useMemo(() => {
    if (latencies.length === 0) return 0;
    return Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  }, [latencies]);

  // Calculate uptime from a ticking clock rather than reading Date.now()
  // during render (which is impure and made the value unstable).
  const uptime = useMemo(() => {
    const seconds = Math.max(0, Math.floor((now - startTime) / 1000));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }, [startTime, now]);

  // Drive the uptime display.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Render status badge
  const renderStatusBadge = () => {
    const statusConfig: Record<
      string,
      { color: 'green' | 'yellow' | 'slate' | 'red'; label: string }
    > = {
      live: { color: 'green', label: 'LIVE' },
      upcoming: { color: 'yellow', label: 'UPCOMING' },
      ended: { color: 'slate', label: 'ENDED' },
      none: { color: 'red', label: 'NO SESSION' },
    };

    const status = sessionStatus as keyof typeof statusConfig;
    const config = statusConfig[status] || statusConfig.none;

    return (
      <Badge variant={config.color} className="debug-page__status">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="live-debug-page">
      <div className="live-debug-page__header">
        <h1 className="live-debug-page__title">🔧 Live Debug Page</h1>
        <p className="live-debug-page__subtitle">TASK 7 — Phase A Testing</p>
        {renderStatusBadge()}
      </div>

      <div className="live-debug-page__metrics">
        {/* Session Info */}
        <div className="live-debug-page__card">
          <h2 className="live-debug-page__card-title">Session Info</h2>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Session:</span>
            <span className="live-debug-page__metric-value">
              {activeSession ? getSessionName(activeSession) : 'None'}
            </span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Status:</span>
            <span className="live-debug-page__metric-value">{sessionStatus}</span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Session Key:</span>
            <span className="live-debug-page__metric-value">
              {activeSession?.session_key ?? 'N/A'}
            </span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Polling:</span>
            <span className="live-debug-page__metric-value">{pollingInterval}ms</span>
          </div>
        </div>

        {/* Request Metrics */}
        <div className="live-debug-page__card">
          <h2 className="live-debug-page__card-title">Request Metrics</h2>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Uptime:</span>
            <span className="live-debug-page__metric-value">{uptime}</span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Requests:</span>
            <span className="live-debug-page__metric-value">{requestCount}</span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Avg Latency:</span>
            <span className="live-debug-page__metric-value">{avgLatency}ms</span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Errors:</span>
            <span className="live-debug-page__metric-value live-debug-page__error">
              {errorCount}
            </span>
          </div>
        </div>

        {/* Data Status */}
        <div className="live-debug-page__card">
          <h2 className="live-debug-page__card-title">Data Status</h2>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Loading:</span>
            <span className="live-debug-page__metric-value">{isLoading ? 'Yes' : 'No'}</span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Fetching:</span>
            <span className="live-debug-page__metric-value">{isFetching ? 'Yes' : 'No'}</span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Drivers:</span>
            <span className="live-debug-page__metric-value">
              {Array.isArray(data) ? data.length : 0}
            </span>
          </div>
          <div className="live-debug-page__metric">
            <span className="live-debug-page__metric-label">Has Error:</span>
            <span className="live-debug-page__metric-value live-debug-page__error">
              {error ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Test Controls */}
        <div className="live-debug-page__card">
          <h2 className="live-debug-page__card-title">Test Checklist</h2>
          <div className="live-debug-page__checklist">
            <div className="live-debug-page__checklist-item">
              <input type="checkbox" id="check1" />
              <label htmlFor="check1">Session discovery working</label>
            </div>
            <div className="live-debug-page__checklist-item">
              <input type="checkbox" id="check2" />
              <label htmlFor="check2">Polling active</label>
            </div>
            <div className="live-debug-page__checklist-item">
              <input type="checkbox" id="check3" />
              <label htmlFor="check3">No duplicate polling</label>
            </div>
            <div className="live-debug-page__checklist-item">
              <input type="checkbox" id="check4" />
              <label htmlFor="check4">No crashes</label>
            </div>
            <div className="live-debug-page__checklist-item">
              <input type="checkbox" id="check5" />
              <label htmlFor="check5">Stable for 30 min</label>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="live-debug-page__error-banner">
          <h3>⚠️ Error Detected</h3>
          <pre>{String(error)}</pre>
        </div>
      )}
    </div>
  );
};

export default LiveDebugPage;

/**
 * Freshness Indicator Component
 * 
 * Shows data freshness state (live/stale/delayed/offline).
 * 
 * CRITICAL: Users should know when data is stale.
 */

import React from 'react';
import { Badge } from '../../shared/components/atoms/badge';
import './FreshnessIndicator.scss';

export type FreshnessState = 'live' | 'stale' | 'delayed' | 'offline';

interface FreshnessIndicatorProps {
  lastUpdate: number | null;
}

export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({ lastUpdate }) => {
  const freshness = calculateFreshness(lastUpdate);

  const config = {
    live: { color: 'green' as const, label: 'LIVE', pulse: true },
    stale: { color: 'yellow' as const, label: 'STALE', pulse: false },
    delayed: { color: 'red' as const, label: 'DELAYED', pulse: false },
    offline: { color: 'slate' as const, label: 'OFFLINE', pulse: false },
  };

  const currentConfig = config[freshness];

  return (
    <div className="freshness-indicator">
      <Badge 
        variant={currentConfig.color} 
        className={currentConfig.pulse ? 'freshness-indicator__pulse' : ''}
      >
        {currentConfig.label}
      </Badge>
      {lastUpdate && (
        <span className="freshness-indicator__time">
          {formatLastUpdate(lastUpdate)}
        </span>
      )}
    </div>
  );
};

/**
 * Calculate freshness based on last update time.
 */
function calculateFreshness(lastUpdate: number | null): FreshnessState {
  if (!lastUpdate) {
    return 'offline';
  }

  const diff = Date.now() - lastUpdate;

  if (diff < 5000) {
    return 'live';
  }

  if (diff < 10000) {
    return 'stale';
  }

  if (diff < 30000) {
    return 'delayed';
  }

  return 'offline';
}

/**
 * Format last update time for display.
 */
function formatLastUpdate(lastUpdate: number): string {
  const diff = Date.now() - lastUpdate;
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

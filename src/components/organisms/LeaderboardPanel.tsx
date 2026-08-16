/**
 * Leaderboard Panel Component
 * 
 * Main leaderboard display showing Top 10 drivers.
 * 
 * Features:
 * - Live position updates
 * - Position change indicators
 * - Gap to leader
 * - Tire strategies
 * - Pit status
 * - DRS status
 * - Loading/empty states
 * - Mobile responsive
 */

import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { LeaderboardEntry } from '../molecules/LeaderboardEntry';
import { Skeleton } from '@/components/atoms/skeleton';
import './LeaderboardPanel.scss';

export const LeaderboardPanel: React.FC = () => {
  const { entries, isLoading, hasError, sessionStatus, lastUpdate } = useAppSelector((state) => state.leaderboard
  );
  
  // Show only Top 10
  const top10 = entries.slice(0, 10);
  
  if (isLoading) {
    return (
      <div className="leaderboard-panel">
        <div className="leaderboard-panel__header">
          <h2 className="leaderboard-panel__title">Live Standings</h2>
        </div>
        <div className="leaderboard-panel__loading">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="leaderboard-panel__skeleton" />
          ))}
        </div>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="leaderboard-panel">
        <div className="leaderboard-panel__header">
          <h2 className="leaderboard-panel__title">Live Standings</h2>
        </div>
        <div className="leaderboard-panel__error">
          <p>Unable to load standings. Please try again.</p>
        </div>
      </div>
    );
  }
  
  if (top10.length === 0) {
    return (
      <div className="leaderboard-panel">
        <div className="leaderboard-panel__header">
          <h2 className="leaderboard-panel__title">Live Standings</h2>
        </div>
        <div className="leaderboard-panel__empty">
          <p>No standings data available yet.</p>
          {sessionStatus === 'scheduled' && (
            <p className="leaderboard-panel__empty-hint">Session hasn't started yet.</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="leaderboard-panel">
      <div className="leaderboard-panel__header">
        <h2 className="leaderboard-panel__title">Live Standings</h2>
        <div className="leaderboard-panel__legend">
          <div className="leaderboard-panel__legend-item">
            <span className="leaderboard-panel__legend-dot leaderboard-panel__legend-dot--green"></span>
            <span>Gained</span>
          </div>
          <div className="leaderboard-panel__legend-item">
            <span className="leaderboard-panel__legend-dot leaderboard-panel__legend-dot--red"></span>
            <span>Lost</span>
          </div>
          <div className="leaderboard-panel__legend-item">
            <span className="leaderboard-panel__legend-dot leaderboard-panel__legend-dot--gray"></span>
            <span>Same</span>
          </div>
        </div>
      </div>
      
      {/* Header Row */}
      <div className="leaderboard-panel__header-row">
        <div className="leaderboard-panel__col-position">Pos</div>
        <div className="leaderboard-panel__col-driver">Driver</div>
        <div className="leaderboard-panel__col-gap">Gap</div>
        <div className="leaderboard-panel__col-interval">Interval</div>
        <div className="leaderboard-panel__col-tire">Tire</div>
        <div className="leaderboard-panel__col-pit">Pit</div>
        <div className="leaderboard-panel__col-drs">DRS</div>
      </div>
      
      {/* Entries */}
      <div className="leaderboard-panel__entries">
        {top10.map((entry, index) => (
          <LeaderboardEntry key={entry.driver.id} entry={entry} rank={index + 1} />
        ))}
      </div>
      
      {/* Last Update */}
      <div className="leaderboard-panel__footer">
        <span className="leaderboard-panel__last-update">
          Last update: {new Date(lastUpdate || Date.now()).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

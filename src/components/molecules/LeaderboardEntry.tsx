/**
 * Leaderboard Entry Component
 * 
 * Displays a single driver's position and race status.
 * 
 * Features:
 * - Position with change indicator
 * - Driver name and team
 * - Gap to leader
 * - Interval to car ahead
 * - Tire compound and age
 * - Pit status indicator
 * - DRS status
 * - Hover effects
 */

import React from 'react';
import { PositionIndicator } from '../atoms/PositionIndicator';
import { TireCompound } from '../atoms/TireCompound';
import type { LeaderboardEntry as LeaderboardEntryType } from '../../types/leaderboard.types';
import './LeaderboardEntry.scss';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  rank: number;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ entry, rank }) => {
  const isPodium = rank <= 3;
  const isPitting = entry.pitStatus === 'PITTING' || entry.pitStatus === 'IN_PIT';
  
  return (
    <div className={`leaderboard-entry ${isPodium ? 'leaderboard-entry--podium' : ''} ${isPitting ? 'leaderboard-entry--pitting' : ''}`}>
      {/* Position */}
      <div className="leaderboard-entry__position">
        <span className="leaderboard-entry__number">{entry.position}</span>
        <PositionIndicator current={entry.position} previous={entry.previousPosition} />
      </div>
      
      {/* Driver */}
      <div className="leaderboard-entry__driver">
        <div className="leaderboard-entry__name">
          {entry.driver.lastName}
        </div>
        <div className="leaderboard-entry__team">
          {entry.team}
        </div>
      </div>
      
      {/* Gap to Leader */}
      <div className="leaderboard-entry__gap">
        <span className={`leaderboard-entry__gap-value ${entry.gapToLeader === 'LEADER' ? 'leaderboard-entry__gap-value--leader' : ''}`}>
          {entry.gapToLeader}
        </span>
      </div>
      
      {/* Interval */}
      <div className="leaderboard-entry__interval">
        {entry.interval}
      </div>
      
      {/* Tire */}
      <div className="leaderboard-entry__tire">
        <TireCompound compound={entry.tire.compound} age={entry.tire.age} />
      </div>
      
      {/* Pit Status */}
      {entry.pitStatus !== 'GREEN' && (
        <div className={`leaderboard-entry__pit-status leaderboard-entry__pit-status--${entry.pitStatus.toLowerCase()}`}>
          {entry.pitStatus === 'PITTING' && 'PIT'}
          {entry.pitStatus === 'IN_PIT' && 'IN'}
          {entry.pitStatus === 'JUST_PITTED' && 'OUT'}
        </div>
      )}
      
      {/* DRS */}
      {entry.drsEnabled && (
        <div className="leaderboard-entry__drs" title="DRS Enabled">
          <span className="leaderboard-entry__drs-label">DRS</span>
        </div>
      )}
    </div>
  );
};

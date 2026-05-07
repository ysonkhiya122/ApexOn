import React from 'react';
import { Trophy, Award, Medal, Flag, Target, Zap } from 'lucide-react';
import './driver-stats.scss';

interface DriverStatsProps {
  championships?: number;
  wins?: number;
  podiums?: number;
  polePositions?: number;
  fastestLaps?: number;
  points?: number;
  grandsPrix?: number;
}

export const DriverStats: React.FC<DriverStatsProps> = ({
  championships = 0,
  wins = 0,
  podiums = 0,
  polePositions = 0,
  fastestLaps = 0,
  points = 0,
  grandsPrix = 0,
}) => {
  return (
    <div className="driver-stats">
      <div className="driver-stats__grid">
        <div className="driver-stats__stat">
          <Trophy size={24} className="driver-stats__icon driver-stats__icon--gold" />
          <span className="driver-stats__value">{championships}</span>
          <span className="driver-stats__label">Championships</span>
        </div>
        <div className="driver-stats__stat">
          <Award size={24} className="driver-stats__icon driver-stats__icon--red" />
          <span className="driver-stats__value">{wins}</span>
          <span className="driver-stats__label">Wins</span>
        </div>
        <div className="driver-stats__stat">
          <Medal size={24} className="driver-stats__icon driver-stats__icon--bronze" />
          <span className="driver-stats__value">{podiums}</span>
          <span className="driver-stats__label">Podiums</span>
        </div>
        <div className="driver-stats__stat">
          <Flag size={24} className="driver-stats__icon driver-stats__icon--blue" />
          <span className="driver-stats__value">{polePositions}</span>
          <span className="driver-stats__label">Pole Positions</span>
        </div>
        <div className="driver-stats__stat">
          <Zap size={24} className="driver-stats__icon driver-stats__icon--yellow" />
          <span className="driver-stats__value">{fastestLaps}</span>
          <span className="driver-stats__label">Fastest Laps</span>
        </div>
        <div className="driver-stats__stat">
          <Target size={24} className="driver-stats__icon driver-stats__icon--green" />
          <span className="driver-stats__value">{points}</span>
          <span className="driver-stats__label">Points</span>
        </div>
      </div>
      <div className="driver-stats__footer">
        <span className="driver-stats__races">{grandsPrix} Grands Prix</span>
      </div>
    </div>
  );
};

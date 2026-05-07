import React from 'react';
import { Trophy, Award, Medal, Flag, Target } from 'lucide-react';
import './team-stats.scss';

interface TeamStatsProps {
  championships?: number;
  wins?: number;
  podiums?: number;
  polePositions?: number;
  points?: number;
  seasons?: number;
}

export const TeamStats: React.FC<TeamStatsProps> = ({
  championships = 0,
  wins = 0,
  podiums = 0,
  polePositions = 0,
  points = 0,
  seasons = 0,
}) => {
  return (
    <div className="team-stats">
      <div className="team-stats__grid">
        <div className="team-stats__stat">
          <Trophy size={24} className="team-stats__icon team-stats__icon--gold" />
          <span className="team-stats__value">{championships}</span>
          <span className="team-stats__label">Championships</span>
        </div>
        <div className="team-stats__stat">
          <Award size={24} className="team-stats__icon team-stats__icon--red" />
          <span className="team-stats__value">{wins}</span>
          <span className="team-stats__label">Wins</span>
        </div>
        <div className="team-stats__stat">
          <Medal size={24} className="team-stats__icon team-stats__icon--bronze" />
          <span className="team-stats__value">{podiums}</span>
          <span className="team-stats__label">Podiums</span>
        </div>
        <div className="team-stats__stat">
          <Flag size={24} className="team-stats__icon team-stats__icon--blue" />
          <span className="team-stats__value">{polePositions}</span>
          <span className="team-stats__label">Pole Positions</span>
        </div>
        <div className="team-stats__stat">
          <Target size={24} className="team-stats__icon team-stats__icon--green" />
          <span className="team-stats__value">{points}</span>
          <span className="team-stats__label">Points</span>
        </div>
      </div>
      <div className="team-stats__footer">
        <span className="team-stats__seasons">{seasons} Seasons Competed</span>
      </div>
    </div>
  );
};

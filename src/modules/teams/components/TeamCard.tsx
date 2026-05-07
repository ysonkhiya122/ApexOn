import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, Zap } from 'lucide-react';
import './team-card.scss';

interface TeamCardProps {
  constructorId: string;
  name: string;
  nationality: string;
  championships?: number;
  wins?: number;
  points?: number;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  constructorId,
  name,
  nationality,
  championships = 0,
  wins = 0,
  points = 0,
}) => {
  return (
    <Link to={`/teams/${constructorId}`} className="team-card">
      <div className="team-card__header">
        <div className="team-card__names">
          <h3 className="team-card__name">{name}</h3>
          <p className="team-card__nationality">{nationality}</p>
        </div>
      </div>

      <div className="team-card__stats">
        <div className="team-card__stat">
          <Trophy size={16} className="team-card__stat-icon team-card__stat-icon--gold" />
          <span className="team-card__stat-value">{championships}</span>
          <span className="team-card__stat-label">Titles</span>
        </div>
        <div className="team-card__stat">
          <Award size={16} className="team-card__stat-icon team-card__stat-icon--red" />
          <span className="team-card__stat-value">{wins}</span>
          <span className="team-card__stat-label">Wins</span>
        </div>
        <div className="team-card__stat">
          <Zap size={16} className="team-card__stat-icon team-card__stat-icon--blue" />
          <span className="team-card__stat-value">{points}</span>
          <span className="team-card__stat-label">Points</span>
        </div>
      </div>
    </Link>
  );
};

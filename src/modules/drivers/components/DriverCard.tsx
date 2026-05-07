import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, Medal } from 'lucide-react';
import './driver-card.scss';

interface DriverCardProps {
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
  team?: string;
  championships?: number;
  wins?: number;
  podiums?: number;
  points?: number;
  permanentNumber?: number;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  driverId,
  givenName,
  familyName,
  nationality,
  team,
  championships = 0,
  wins = 0,
  podiums = 0,
  points = 0,
  permanentNumber,
}) => {
  return (
    <Link to={`/drivers/${driverId}`} className="driver-card">
      <div className="driver-card__header">
        {permanentNumber && (
          <div className="driver-card__number">{permanentNumber}</div>
        )}
        <div className="driver-card__names">
          <h3 className="driver-card__name">
            <span className="driver-card__given-name">{givenName}</span>{' '}
            <span className="driver-card__family-name">{familyName}</span>
          </h3>
          <p className="driver-card__nationality">{nationality}</p>
          {team && <p className="driver-card__team">{team}</p>}
        </div>
      </div>

      <div className="driver-card__stats">
        <div className="driver-card__stat">
          <Trophy size={16} className="driver-card__stat-icon driver-card__stat-icon--gold" />
          <span className="driver-card__stat-value">{championships}</span>
          <span className="driver-card__stat-label">Titles</span>
        </div>
        <div className="driver-card__stat">
          <Award size={16} className="driver-card__stat-icon driver-card__stat-icon--red" />
          <span className="driver-card__stat-value">{wins}</span>
          <span className="driver-card__stat-label">Wins</span>
        </div>
        <div className="driver-card__stat">
          <Medal size={16} className="driver-card__stat-icon driver-card__stat-icon--bronze" />
          <span className="driver-card__stat-value">{podiums}</span>
          <span className="driver-card__stat-label">Podiums</span>
        </div>
      </div>

      <div className="driver-card__footer">
        <span className="driver-card__points">{points} PTS</span>
      </div>
    </Link>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Timer, Flag } from 'lucide-react';
import './circuit-card.scss';

interface CircuitCardProps {
  circuitId: string;
  circuitName: string;
  location: {
    locality: string;
    country: string;
  };
  url?: string;
  firstGrandPrix?: number;
  lapRecord?: {
    time: string;
    driver: string;
    year: number;
  };
}

export const CircuitCard: React.FC<CircuitCardProps> = ({
  circuitId,
  circuitName,
  location,
  firstGrandPrix,
  lapRecord,
}) => {
  return (
    <Link to={`/circuits/${circuitId}`} className="circuit-card">
      <div className="circuit-card__header">
        <div className="circuit-card__names">
          <h3 className="circuit-card__name">{circuitName}</h3>
          <p className="circuit-card__location">
            <MapPin size={12} className="circuit-card__icon" />
            {location.locality}, {location.country}
          </p>
        </div>
      </div>

      <div className="circuit-card__stats">
        {firstGrandPrix && (
          <div className="circuit-card__stat">
            <Flag size={16} className="circuit-card__stat-icon" />
            <span className="circuit-card__stat-value">{firstGrandPrix}</span>
            <span className="circuit-card__stat-label">First GP</span>
          </div>
        )}
        {lapRecord && (
          <div className="circuit-card__stat">
            <Timer size={16} className="circuit-card__stat-icon" />
            <span className="circuit-card__stat-value">{lapRecord.time}</span>
            <span className="circuit-card__stat-label">Lap Record</span>
          </div>
        )}
      </div>
    </Link>
  );
};

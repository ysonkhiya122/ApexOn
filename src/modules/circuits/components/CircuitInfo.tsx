import React from 'react';
import { MapPin, Flag, Ruler, Timer } from 'lucide-react';
import './circuit-info.scss';

interface CircuitInfoProps {
  location: {
    locality: string;
    country: string;
  };
  firstGrandPrix?: number;
  laps?: number;
  length?: string;
  lapRecord?: {
    time: string;
    driver: string;
    year: number;
  };
}

export const CircuitInfo: React.FC<CircuitInfoProps> = ({
  location,
  firstGrandPrix,
  laps,
  length,
  lapRecord,
}) => {
  return (
    <div className="circuit-info">
      <h3 className="circuit-info__title">Circuit Information</h3>
      <div className="circuit-info__grid">
        <div className="circuit-info__item">
          <MapPin size={16} className="circuit-info__icon" />
          <span className="circuit-info__label">Location</span>
          <span className="circuit-info__value">
            {location.locality}, {location.country}
          </span>
        </div>
        {firstGrandPrix && (
          <div className="circuit-info__item">
            <Flag size={16} className="circuit-info__icon" />
            <span className="circuit-info__label">First Grand Prix</span>
            <span className="circuit-info__value">{firstGrandPrix}</span>
          </div>
        )}
        {laps && (
          <div className="circuit-info__item">
            <Ruler size={16} className="circuit-info__icon" />
            <span className="circuit-info__label">Number of Laps</span>
            <span className="circuit-info__value">{laps}</span>
          </div>
        )}
        {length && (
          <div className="circuit-info__item">
            <Ruler size={16} className="circuit-info__icon" />
            <span className="circuit-info__label">Circuit Length</span>
            <span className="circuit-info__value">{length}</span>
          </div>
        )}
        {lapRecord && (
          <div className="circuit-info__item circuit-info__item--highlight">
            <Timer size={16} className="circuit-info__icon" />
            <span className="circuit-info__label">Lap Record</span>
            <span className="circuit-info__value">{lapRecord.time}</span>
            <span className="circuit-info__subvalue">
              {lapRecord.driver} ({lapRecord.year})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

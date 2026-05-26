/**
 * Tire Compound Component
 * 
 * Displays tire compound with color coding and age.
 * 
 * Features:
 * - Color-coded by compound (SOFT=Red, MEDIUM=Yellow, HARD=White, etc.)
 * - Tire age in laps
 * - Compact, scannable design
 * - Tooltip for full details
 */

import React from 'react';
import { getTireColor, getTireLabel } from '../../utils/leaderboard/transformLiveTiming';
import type { TireCompound as TireCompoundType } from '../../types/leaderboard.types';
import './TireCompound.scss';

interface TireCompoundProps {
  compound: TireCompoundType;
  age: number;
  showAge?: boolean;
}

export const TireCompound: React.FC<TireCompoundProps> = ({ compound, age, showAge = true }) => {
  const color = getTireColor(compound);
  const label = getTireLabel(compound);
  
  return (
    <div className="tire-compound" title={`${compound} - ${age} laps`}>
      <div 
        className="tire-compound__indicator"
        style={{ backgroundColor: color }}
      >
        <span className="tire-compound__label">{label}</span>
      </div>
      {showAge && (
        <span className="tire-compound__age">{age}</span>
      )}
    </div>
  );
};

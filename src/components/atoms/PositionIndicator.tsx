/**
 * Position Indicator Component
 * 
 * Shows position change with arrow and color coding.
 * 
 * Features:
 * - ↑ Green for gained positions
 * - ↓ Red for lost positions
 * - → Gray for no change
 * - Compact, scannable design
 */

import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import './PositionIndicator.scss';

interface PositionIndicatorProps {
  current: number;
  previous: number;
}

export const PositionIndicator: React.FC<PositionIndicatorProps> = ({ current, previous }) => {
  const change = previous - current; // Positive = gained positions
  
  if (change > 0) {
    return (
      <div className="position-indicator position-indicator--gained">
        <ArrowUp size={14} />
        <span className="position-indicator__value">{change > 99 ? '99+' : change}</span>
      </div>
    );
  }
  
  if (change < 0) {
    return (
      <div className="position-indicator position-indicator--lost">
        <ArrowDown size={14} />
        <span className="position-indicator__value">{Math.abs(change) > 99 ? '99+' : Math.abs(change)}</span>
      </div>
    );
  }
  
  return (
    <div className="position-indicator position-indicator--same">
      <Minus size={14} />
    </div>
  );
};

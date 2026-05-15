/**
 * Race Center Page
 * 
 * Main live race viewing experience.
 * 
 * Features:
 * - Timeline feed (core product)
 * - Live leaderboard
 * - Race control feed
 * - Tire stints
 * - Weather
 * 
 * MVP Scope: Timeline + basic race info
 */

import React from 'react';
import { TimelineFeed } from '../../../components/organisms/TimelineFeed';
import './race-center.scss';

export const RaceCenterPage: React.FC = () => {
  return (
    <div className="race-center-page">
      <div className="race-center-page__header">
        <h1 className="race-center-page__title">Live Race Center</h1>
        <p className="race-center-page__subtitle">
          The easiest way to understand what is happening in an F1 race
        </p>
      </div>
      
      <div className="race-center-page__content">
        {/* Timeline Feed - CORE PRODUCT */}
        <div className="race-center-page__timeline">
          <h2 className="race-center-page__section-title">Race Timeline</h2>
          <TimelineFeed />
        </div>
        
        {/* Placeholder for future sections */}
        <div className="race-center-page__sidebar">
          <div className="race-center-placeholder">
            <h3>Leaderboard</h3>
            <p>Coming soon...</p>
          </div>
          
          <div className="race-center-placeholder">
            <h3>Race Control</h3>
            <p>Coming soon...</p>
          </div>
          
          <div className="race-center-placeholder">
            <h3>Tire Stints</h3>
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

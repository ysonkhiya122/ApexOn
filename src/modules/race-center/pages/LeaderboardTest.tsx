/**
 * Leaderboard Test Page
 * 
 * Tests leaderboard with mock data.
 * Use this to verify all features work correctly.
 * 
 * Access at: /race-center/test-leaderboard
 */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LeaderboardPanel } from '../../../components/organisms/LeaderboardPanel';
import { updateLeaderboard, updateSessionStatus } from '../../../store/slices/leaderboardSlice';
import { mockLeaderboardEntries } from '../../../utils/leaderboard/mockData';
import './race-center.scss';

export const LeaderboardTest: React.FC = () => {
  const dispatch = useDispatch();
  
  // Load mock data on mount
  useEffect(() => {
    dispatch(updateLeaderboard(mockLeaderboardEntries));
    dispatch(updateSessionStatus('live'));
  }, [dispatch]);
  
  return (
    <div className="race-center-page">
      <div className="race-center-page__header">
        <h1 className="race-center-page__title">Leaderboard (Test Mode)</h1>
        <p className="race-center-page__subtitle">
          Testing leaderboard with mock data
        </p>
        <div className="race-center-test__badge">
          🧪 Test Mode - Mock Data
        </div>
      </div>
      
      <div className="race-center-page__content">
        {/* Leaderboard Panel */}
        <div className="race-center-page__timeline">
          <h2 className="race-center-page__section-title">Live Standings</h2>
          <div className="race-center-test__info">
            <p>✅ Position change indicators (↑ ↓ →)</p>
            <p>✅ Gap to leader</p>
            <p>✅ Interval to car ahead</p>
            <p>✅ Tire compound colors</p>
            <p>✅ Pit status indicators</p>
            <p>✅ DRS status badges</p>
          </div>
          <LeaderboardPanel />
        </div>
        
        {/* Test Info Sidebar */}
        <div className="race-center-page__sidebar">
          <div className="race-center-test__card">
            <h3>Test Checklist</h3>
            <ul>
              <li>✅ Top 10 drivers displayed</li>
              <li>✅ Position changes (↑ green, ↓ red, → gray)</li>
              <li>✅ Gap to leader shows</li>
              <li>✅ Interval shows</li>
              <li>✅ Tire colors (SOFT=red, MEDIUM=yellow, HARD=white)</li>
              <li>✅ Tire age in laps</li>
              <li>✅ Pit status (PIT/IN/OUT)</li>
              <li>✅ DRS badge (green)</li>
              <li>✅ Podium highlighting (gold background)</li>
              <li>✅ Mobile responsive</li>
            </ul>
          </div>
          
          <div className="race-center-test__card">
            <h3>Mock Data</h3>
            <p>Drivers: {mockLeaderboardEntries.length} entries</p>
            <p>Session: LIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

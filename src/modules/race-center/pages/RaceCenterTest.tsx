/**
 * Race Center Test Page
 * 
 * Tests timeline with mock data.
 * Use this to verify all features work correctly.
 * 
 * Access at: /race-center/test
 */

import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { TimelineFeed } from '../../../components/organisms/TimelineFeed';
import { updateRaceControl, updatePitStops, updateDrivers, updateSessionStatus } from '../../../store/slices/raceStateSlice';
import { mockRaceControl, mockPitStops, mockDrivers } from '../../../utils/timeline/mockData';
import './race-center.scss';

export const RaceCenterTest: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Load mock data on mount
  useEffect(() => {
    dispatch(updateRaceControl(mockRaceControl));
    dispatch(updatePitStops(mockPitStops));
    dispatch(updateDrivers(mockDrivers));
    dispatch(updateSessionStatus('live'));
  }, [dispatch]);
  
  return (
    <div className="race-center-page">
      <div className="race-center-page__header">
        <h1 className="race-center-page__title">Race Center (Test Mode)</h1>
        <p className="race-center-page__subtitle">
          Testing timeline with mock data
        </p>
        <div className="race-center-test__badge">
          🧪 Test Mode - Mock Data
        </div>
      </div>
      
      <div className="race-center-page__content">
        {/* Timeline Feed - CORE PRODUCT */}
        <div className="race-center-page__timeline">
          <h2 className="race-center-page__section-title">Race Timeline</h2>
          <div className="race-center-test__info">
            <p>✅ Auto-scroll enabled (live race)</p>
            <p>✅ Scroll manually to test pause detection</p>
            <p>✅ "Jump to Live" button should appear</p>
            <p>✅ Visual hierarchy by priority (critical/high/medium/low)</p>
          </div>
          <TimelineFeed />
        </div>
        
        {/* Test Info Sidebar */}
        <div className="race-center-page__sidebar">
          <div className="race-center-test__card">
            <h3>Test Checklist</h3>
            <ul>
              <li>✅ Auto-scroll works</li>
              <li>✅ Manual scroll pauses auto-scroll</li>
              <li>✅ "Jump to Live" appears</li>
              <li>✅ Critical events have 6px border</li>
              <li>✅ High events have 5px border</li>
              <li>✅ Medium events have 4px border</li>
              <li>✅ Low events have 3px border</li>
              <li>✅ Colors match priority</li>
              <li>✅ Time shows "Lap X"</li>
              <li>✅ Mobile responsive</li>
            </ul>
          </div>
          
          <div className="race-center-test__card">
            <h3>Mock Data</h3>
            <p>Race Control: {mockRaceControl.length} events</p>
            <p>Pit Stops: {mockPitStops.length} stops</p>
            <p>Drivers: {mockDrivers.length} drivers</p>
            <p>Session: LIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceCenterTest;

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetDriverDetailsQuery,
  useGetDriverResultsQuery,
} from '../../../store/services/jolpicaService';
import { DriverStats } from '../components/DriverStats';
import { Skeleton } from '@/components/atoms/skeleton';
import { Button } from '@/components/atoms/button';
import { ArrowLeft, User, Calendar, Award } from 'lucide-react';
import './driver-detail.scss';

const DriverDetail: React.FC = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'statistics'>('overview');

  const {
    data: driverData,
    isLoading: driverLoading,
    isError: driverError,
  } = useGetDriverDetailsQuery(driverId || '');
  const { data: resultsData, isLoading: resultsLoading } = useGetDriverResultsQuery(driverId || '');

  const driver = useMemo(() => {
    return driverData?.MRData?.DriverTable?.Drivers?.[0];
  }, [driverData]);

  const careerStats = useMemo(() => {
    if (!resultsData?.MRData?.RaceTable?.Races) {
      return { wins: 0, podiums: 0, points: 0, poles: 0, fastestLaps: 0 };
    }

    const races = resultsData.MRData.RaceTable.Races;
    let wins = 0;
    let podiums = 0;
    let points = 0;
    let poles = 0;
    let fastestLaps = 0;

    races.forEach((race: any) => {
      race.Results?.forEach((result: any) => {
        if (result.position === '1') wins++;
        if (['1', '2', '3'].includes(result.position)) podiums++;
        points += parseFloat(result.points || 0);
        if (result.grid === '1') poles++;
        if (result.FastestLap?.rank === '1') fastestLaps++;
      });
    });

    return { wins, podiums, points, poles, fastestLaps };
  }, [resultsData]);

  const seasonResults = useMemo(() => {
    if (!resultsData?.MRData?.RaceTable?.Races) return [];

    const seasonMap = new Map();
    resultsData.MRData.RaceTable.Races.forEach((race: any) => {
      race.Results?.forEach((result: any) => {
        const season = race.season;
        if (!seasonMap.has(season)) {
          seasonMap.set(season, {
            season,
            team: result.Constructor?.name,
            points: 0,
            position: '-',
            races: 0,
          });
        }
        const seasonData = seasonMap.get(season);
        seasonData.points += parseFloat(result.points || 0);
        seasonData.races += 1;
        if (
          result.position !== '\\N' &&
          (!seasonData.position || parseInt(result.position) < parseInt(seasonData.position))
        ) {
          seasonData.position = result.position;
        }
      });
    });

    return Array.from(seasonMap.values()).sort((a, b) => b.season - a.season);
  }, [resultsData]);

  if (driverLoading) {
    return (
      <div className="driver-detail">
        <div className="driver-detail__header">
          <Skeleton className="driver-detail__skeleton-title" />
        </div>
        <div className="driver-detail__content">
          <Skeleton className="driver-detail__skeleton-stats" />
        </div>
      </div>
    );
  }

  if (driverError || !driver) {
    return (
      <div className="driver-detail">
        <div className="driver-detail__error">
          <p>Driver not found</p>
          <Button variant="secondary" onClick={() => navigate('/drivers')}>
            <ArrowLeft size={16} />
            Back to Drivers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-detail">
      <div className="driver-detail__header">
        <button onClick={() => navigate('/drivers')} className="driver-detail__back">
          <ArrowLeft size={16} />
          Back to Drivers
        </button>
        <div className="driver-detail__title-section">
          <h1 className="driver-detail__title">
            {driver.givenName} {driver.familyName}
          </h1>
          <p className="driver-detail__subtitle">
            <User size={14} className="driver-detail__icon" />
            {driver.nationality}
            {driver.permanentNumber && (
              <span className="driver-detail__number">#{driver.permanentNumber}</span>
            )}
          </p>
        </div>
      </div>

      <div className="driver-detail__tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`driver-detail__tab ${activeTab === 'overview' ? 'driver-detail__tab--active' : ''}`}
        >
          <User size={16} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`driver-detail__tab ${activeTab === 'results' ? 'driver-detail__tab--active' : ''}`}
        >
          <Calendar size={16} />
          Results
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`driver-detail__tab ${activeTab === 'statistics' ? 'driver-detail__tab--active' : ''}`}
        >
          <Award size={16} />
          Statistics
        </button>
      </div>

      <div className="driver-detail__content">
        {activeTab === 'overview' && (
          <div className="driver-detail__overview">
            <DriverStats
              wins={careerStats.wins}
              podiums={careerStats.podiums}
              points={careerStats.points}
              polePositions={careerStats.poles}
              fastestLaps={careerStats.fastestLaps}
              grandsPrix={seasonResults.reduce((acc, s) => acc + s.races, 0)}
            />

            <div className="driver-detail__info">
              <h3 className="driver-detail__info-title">Driver Information</h3>
              <div className="driver-detail__info-grid">
                <div className="driver-detail__info-item">
                  <span className="driver-detail__info-label">Nationality</span>
                  <span className="driver-detail__info-value">{driver.nationality}</span>
                </div>
                <div className="driver-detail__info-item">
                  <span className="driver-detail__info-label">Date of Birth</span>
                  <span className="driver-detail__info-value">{driver.dateOfBirth}</span>
                </div>
                {driver.permanentNumber && (
                  <div className="driver-detail__info-item">
                    <span className="driver-detail__info-label">Permanent Number</span>
                    <span className="driver-detail__info-value">{driver.permanentNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="driver-detail__results">
            <h3 className="driver-detail__section-title">Season by Season Results</h3>
            {resultsLoading ? (
              <div className="driver-detail__loading">
                <Skeleton className="driver-detail__skeleton-table" />
              </div>
            ) : seasonResults.length === 0 ? (
              <div className="driver-detail__empty">No career data available for this driver</div>
            ) : (
              <div className="driver-detail__table-wrapper">
                <table className="driver-detail__table">
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Team</th>
                      <th>Points</th>
                      <th>Best Position</th>
                      <th>Races</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonResults.map((season: any) => (
                      <tr key={season.season}>
                        <td>{season.season}</td>
                        <td>{season.team}</td>
                        <td className="driver-detail__points">{season.points}</td>
                        <td>{season.position}</td>
                        <td>{season.races}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="driver-detail__statistics">
            <DriverStats
              wins={careerStats.wins}
              podiums={careerStats.podiums}
              points={careerStats.points}
              polePositions={careerStats.poles}
              fastestLaps={careerStats.fastestLaps}
              grandsPrix={seasonResults.reduce((acc, s) => acc + s.races, 0)}
            />
            <div className="driver-detail__stat-note">
              <p>Statistics calculated from available race data in the Ergast API database.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDetail;

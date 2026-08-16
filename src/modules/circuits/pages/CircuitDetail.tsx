import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCircuitResultsQuery } from '../../../store/services/jolpicaService';
import { CircuitInfo } from '../components/CircuitInfo';
import { Skeleton } from '@/components/atoms/skeleton';
import { Button } from '@/components/atoms/button';
import { ArrowLeft, MapPin, Trophy, Timer } from 'lucide-react';
import './circuit-detail.scss';

export const CircuitDetail: React.FC = () => {
  const { circuitId } = useParams<{ circuitId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'records'>('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const racesPerPage = 10;

  const { data: resultsData, isLoading, isError } = useGetCircuitResultsQuery(circuitId || '');

  const circuitInfo = useMemo(() => {
    return resultsData?.MRData?.CircuitTable?.Circuits?.[0];
  }, [resultsData]);

  const raceHistory = useMemo(() => {
    if (!resultsData?.MRData?.RaceTable?.Races) return [];
    return resultsData.MRData.RaceTable.Races;
  }, [resultsData]);

  // Pagination
  const totalPages = Math.ceil(raceHistory.length / racesPerPage);
  const paginatedRaces = raceHistory.slice(
    (currentPage - 1) * racesPerPage,
    currentPage * racesPerPage
  );

  // Calculate most wins at this circuit
  const driverWins = useMemo(() => {
    const winsMap = new Map<string, number>();
    raceHistory.forEach((race: any) => {
      const winnerId = race.Results?.[0]?.Driver?.driverId;
      if (!winnerId) return;
      winsMap.set(winnerId, (winsMap.get(winnerId) ?? 0) + 1);
    });
    return Array.from(winsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [raceHistory]);

  if (isLoading) {
    return (
      <div className="circuit-detail">
        <div className="circuit-detail__header">
          <Skeleton className="circuit-detail__skeleton-title" />
        </div>
        <div className="circuit-detail__content">
          <Skeleton className="circuit-detail__skeleton-info" />
        </div>
      </div>
    );
  }

  if (isError || !circuitInfo) {
    return (
      <div className="circuit-detail">
        <div className="circuit-detail__error">
          <p>Circuit not found</p>
          <Button variant="secondary" onClick={() => navigate('/circuits')}>
            <ArrowLeft size={16} />
            Back to Circuits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="circuit-detail">
      <div className="circuit-detail__header">
        <button onClick={() => navigate('/circuits')} className="circuit-detail__back">
          <ArrowLeft size={16} />
          Back to Circuits
        </button>
        <div className="circuit-detail__title-section">
          <h1 className="circuit-detail__title">{circuitInfo.circuitName}</h1>
          <p className="circuit-detail__subtitle">
            <MapPin size={14} className="circuit-detail__icon" />
            {circuitInfo.Location?.locality}, {circuitInfo.Location?.country}
          </p>
        </div>
      </div>

      <div className="circuit-detail__tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`circuit-detail__tab ${activeTab === 'overview' ? 'circuit-detail__tab--active' : ''}`}
        >
          <MapPin size={16} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`circuit-detail__tab ${activeTab === 'history' ? 'circuit-detail__tab--active' : ''}`}
        >
          <Trophy size={16} />
          Race History
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`circuit-detail__tab ${activeTab === 'records' ? 'circuit-detail__tab--active' : ''}`}
        >
          <Timer size={16} />
          Records
        </button>
      </div>

      <div className="circuit-detail__content">
        {activeTab === 'overview' && (
          <div className="circuit-detail__overview">
            <CircuitInfo
              location={circuitInfo.Location}
              firstGrandPrix={
                raceHistory.length > 0
                  ? parseInt(raceHistory[raceHistory.length - 1].season, 10)
                  : undefined
              }
              laps={(raceHistory[0] as any)?.laps}
              length={(raceHistory[0]?.Circuit as any)?.Length}
            />

            {raceHistory.length > 0 && (
              <div className="circuit-detail__recent">
                <h3 className="circuit-detail__section-title">Most Recent Race</h3>
                <div className="circuit-detail__recent-card">
                  <div className="circuit-detail__recent-season">{raceHistory[0].season}</div>
                  <div className="circuit-detail__recent-race">{raceHistory[0].raceName}</div>
                  <div className="circuit-detail__recent-winner">
                    Winner: {raceHistory[0].Results?.[0]?.Driver?.givenName}{' '}
                    {raceHistory[0].Results?.[0]?.Driver?.familyName}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="circuit-detail__history">
            <h3 className="circuit-detail__section-title">
              Race History at {circuitInfo.circuitName}
            </h3>
            {raceHistory.length === 0 ? (
              <div className="circuit-detail__empty">
                No race history available for this circuit
              </div>
            ) : (
              <>
                <div className="circuit-detail__table-wrapper">
                  <table className="circuit-detail__table">
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th>Grand Prix</th>
                        <th>Date</th>
                        <th>Winner</th>
                        <th>Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRaces.map((race: any) => (
                        <tr key={`${race.season}-${race.round}`}>
                          <td className="circuit-detail__season">{race.season}</td>
                          <td>{race.raceName}</td>
                          <td>{race.date}</td>
                          <td>
                            {race.Results?.[0]?.Driver?.givenName}{' '}
                            {race.Results?.[0]?.Driver?.familyName}
                          </td>
                          <td>{race.Results?.[0]?.Constructor?.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="circuit-detail__pagination">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="circuit-detail__page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="circuit-detail__records">
            <h3 className="circuit-detail__section-title">Track Records</h3>
            {driverWins.length === 0 ? (
              <div className="circuit-detail__empty">No records available for this circuit</div>
            ) : (
              <div className="circuit-detail__records-grid">
                <div className="circuit-detail__record-card">
                  <Trophy size={24} className="circuit-detail__record-icon" />
                  <h4 className="circuit-detail__record-title">Most Wins at This Circuit</h4>
                  <div className="circuit-detail__record-list">
                    {driverWins.map(([driverId, wins]: [string, number], idx: number) => (
                      <div key={driverId} className="circuit-detail__record-item">
                        <span className="circuit-detail__record-pos">{idx + 1}.</span>
                        <span className="circuit-detail__record-driver">{driverId}</span>
                        <span className="circuit-detail__record-count">{wins} wins</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CircuitDetail;

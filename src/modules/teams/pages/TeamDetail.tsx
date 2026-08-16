import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetConstructorResultsQuery } from '../../../store/services/jolpicaService';
import { TeamStats } from '../components/TeamStats';
import { Skeleton } from '@/components/atoms/skeleton';
import { Button } from '@/components/atoms/button';
import { ArrowLeft, Building2, Trophy, Users } from 'lucide-react';
import './team-detail.scss';

export const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'drivers'>('overview');

  const { data: resultsData, isLoading, isError } = useGetConstructorResultsQuery(teamId || '');

  const constructorInfo = useMemo(() => {
    return resultsData?.MRData?.ConstructorTable?.Constructors?.[0];
  }, [resultsData]);

  const championshipStats = useMemo(() => {
    if (!resultsData?.MRData?.RaceTable?.Races) {
      return { championships: 0, wins: 0, podiums: 0, poles: 0, points: 0, seasons: 0 };
    }

    const races = resultsData.MRData.RaceTable.Races;
    const seasonMap = new Map();
    let wins = 0;
    let podiums = 0;
    let points = 0;
    let poles = 0;

    races.forEach((race: any) => {
      const season = race.season;
      if (!seasonMap.has(season)) {
        seasonMap.set(season, { points: 0, wins: 0 });
      }

      race.Results?.forEach((result: any) => {
        if (result.position === '1') {
          wins++;
          seasonMap.get(season).wins++;
        }
        if (['1', '2', '3'].includes(result.position)) podiums++;
        points += parseFloat(result.points || 0);
        seasonMap.get(season).points += parseFloat(result.points || 0);
        if (result.grid === '1') poles++;
      });
    });

    // Count championships (seasons where they scored significant points)
    const championships = Array.from(seasonMap.values()).filter((s: any) => s.wins > 0).length;

    return {
      championships,
      wins,
      podiums,
      poles,
      points,
      seasons: seasonMap.size,
    };
  }, [resultsData]);

  const seasonHistory = useMemo(() => {
    if (!resultsData?.MRData?.RaceTable?.Races) return [];

    const seasonMap = new Map();
    resultsData.MRData.RaceTable.Races.forEach((race: any) => {
      const season = race.season;
      if (!seasonMap.has(season)) {
        seasonMap.set(season, {
          season,
          points: 0,
          wins: 0,
          races: 0,
          bestPosition: '-',
        });
      }

      const seasonData = seasonMap.get(season);
      race.Results?.forEach((result: any) => {
        seasonData.points += parseFloat(result.points || 0);
        seasonData.races += 1;
        if (result.position === '1') seasonData.wins++;
        if (
          result.position !== '\\N' &&
          (!seasonData.bestPosition ||
            parseInt(result.position) < parseInt(seasonData.bestPosition))
        ) {
          seasonData.bestPosition = result.position;
        }
      });
    });

    return Array.from(seasonMap.values()).sort((a, b) => b.season - a.season);
  }, [resultsData]);

  if (isLoading) {
    return (
      <div className="team-detail">
        <div className="team-detail__header">
          <Skeleton className="team-detail__skeleton-title" />
        </div>
        <div className="team-detail__content">
          <Skeleton className="team-detail__skeleton-stats" />
        </div>
      </div>
    );
  }

  if (isError || !constructorInfo) {
    return (
      <div className="team-detail">
        <div className="team-detail__error">
          <p>Team not found</p>
          <Button variant="secondary" onClick={() => navigate('/teams')}>
            <ArrowLeft size={16} />
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="team-detail">
      <div className="team-detail__header">
        <button onClick={() => navigate('/teams')} className="team-detail__back">
          <ArrowLeft size={16} />
          Back to Teams
        </button>
        <div className="team-detail__title-section">
          <h1 className="team-detail__title">{constructorInfo.name}</h1>
          <p className="team-detail__subtitle">
            <Building2 size={14} className="team-detail__icon" />
            {constructorInfo.nationality}
          </p>
        </div>
      </div>

      <div className="team-detail__tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`team-detail__tab ${activeTab === 'overview' ? 'team-detail__tab--active' : ''}`}
        >
          <Trophy size={16} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`team-detail__tab ${activeTab === 'history' ? 'team-detail__tab--active' : ''}`}
        >
          <Building2 size={16} />
          History
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`team-detail__tab ${activeTab === 'drivers' ? 'team-detail__tab--active' : ''}`}
        >
          <Users size={16} />
          Drivers
        </button>
      </div>

      <div className="team-detail__content">
        {activeTab === 'overview' && (
          <div className="team-detail__overview">
            <TeamStats
              championships={championshipStats.championships}
              wins={championshipStats.wins}
              podiums={championshipStats.podiums}
              polePositions={championshipStats.poles}
              points={championshipStats.points}
              seasons={championshipStats.seasons}
            />

            <div className="team-detail__info">
              <h3 className="team-detail__info-title">Team Information</h3>
              <div className="team-detail__info-grid">
                <div className="team-detail__info-item">
                  <span className="team-detail__info-label">Nationality</span>
                  <span className="team-detail__info-value">{constructorInfo.nationality}</span>
                </div>
                <div className="team-detail__info-item">
                  <span className="team-detail__info-label">Constructor ID</span>
                  <span className="team-detail__info-value">{constructorInfo.constructorId}</span>
                </div>
                {constructorInfo.url && (
                  <div className="team-detail__info-item">
                    <span className="team-detail__info-label">Website</span>
                    <a
                      href={constructorInfo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="team-detail__info-value team-detail__link"
                    >
                      Visit Site →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="team-detail__history">
            <h3 className="team-detail__section-title">Season by Season Performance</h3>
            {seasonHistory.length === 0 ? (
              <div className="team-detail__empty">No championship data available for this team</div>
            ) : (
              <div className="team-detail__table-wrapper">
                <table className="team-detail__table">
                  <thead>
                    <tr>
                      <th>Season</th>
                      <th>Points</th>
                      <th>Wins</th>
                      <th>Best Position</th>
                      <th>Races</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonHistory.map((season: any) => (
                      <tr key={season.season}>
                        <td className="team-detail__season">{season.season}</td>
                        <td className="team-detail__points">{season.points}</td>
                        <td>{season.wins}</td>
                        <td>{season.bestPosition}</td>
                        <td>{season.races}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="team-detail__drivers">
            <h3 className="team-detail__section-title">Notable Drivers</h3>
            <div className="team-detail__drivers-note">
              <p>
                Driver lineup data available through individual driver profiles. This feature is
                under development.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetail;

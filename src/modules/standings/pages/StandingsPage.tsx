import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  useGetDriverStandingsQuery,
  useGetConstructorStandingsQuery,
} from '../../../store/services/jolpicaService';
import { setSelectedSeason, setStandingsType } from '../../../store/slices/standingsSlice';
import { StandingsTable } from '../components/StandingsTable';
import { Skeleton } from '@/components/atoms/skeleton';
import { DropdownFilter } from '@/components/molecules/dropdown-filter';
import { Trophy, Award } from 'lucide-react';
import './standings.scss';

export const StandingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedSeason, standingsType } = useAppSelector((state) => state.standings);

  const {
    data: driverData,
    isLoading: driverLoading,
    isError: driverError,
  } = useGetDriverStandingsQuery(selectedSeason);
  const {
    data: constructorData,
    isLoading: constructorLoading,
    isError: constructorError,
  } = useGetConstructorStandingsQuery(selectedSeason);

  const seasonOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1950 + 2 }, (_, i) => {
      const year = (currentYear + 1 - i).toString();
      return { value: year, label: year };
    });
  }, []);

  const driverStandings = useMemo(() => {
    return driverData || [];
  }, [driverData]);

  const constructorStandings = useMemo(() => {
    return constructorData || [];
  }, [constructorData]);

  const isLoading = standingsType === 'drivers' ? driverLoading : constructorLoading;
  const isError = standingsType === 'drivers' ? driverError : constructorError;
  const standings: any = standingsType === 'drivers' ? driverStandings : constructorStandings;

  if (isLoading) {
    return (
      <div className="standings-page">
        <div className="standings-page__header">
          <h1 className="standings-page__title">Championship Standings</h1>
        </div>
        <div className="standings-page__skeleton">
          <Skeleton className="standings-page__skeleton-table" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="standings-page">
        <div className="standings-page__error">
          <p>Failed to load standings data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="standings-page">
      <div className="standings-page__header">
        <div>
          <h1 className="standings-page__title">Championship Standings</h1>
          <p className="standings-page__subtitle">Track the battle for World Championships</p>
        </div>
      </div>

      <div className="standings-page__controls">
        <DropdownFilter
          label="Season"
          value={selectedSeason}
          options={seasonOptions}
          onChange={(val) => dispatch(setSelectedSeason(val))}
          className="standings-page__select"
        />

        <div className="standings-page__tabs">
          <button
            onClick={() => dispatch(setStandingsType('drivers'))}
            className={`standings-page__tab ${standingsType === 'drivers' ? 'standings-page__tab--active' : ''}`}
          >
            <Trophy size={16} />
            Drivers
          </button>
          <button
            onClick={() => dispatch(setStandingsType('constructors'))}
            className={`standings-page__tab ${standingsType === 'constructors' ? 'standings-page__tab--active' : ''}`}
          >
            <Award size={16} />
            Constructors
          </button>
        </div>
      </div>

      {standings.length === 0 ? (
        <div className="standings-page__empty">
          <p>No standings data available for {selectedSeason}</p>
        </div>
      ) : (
        <StandingsTable type={standingsType} standings={standings} />
      )}
    </div>
  );
};

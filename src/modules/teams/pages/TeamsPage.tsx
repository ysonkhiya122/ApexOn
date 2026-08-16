import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useGetConstructorsQuery } from '../../../store/services/jolpicaService';
import {
  setSearchQuery,
  setNationalityFilter,
  setCurrentPage,
  setSortBy,
  resetFilters,
} from '../../../store/slices/teamsSlice';
import { TeamCard } from '../components/TeamCard';
import { Skeleton } from '@/components/atoms/skeleton';
import { Button } from '@/components/atoms/button';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import './teams.scss';
import { CURRENT_SEASON_TOKEN } from '../../../utils/season';

export const TeamsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    searchQuery,
    selectedNationality,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
  } = useAppSelector((state) => state.teams);

  const { data, isLoading, isError } = useGetConstructorsQuery(CURRENT_SEASON_TOKEN);

  const teams = useMemo(() => {
    if (!data?.MRData?.ConstructorTable?.Constructors) return [];
    return data.MRData.ConstructorTable.Constructors;
  }, [data]);

  const filteredAndSortedTeams = useMemo(() => {
    let result = [...teams];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t: any) =>
          t.name.toLowerCase().includes(query) ||
          t.constructorId.toLowerCase().includes(query)
      );
    }

    // Nationality filter
    if (selectedNationality) {
      result = result.filter((t: any) => t.nationality === selectedNationality);
    }

    // Sort
    result.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [teams, searchQuery, selectedNationality, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTeams.length / itemsPerPage);
  const paginatedTeams = filteredAndSortedTeams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueNationalities = useMemo(() => {
    const nationalities = new Set(teams.map((t: any) => t.nationality));
    return Array.from(nationalities as Set<string>).sort();
  }, [teams]);

  if (isLoading) {
    return (
      <div className="teams-page">
        <div className="teams-page__header">
          <h1 className="teams-page__title">Teams</h1>
        </div>
        <div className="teams-page__grid">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="teams-page__skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="teams-page">
        <div className="teams-page__error">
          <p>Failed to load team data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <div className="teams-page__header">
        <div>
          <h1 className="teams-page__title">Teams</h1>
          <p className="teams-page__subtitle">Browse all Formula 1 constructors across seasons</p>
        </div>
      </div>

      <div className="teams-page__filters">
        <div className="teams-page__search">
          <Search size={18} className="teams-page__search-icon" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="teams-page__search-input"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="teams-page__search-clear"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="teams-page__filter-group">
          <Filter size={16} className="teams-page__filter-icon" />
          <select
            value={selectedNationality}
            onChange={(e) => dispatch(setNationalityFilter(e.target.value))}
            className="teams-page__select"
          >
            <option value="">All Nationalities</option>
            {uniqueNationalities.map((nat: string) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
          </select>
        </div>

        <div className="teams-page__filter-group">
          <ArrowUpDown size={16} className="teams-page__filter-icon" />
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as any))}
            className="teams-page__select"
          >
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {(searchQuery || selectedNationality) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(resetFilters())}
            className="teams-page__reset"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {paginatedTeams.length === 0 ? (
        <div className="teams-page__empty">
          <p>No teams found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className="teams-page__grid">
            {paginatedTeams.map((team: any) => (
              <TeamCard
                key={team.constructorId}
                constructorId={team.constructorId}
                name={team.name}
                nationality={team.nationality}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="teams-page__pagination">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              >
                Previous
              </Button>
              <span className="teams-page__page-info">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamsPage;

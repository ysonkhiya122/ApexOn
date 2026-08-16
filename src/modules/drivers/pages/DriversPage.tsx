import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useGetDriversQuery } from '../../../store/services/jolpicaService';
import {
  setSearchQuery,
  setNationalityFilter,
  setCurrentPage,
  setSortBy,
  resetFilters,
} from '../../../store/slices/driversSlice';
import type { Driver } from '@/services/api/types/normalized.types';
import { DriverCard } from '../components/DriverCard';
import { Skeleton } from '@/components/atoms/skeleton';
import { Button } from '@/components/atoms/button';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import './drivers.scss';
import { CURRENT_SEASON_TOKEN } from '../../../utils/season';

export const DriversPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    searchQuery,
    selectedNationality,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
  } = useAppSelector((state) => state.drivers);

  const { data: drivers = [], isLoading, isError } = useGetDriversQuery(CURRENT_SEASON_TOKEN);

  const filteredAndSortedDrivers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const result = drivers.filter((driver) => {
      const matchesSearch =
        !normalizedQuery ||
        driver.fullName.toLowerCase().includes(normalizedQuery) ||
        driver.firstName.toLowerCase().includes(normalizedQuery) ||
        driver.lastName.toLowerCase().includes(normalizedQuery) ||
        driver.code.toLowerCase().includes(normalizedQuery);

      const matchesNationality = !selectedNationality || driver.nationality === selectedNationality;

      return matchesSearch && matchesNationality;
    });

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [drivers, searchQuery, selectedNationality, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredAndSortedDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueNationalities = useMemo(() => {
    const nationalities = new Set(drivers.map((driver) => driver.nationality).filter(Boolean));
    return Array.from(nationalities).sort();
  }, [drivers]);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
    dispatch(setCurrentPage(1));
  };

  const handleNationalityChange = (value: string) => {
    dispatch(setNationalityFilter(value));
    dispatch(setCurrentPage(1));
  };

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value as 'name'));
    dispatch(setCurrentPage(1));
  };

  const renderDriverCard = (driver: Driver) => (
    <DriverCard
      key={driver.id}
      driverId={driver.id}
      givenName={driver.firstName}
      familyName={driver.lastName}
      nationality={driver.nationality}
      permanentNumber={driver.number || undefined}
    />
  );

  if (isLoading) {
    return (
      <div className="drivers-page">
        <div className="drivers-page__header">
          <h1 className="drivers-page__title">Drivers</h1>
        </div>
        <div className="drivers-page__grid">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="drivers-page__skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="drivers-page">
        <div className="drivers-page__error">
          <p>Failed to load driver data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drivers-page">
      <div className="drivers-page__header">
        <div>
          <h1 className="drivers-page__title">Drivers</h1>
          <p className="drivers-page__subtitle">Browse all Formula 1 drivers across seasons</p>
        </div>
      </div>

      <div className="drivers-page__filters">
        <div className="drivers-page__search">
          <Search size={18} className="drivers-page__search-icon" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="drivers-page__search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="drivers-page__search-clear"
              aria-label="Clear driver search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="drivers-page__filter-group">
          <Filter size={16} className="drivers-page__filter-icon" />
          <select
            value={selectedNationality}
            onChange={(e) => handleNationalityChange(e.target.value)}
            className="drivers-page__select"
            aria-label="Filter drivers by nationality"
          >
            <option value="">All Nationalities</option>
            {uniqueNationalities.map((nationality) => (
              <option key={nationality} value={nationality}>
                {nationality}
              </option>
            ))}
          </select>
        </div>

        <div className="drivers-page__filter-group">
          <ArrowUpDown size={16} className="drivers-page__filter-icon" />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="drivers-page__select"
            aria-label="Sort drivers"
          >
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {(searchQuery || selectedNationality) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(resetFilters())}
            className="drivers-page__reset"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {paginatedDrivers.length === 0 ? (
        <div className="drivers-page__empty">
          <p>No drivers found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className="drivers-page__grid">{paginatedDrivers.map(renderDriverCard)}</div>

          {totalPages > 1 && (
            <div className="drivers-page__pagination">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              >
                Previous
              </Button>
              <span className="drivers-page__page-info">
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

export default DriversPage;

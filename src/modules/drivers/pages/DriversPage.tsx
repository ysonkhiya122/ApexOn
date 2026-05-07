import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useGetDriversQuery } from '../../../store/services/jolpicaService';
import {
  setSearchQuery,
  setNationalityFilter,
  setCurrentPage,
  setSortBy,
  resetFilters,
} from '../../../store/slices/driversSlice';
import { DriverCard } from '../components/DriverCard';
import { Skeleton } from '../../../shared/components/atoms/skeleton';
import { Button } from '../../../shared/components/atoms/button';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import './drivers.scss';

export const DriversPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    searchQuery,
    selectedNationality,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
  } = useSelector((state: RootState) => state.drivers);

  const { data, isLoading, isError } = useGetDriversQuery('2024');

  const drivers = useMemo(() => {
    if (!data?.MRData?.DriverTable?.Drivers) return [];
    return data.MRData.DriverTable.Drivers;
  }, [data]);

  const filteredAndSortedDrivers = useMemo(() => {
    let result = [...drivers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d: any) =>
          d.givenName.toLowerCase().includes(query) ||
          d.familyName.toLowerCase().includes(query) ||
          d.code?.toLowerCase().includes(query)
      );
    }

    // Nationality filter
    if (selectedNationality) {
      result = result.filter((d: any) => d.nationality === selectedNationality);
    }

    // Sort
    result.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.familyName.localeCompare(b.familyName);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [drivers, searchQuery, selectedNationality, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredAndSortedDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueNationalities = useMemo(() => {
    const nationalities = new Set(drivers.map((d: any) => d.nationality));
    return Array.from(nationalities as Set<string>).sort();
  }, [drivers]);

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
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="drivers-page__search-input"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="drivers-page__search-clear"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="drivers-page__filter-group">
          <Filter size={16} className="drivers-page__filter-icon" />
          <select
            value={selectedNationality}
            onChange={(e) => dispatch(setNationalityFilter(e.target.value))}
            className="drivers-page__select"
          >
            <option value="">All Nationalities</option>
            {uniqueNationalities.map((nat: string) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
          </select>
        </div>

        <div className="drivers-page__filter-group">
          <ArrowUpDown size={16} className="drivers-page__filter-icon" />
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as any))}
            className="drivers-page__select"
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
          <div className="drivers-page__grid">
            {paginatedDrivers.map((driver: any) => (
              <DriverCard
                key={driver.driverId}
                driverId={driver.driverId}
                givenName={driver.givenName}
                familyName={driver.familyName}
                nationality={driver.nationality}
                permanentNumber={driver.permanentNumber}
              />
            ))}
          </div>

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

import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useGetCircuitsQuery } from '../../../store/services/jolpicaService';
import {
  setSearchQuery,
  setCountryFilter,
  setCurrentPage,
  setSortBy,
  resetFilters,
} from '../../../store/slices/circuitsSlice';
import { CircuitCard } from '../components/CircuitCard';
import { Skeleton } from '@/components/atoms/skeleton';
import { Button } from '@/components/atoms/button';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import './circuits.scss';

export const CircuitsPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    searchQuery,
    selectedCountry,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
  } = useSelector((state: RootState) => state.circuits);

  const { data, isLoading, isError } = useGetCircuitsQuery('2024');

  const circuits = useMemo(() => {
    if (!data?.MRData?.CircuitTable?.Circuits) return [];
    return data.MRData.CircuitTable.Circuits;
  }, [data]);

  const filteredAndSortedCircuits = useMemo(() => {
    let result = [...circuits];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c: any) =>
          c.circuitName.toLowerCase().includes(query) ||
          c.circuitId.toLowerCase().includes(query)
      );
    }

    // Country filter
    if (selectedCountry) {
      result = result.filter((c: any) => c.Location?.country === selectedCountry);
    }

    // Sort
    result.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.circuitName.localeCompare(b.circuitName);
      } else if (sortBy === 'country') {
        comparison = (a.Location?.country || '').localeCompare(b.Location?.country || '');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [circuits, searchQuery, selectedCountry, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCircuits.length / itemsPerPage);
  const paginatedCircuits = filteredAndSortedCircuits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueCountries = useMemo(() => {
    const countries = new Set(circuits.map((c: any) => c.Location?.country).filter(Boolean));
    return Array.from(countries as Set<string>).sort();
  }, [circuits]);

  if (isLoading) {
    return (
      <div className="circuits-page">
        <div className="circuits-page__header">
          <h1 className="circuits-page__title">Circuits</h1>
        </div>
        <div className="circuits-page__grid">
          {[...Array(16)].map((_, i) => (
            <Skeleton key={i} className="circuits-page__skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="circuits-page">
        <div className="circuits-page__error">
          <p>Failed to load circuit data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="circuits-page">
      <div className="circuits-page__header">
        <div>
          <h1 className="circuits-page__title">Circuits</h1>
          <p className="circuits-page__subtitle">Browse all Formula 1 circuits across seasons</p>
        </div>
      </div>

      <div className="circuits-page__filters">
        <div className="circuits-page__search">
          <Search size={18} className="circuits-page__search-icon" />
          <input
            type="text"
            placeholder="Search circuits..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="circuits-page__search-input"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="circuits-page__search-clear"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="circuits-page__filter-group">
          <Filter size={16} className="circuits-page__filter-icon" />
          <select
            value={selectedCountry}
            onChange={(e) => dispatch(setCountryFilter(e.target.value))}
            className="circuits-page__select"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((country: string) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="circuits-page__filter-group">
          <ArrowUpDown size={16} className="circuits-page__filter-icon" />
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as any))}
            className="circuits-page__select"
          >
            <option value="name">Sort by Name</option>
            <option value="country">Sort by Country</option>
          </select>
        </div>

        {(searchQuery || selectedCountry) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(resetFilters())}
            className="circuits-page__reset"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {paginatedCircuits.length === 0 ? (
        <div className="circuits-page__empty">
          <p>No circuits found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className="circuits-page__grid">
            {paginatedCircuits.map((circuit: any) => (
              <CircuitCard
                key={circuit.circuitId}
                circuitId={circuit.circuitId}
                circuitName={circuit.circuitName}
                location={circuit.Location}
                url={circuit.url}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="circuits-page__pagination">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              >
                Previous
              </Button>
              <span className="circuits-page__page-info">
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

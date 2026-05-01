import React from 'react';
import { useGetScheduleQuery } from '../../../store/services/jolpicaService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSelectedYear } from '../../../store/slices/filtersSlice';

import { DropdownFilter } from '../../../components/molecules/dropdown-filter';
import { Skeleton } from '../../../components/atoms/skeleton';
import { Badge } from '../../../components/atoms/badge';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import './schedule.scss';

export const SchedulePage: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedYear = useSelector((state: RootState) => state.filters.selectedYear);

  const { data, isLoading, isError } = useGetScheduleQuery(selectedYear);

  const yearOptions = [
    { value: '2025', label: `2025 ${t('nav.about')}` },
    { value: '2024', label: `2024 ${t('nav.about')}` },
    { value: '2023', label: `2023 ${t('nav.about')}` },
    { value: '2022', label: `2022 ${t('nav.about')}` },
    { value: '2021', label: `2021 ${t('nav.about')}` },
  ];

  const races = data?.MRData?.RaceTable?.Races || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-red-500 uppercase tracking-tight">{t('nav.schedule')}</h1>
          <p className="text-slate-400 mt-1">{t('schedule.subtitle')}</p>
        </div>
        <DropdownFilter
          label={t('schedule.select_year')}
          value={selectedYear}
          options={yearOptions}
          onChange={(val: any) => dispatch(setSelectedYear(val))}
          className="w-full sm:w-48"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <Skeleton key={idx} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-900/20">
          <p className="text-rose-400 font-semibold">{t('schedule.error')}</p>
          <p className="text-xs text-slate-500 mt-1">{t('schedule.error_retry')}</p>
        </div>
      ) : races.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {races.map((race: any, idx: number) => {
            const raceDate = new Date(`${race.date}T${race.time || '12:00:00Z'}`);
            const isFinished = raceDate < new Date();

            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30 p-5 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/60 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={isFinished ? 'slate' : 'red'}>
                    {isFinished ? 'FINISHED' : `ROUND ${race.round}`}
                  </Badge>
                  <span className="flex items-center gap-1 font-mono text-xs font-bold text-slate-400">
                    <Calendar size={14} className="text-red-500" />
                    {new Date(race.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-100 group-hover:text-red-400 transition-colors duration-200">
                  {race.raceName}
                </h3>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
                  <MapPin size={14} className="text-slate-500 flex-shrink-0" />
                  <span className="truncate">
                    {race.Circuit?.Location?.locality}, {race.Circuit?.Location?.country}
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-800/60 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{race.Circuit?.circuitName}</span>
                  {race.Circuit?.url && (
                    <a
                      href={race.Circuit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-red-400 flex items-center gap-1"
                    >
                      Wiki <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">{t('schedule.empty')}</div>
      )}
    </div>
  );
};

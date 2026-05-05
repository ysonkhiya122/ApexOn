import React from 'react';
import { useGetScheduleQuery, useGetRaceResultsQuery, useGetDriverStandingsQuery } from '../../../store/services/jolpicaService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSelectedYear, setSelectedRound } from '../../../store/slices/filtersSlice';

import { DropdownFilter } from '../../../components/molecules/dropdown-filter';
import { Skeleton } from '../../../components/atoms/skeleton';
import { Badge } from '../../../components/atoms/badge';
import { Award } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { AnalysisDashboard } from '../../../features/analysis';
import './results.scss';

export const ResultsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { selectedYear, selectedRound } = useSelector((state: RootState) => state.filters);

  const { data: scheduleData } = useGetScheduleQuery(selectedYear);
  const { data: resultsData, isLoading: resultsLoading } = useGetRaceResultsQuery({
    year: selectedYear,
    round: selectedRound,
  });
  const { data: standingsData, isLoading: standingsLoading } = useGetDriverStandingsQuery(selectedYear);

  const yearOptions = [
    { value: '2026', label: `2026 ${t('nav.about')}` },
    { value: '2025', label: `2025 ${t('nav.about')}` },
    { value: '2024', label: `2024 ${t('nav.about')}` },
    { value: '2023', label: `2023 ${t('nav.about')}` },
    { value: '2022', label: `2022 ${t('nav.about')}` },
    { value: '2021', label: `2021 ${t('nav.about')}` },
    { value: '2020', label: `2020 ${t('nav.about')}` },
    { value: '2019', label: `2019 ${t('nav.about')}` },
    { value: '2018', label: `2018 ${t('nav.about')}` },
    { value: '2017', label: `2017 ${t('nav.about')}` },
    { value: '2016', label: `2016 ${t('nav.about')}` },
    { value: '2015', label: `2015 ${t('nav.about')}` },
  ];

  const rounds = scheduleData?.MRData?.RaceTable?.Races || [];
  const roundOptions = rounds.map((r: any) => ({
    value: r.round,
    label: `Round ${r.round} - ${r.raceName}`,
  }));

  const results = resultsData?.MRData?.RaceTable?.Races?.[0]?.Results || [];
  const standings = standingsData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-red-500 uppercase tracking-tight">{t('nav.results')}</h1>
          <p className="text-slate-400 mt-1">{t('results.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <DropdownFilter
            label="Season"
            value={selectedYear}
            options={yearOptions}
            onChange={(val: any) => {
              dispatch(setSelectedYear(val));
              dispatch(setSelectedRound('1'));
            }}
            className="w-40"
          />
          {roundOptions.length > 0 && (
            <DropdownFilter
              label="Grand Prix"
              value={selectedRound}
              options={roundOptions}
              onChange={(val: any) => dispatch(setSelectedRound(val))}
              className="w-64"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Award size={20} className="text-red-500" />
            {t('results.leaderboard')}
          </h2>

          {resultsLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, idx) => (
                <Skeleton key={idx} className="h-14 w-full" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-3.5">Pos</th>
                      <th className="px-4 py-3.5">Driver</th>
                      <th className="px-4 py-3.5">Constructor</th>
                      <th className="px-4 py-3.5">Points</th>
                      <th className="px-4 py-3.5">Time/Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {results.map((item: any, idx: number) => {
                      const isPodium = idx < 3;
                      const podiumColor =
                        idx === 0
                          ? 'text-yellow-400 font-bold'
                          : idx === 1
                          ? 'text-slate-300 font-bold'
                          : 'text-amber-600 font-bold';

                      return (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className={`px-4 py-3.5 font-mono ${isPodium ? podiumColor : 'text-slate-400'}`}>
                            {item.position}
                          </td>
                          <td className="px-4 py-3.5 text-slate-100 font-medium">
                            {item.Driver.givenName} {item.Driver.familyName}
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">{item.Constructor.name}</td>
                          <td className="px-4 py-3.5 font-bold text-red-400 font-mono">{item.points}</td>
                          <td className="px-4 py-3.5 text-xs font-mono text-slate-400">
                            {item.Time?.time || item.status}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-900/10 text-slate-500">
              {t('results.empty_results')}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Award size={20} className="text-yellow-500" />
            {t('results.summary')}
          </h2>

          {standingsLoading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, idx) => (
                <Skeleton key={idx} className="h-12 w-full" />
              ))}
            </div>
          ) : standings.length > 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 shadow-lg divide-y divide-slate-800/50">
              {standings.map((entry: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-500 w-4">{entry.position}</span>
                    <span className="text-sm font-semibold text-slate-100">
                      {entry.Driver.givenName} {entry.Driver.familyName}
                    </span>
                  </div>
                  <Badge variant="red" className="font-mono text-xs">
                    {entry.points} PTS
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">{t('results.empty_standings')}</div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <AnalysisDashboard />
      </div>
    </div>
  );
};

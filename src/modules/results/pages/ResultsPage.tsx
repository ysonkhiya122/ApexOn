import React from 'react';
import { useGetScheduleQuery, useGetRaceResultsQuery, useGetDriverStandingsQuery } from '../../../store/services/jolpicaService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSelectedYear, setSelectedRound } from '../../../store/slices/filtersSlice';

import { DropdownFilter } from '../../../shared/components/molecules/dropdown-filter';
import { Skeleton } from '../../../shared/components/atoms/skeleton';
import { Badge } from '../../../shared/components/atoms/badge';
import { Award } from 'lucide-react';
import './results.scss';

export const ResultsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedYear, selectedRound } = useSelector((state: RootState) => state.filters);

  const { data: scheduleData } = useGetScheduleQuery(selectedYear);
  const { data: resultsData, isLoading: resultsLoading } = useGetRaceResultsQuery({
    year: selectedYear,
    round: selectedRound,
  });
  const { data: standingsData, isLoading: standingsLoading } = useGetDriverStandingsQuery(selectedYear);

  const yearOptions = Array.from({ length: 2026 - 1950 + 1 }, (_, i) => {
    const yr = (2026 - i).toString();
    return { value: yr, label: `${yr}` };
  });

  const rounds = scheduleData || [];
  const roundOptions = rounds.map((r: any) => ({
    value: String(r.round),
    label: `Round ${r.round} - ${r.name}`,
  }));

  // getRaceResults returns raw API data (no transform)
  const results = resultsData?.MRData?.RaceTable?.Races?.[0]?.Results || [];
  // getDriverStandings returns transformed DriverStanding[]
  const standings = standingsData || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-red-500 uppercase tracking-tight">Results</h1>
          <p className="text-slate-400 mt-1">Review podium finishes or end-of-year standings charts.</p>
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
            Position Leaderboard
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
                            {item.Driver?.givenName || 'Unknown'} {item.Driver?.familyName || 'Driver'}
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">{item.Constructor?.name || 'Unknown'}</td>
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
              No results logged for the specified endpoint parameters.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Award size={20} className="text-yellow-500" />
            Standings Summary
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
                      {entry.driver?.firstName || 'Unknown'} {entry.driver?.lastName || 'Driver'}
                    </span>
                  </div>
                  <Badge variant="red" className="font-mono text-xs">
                    {entry.points} PTS
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">Standings records empty.</div>
          )}
        </div>
      </div>
    </div>
  );
};

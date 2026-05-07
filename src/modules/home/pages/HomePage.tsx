import React, { useEffect, useState } from 'react';
import { useGetScheduleQuery, useGetDriverStandingsQuery, useGetConstructorStandingsQuery } from '../../../store/services/jolpicaService';
import { Trophy, Calendar, Flame, ChevronRight } from 'lucide-react';
import { Badge } from '../../../shared/components/atoms/badge';
import { Button } from '../../../shared/components/atoms/button';
import { Skeleton } from '../../../shared/components/atoms/skeleton';
import { Link } from 'react-router-dom';
import { TeamRadio } from '../../radio/components/TeamRadio';
import './home.scss';

export const HomePage: React.FC = () => {
  const { data: scheduleData, isLoading: scheduleLoading } = useGetScheduleQuery('2026');
  const { data: driverData, isLoading: driverLoading } = useGetDriverStandingsQuery('2026');
  const { data: constructorData, isLoading: constructorLoading } = useGetConstructorStandingsQuery('2026');

  const [nextRace, setNextRace] = useState<any>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!scheduleData?.MRData?.RaceTable?.Races) return;
    const races = scheduleData.MRData.RaceTable.Races;
    const now = new Date();
    const upcoming = races.find((race: any) => {
      const raceDate = new Date(`${race.date}T${race.time || '12:00:00Z'}`);
      return raceDate > now;
    }) || races[races.length - 1];

    setNextRace(upcoming);

    if (upcoming) {
      const raceDate = new Date(`${upcoming.date}T${upcoming.time || '12:00:00Z'}`);
      const updateCountdown = () => {
        const diff = raceDate.getTime() - new Date().getTime();
        if (diff <= 0) {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      };
      const timerId = setInterval(updateCountdown, 1000);
      updateCountdown();
      return () => clearInterval(timerId);
    }
  }, [scheduleData]);

  const drivers = driverData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.slice(0, 5) || [];
  const constructors = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.slice(0, 5) || [];

  return (
    <div className="f1-home space-y-12 pb-12">
      <section className="relative flex min-h-[400px] flex-col justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-950/40 via-slate-950 to-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl w-full">
          <Badge variant="red" className="mb-4 text-xs font-bold uppercase tracking-wider">
            NEXT GRAND PRIX
          </Badge>
          
          {scheduleLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 max-w-md" />
              <Skeleton className="h-6 w-1/2 max-w-sm" />
            </div>
          ) : nextRace ? (
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl uppercase italic">
                {nextRace.raceName}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <Calendar size={16} className="text-red-500" />
                  {new Date(nextRace.date).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="h-4 w-px bg-slate-800 hidden sm:block" />
                <span className="text-sm font-semibold tracking-wide uppercase text-slate-400">
                  {nextRace.Circuit?.circuitName}
                </span>
              </div>

              <div className="mt-8 grid grid-cols-4 gap-4 max-w-lg">
                {[
                  { value: countdown.days, label: 'Days' },
                  { value: countdown.hours, label: 'Hrs' },
                  { value: countdown.minutes, label: 'Mins' },
                  { value: countdown.seconds, label: 'Secs' },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-900/80 backdrop-blur border border-slate-800 p-3 text-center">
                    <span className="block text-2xl font-black text-red-500 font-mono sm:text-4xl">
                      {item.value}
                    </span>
                    <span className="text-xxs uppercase tracking-widest text-slate-400 font-bold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Schedule lookup currently unavailable.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100">
                <Trophy size={20} className="text-yellow-500" />
                Driver Standings
              </h2>
              <Link to="/results">
                <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-slate-100">
                  View All <ChevronRight size={16} />
                </Button>
              </Link>
            </div>

            {driverLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-full" />
                ))}
              </div>
            ) : drivers.length > 0 ? (
              <div className="divide-y divide-slate-800/50">
                {drivers.map((entry: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-bold text-slate-500 w-4">
                        {entry.position}
                      </span>
                      <div>
                        <div className="font-bold text-slate-100">
                          {entry.Driver.givenName} {entry.Driver.familyName}
                        </div>
                        <div className="text-xs text-slate-400">
                          {entry.Constructors?.[0]?.name}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-black text-red-500">
                      {entry.points} PTS
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm py-8 text-slate-500">No driver statistics available.</div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100">
                <Flame size={20} className="text-red-500" />
                Constructor Standings
              </h2>
              <Link to="/results">
                <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-slate-100">
                  View All <ChevronRight size={16} />
                </Button>
              </Link>
            </div>

            {constructorLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-full" />
                ))}
              </div>
            ) : constructors.length > 0 ? (
              <div className="divide-y divide-slate-800/50">
                {constructors.map((entry: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-bold text-slate-500 w-4">
                        {entry.position}
                      </span>
                      <span className="font-bold text-slate-100">
                        {entry.Constructor.name}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-black text-slate-300">
                      {entry.points} PTS
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm py-8 text-slate-500">No team statistics available.</div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <TeamRadio />
        </div>
      </section>
    </div>
  );
};

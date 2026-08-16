import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Flame, ChevronRight, MapPin, Radio } from 'lucide-react';
import {
  useGetScheduleQuery,
  useGetDriverStandingsQuery,
  useGetConstructorStandingsQuery,
} from '../../../store/services/jolpicaService';
import type { Race } from '../../../services/api/types/normalized.types';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { Skeleton } from '@/components/atoms/skeleton';
import { ROUTES } from '@/app/routes/paths';
import { CURRENT_SEASON_TOKEN, currentSeasonYear } from '@/utils/season';
import { TeamRadio } from '../../radio/components/TeamRadio';
import './home.scss';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO_COUNTDOWN: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

/** A race weekend is treated as "live" for ~4h from lights out. */
const RACE_LIVE_WINDOW_MS = 4 * 60 * 60 * 1000;

const raceStart = (race: Race): Date | null => {
  if (!race.date) return null;
  // Ergast omits `time` for provisional entries — fall back to date-only so we
  // never render a precise-looking countdown built on a guessed start time.
  const iso = race.time ? `${race.date}T${race.time}` : race.date;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toCountdown = (ms: number): Countdown => ({
  days: Math.floor(ms / 86_400_000),
  hours: Math.floor((ms % 86_400_000) / 3_600_000),
  minutes: Math.floor((ms % 3_600_000) / 60_000),
  seconds: Math.floor((ms % 60_000) / 1000),
});

export const HomePage: React.FC = () => {
  const { data: scheduleData, isLoading: scheduleLoading } =
    useGetScheduleQuery(CURRENT_SEASON_TOKEN);
  const { data: driverData, isLoading: driverLoading } =
    useGetDriverStandingsQuery(CURRENT_SEASON_TOKEN);
  const { data: constructorData, isLoading: constructorLoading } =
    useGetConstructorStandingsQuery(CURRENT_SEASON_TOKEN);

  const [countdown, setCountdown] = useState<Countdown>(ZERO_COUNTDOWN);
  const [now, setNow] = useState(() => Date.now());

  const { nextRace, isSeasonComplete } = useMemo(() => {
    if (!scheduleData?.length) return { nextRace: null, isSeasonComplete: false };

    const upcoming = scheduleData.find((race) => {
      const start = raceStart(race);
      return start ? start.getTime() + RACE_LIVE_WINDOW_MS > now : false;
    });

    return { nextRace: upcoming ?? null, isSeasonComplete: !upcoming };
  }, [scheduleData, now]);

  const raceStartMs = nextRace ? (raceStart(nextRace)?.getTime() ?? null) : null;
  const isLive = raceStartMs !== null && now >= raceStartMs;
  const hasKnownStartTime = Boolean(nextRace?.time);

  useEffect(() => {
    if (raceStartMs === null) return;

    const tick = () => {
      const current = Date.now();
      setNow(current);
      setCountdown(toCountdown(Math.max(0, raceStartMs - current)));
    };

    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [raceStartMs]);

  const drivers = driverData?.slice(0, 5) ?? [];
  const constructors = constructorData?.slice(0, 5) ?? [];

  const countdownCells = [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hours, label: 'Hrs' },
    { value: countdown.minutes, label: 'Mins' },
    { value: countdown.seconds, label: 'Secs' },
  ];

  return (
    <div className="f1-home space-y-12 pb-12">
      <section className="relative flex min-h-[400px] flex-col justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-950/40 via-slate-950 to-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Badge variant="red" className="mb-4 text-xs font-bold uppercase tracking-wider">
            {isLive ? 'RACE IN PROGRESS' : isSeasonComplete ? 'SEASON COMPLETE' : 'NEXT GRAND PRIX'}
          </Badge>

          {scheduleLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 max-w-md" />
              <Skeleton className="h-6 w-1/2 max-w-sm" />
            </div>
          ) : nextRace ? (
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black uppercase italic tracking-tight text-white sm:text-6xl">
                {nextRace.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <Calendar size={16} className="text-red-500" aria-hidden="true" />
                  <time dateTime={nextRace.date}>
                    {new Date(nextRace.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </span>
                <span className="hidden h-4 w-px bg-slate-800 sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  <MapPin size={16} className="text-red-500" aria-hidden="true" />
                  {nextRace.circuit.name}
                  {nextRace.circuit.country ? `, ${nextRace.circuit.country}` : ''}
                </span>
              </div>

              {isLive ? (
                <div className="mt-8 flex items-center gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-4">
                  <Radio className="animate-pulse text-red-500" size={20} aria-hidden="true" />
                  <p className="text-sm font-bold uppercase tracking-widest text-red-300">
                    Lights out — session under way
                  </p>
                  <Link to={ROUTES.RACE_CENTER} className="ml-auto">
                    <Button size="sm">Race Center</Button>
                  </Link>
                </div>
              ) : hasKnownStartTime ? (
                <div
                  className="mt-8 grid max-w-lg grid-cols-4 gap-4"
                  role="timer"
                  aria-live="off"
                  aria-label={`Time until ${nextRace.name}: ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes`}
                >
                  {countdownCells.map((cell) => (
                    <div
                      key={cell.label}
                      className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-center backdrop-blur"
                    >
                      <span className="block font-mono text-2xl font-black text-red-500 sm:text-4xl">
                        {String(cell.value).padStart(2, '0')}
                      </span>
                      <span className="text-xxs font-bold uppercase tracking-widest text-slate-400">
                        {cell.label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-sm text-slate-400">
                  Start time to be confirmed — check back closer to the weekend.
                </p>
              )}
            </div>
          ) : isSeasonComplete ? (
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black uppercase italic tracking-tight text-white sm:text-6xl">
                That&apos;s a wrap on {currentSeasonYear()}
              </h1>
              <p className="mt-4 text-slate-300">
                Every round is done. Relive the season while we wait for the next calendar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={ROUTES.RESULTS}>
                  <Button>Final results</Button>
                </Link>
                <Link to={ROUTES.STANDINGS}>
                  <Button variant="ghost">Championship standings</Button>
                </Link>
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
            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100">
                <Trophy size={20} className="text-yellow-500" aria-hidden="true" />
                Driver Standings
              </h2>
              <Link to={ROUTES.STANDINGS} aria-label="View all driver standings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-slate-400 hover:text-slate-100"
                >
                  View All <ChevronRight size={16} aria-hidden="true" />
                </Button>
              </Link>
            </div>

            {driverLoading ? (
              <div className="space-y-3" aria-busy="true">
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-full" />
                ))}
              </div>
            ) : drivers.length > 0 ? (
              <ol className="divide-y divide-slate-800/50">
                {drivers.map((entry) => (
                  <li key={entry.driver.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <span className="w-4 font-mono text-sm font-bold text-slate-400">
                        {entry.position}
                      </span>
                      <div>
                        <Link
                          to={`${ROUTES.DRIVERS}/${entry.driver.id}`}
                          className="font-bold text-slate-100 hover:text-red-400"
                        >
                          {entry.driver.fullName}
                        </Link>
                        <div className="text-xs text-slate-400">{entry.team}</div>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-black text-red-500">
                      {entry.points} PTS
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">
                No driver statistics available.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100">
                <Flame size={20} className="text-red-500" aria-hidden="true" />
                Constructor Standings
              </h2>
              <Link to={ROUTES.STANDINGS} aria-label="View all constructor standings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-slate-400 hover:text-slate-100"
                >
                  View All <ChevronRight size={16} aria-hidden="true" />
                </Button>
              </Link>
            </div>

            {constructorLoading ? (
              <div className="space-y-3" aria-busy="true">
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-full" />
                ))}
              </div>
            ) : constructors.length > 0 ? (
              <ol className="divide-y divide-slate-800/50">
                {constructors.map((entry) => (
                  <li key={entry.team.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <span className="w-4 font-mono text-sm font-bold text-slate-400">
                        {entry.position}
                      </span>
                      <Link
                        to={`${ROUTES.TEAMS}/${entry.team.id}`}
                        className="font-bold text-slate-100 hover:text-red-400"
                      >
                        {entry.team.name}
                      </Link>
                    </div>
                    <span className="font-mono text-sm font-black text-slate-300">
                      {entry.points} PTS
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">
                No team statistics available.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <TeamRadio />
        </div>
      </section>
    </div>
  );
};

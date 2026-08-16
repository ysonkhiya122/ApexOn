import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Radio, Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import {
  useGetDriversQuery,
  useGetSessionsQuery,
  useGetTeamRadioQuery,
} from '../../../store/services/openF1Service';
import type { OpenF1Driver, OpenF1Session, OpenF1TeamRadio } from '../../../types/openf1.types';
import { Badge } from '@/components/atoms/badge';
import { Skeleton } from '@/components/atoms/skeleton';
import { currentSeasonYear } from '@/utils/season';
import './radio.scss';

const ALL_DRIVERS = 'all';

/**
 * Most recent race that has actually started. The previous implementation took
 * `sessions[0]` — the *first* race of a hardcoded 2024 — so the panel always
 * showed the season opener regardless of today's date.
 */
const findLatestStartedSession = (sessions?: OpenF1Session[]): OpenF1Session | undefined => {
  if (!sessions?.length) return undefined;
  const now = Date.now();
  const started = sessions
    .filter((session) => session.date_start && new Date(session.date_start).getTime() <= now)
    .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());

  return started.at(-1) ?? sessions.at(0);
};

const formatClipTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export const TeamRadio: React.FC = () => {
  const season = currentSeasonYear();
  const [selectedDriver, setSelectedDriver] = useState<string>(ALL_DRIVERS);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Current season first; if it hasn't run a race yet, fall back to last year.
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionsQuery({
    year: String(season),
    session_name: 'Race',
  });
  const hasCurrentSeasonRace = Boolean(findLatestStartedSession(sessions));
  const { data: previousSessions } = useGetSessionsQuery(
    { year: String(season - 1), session_name: 'Race' },
    { skip: sessionsLoading || hasCurrentSeasonRace }
  );

  const session = useMemo(
    () => findLatestStartedSession(sessions) ?? findLatestStartedSession(previousSessions),
    [sessions, previousSessions]
  );
  const sessionKey = session?.session_key;

  const { data: drivers } = useGetDriversQuery(
    { session_key: sessionKey as number },
    { skip: !sessionKey }
  );

  const {
    data: clips,
    isLoading: clipsLoading,
    isError,
  } = useGetTeamRadioQuery({ session_key: sessionKey as number }, { skip: !sessionKey });

  const driversByNumber = useMemo(() => {
    const map = new Map<number, OpenF1Driver>();
    drivers?.forEach((driver) => map.set(driver.driver_number, driver));
    return map;
  }, [drivers]);

  // Only offer drivers who actually have audio in this session.
  const driverOptions = useMemo(() => {
    const numbers = [...new Set((clips ?? []).map((clip) => clip.driver_number))];
    return numbers
      .map((number) => {
        const driver = driversByNumber.get(number);
        return {
          number,
          label: driver?.full_name ?? `Driver #${number}`,
          acronym: driver?.name_acronym ?? String(number),
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [clips, driversByNumber]);

  const visibleClips = useMemo(() => {
    const list: OpenF1TeamRadio[] = clips ? [...clips] : [];
    const filtered =
      selectedDriver === ALL_DRIVERS
        ? list
        : list.filter((clip) => String(clip.driver_number) === selectedDriver);

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [clips, selectedDriver]);

  // Stop playback when the clip list changes underneath the player. Pausing is
  // an external-system effect; the visual state follows from `onPause`.
  useEffect(() => {
    audioRef.current?.pause();
  }, [sessionKey, selectedDriver]);

  const togglePlayback = async (url: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlaybackError(null);

    if (activeTrack === url) {
      audio.pause();
      setActiveTrack(null);
      return;
    }

    audio.src = url;
    try {
      // Browsers reject play() under autoplay policy or on a dead URL —
      // surface it instead of leaving a button stuck in the "playing" state.
      await audio.play();
      setActiveTrack(url);
    } catch {
      setActiveTrack(null);
      setPlaybackError('Playback was blocked by your browser. Try pressing play again.');
    }
  };

  const isLoading = sessionsLoading || clipsLoading;

  return (
    <section
      className="f1-team-radio rounded-xl border border-slate-800 bg-slate-900/30 p-6 shadow-2xl backdrop-blur"
      aria-labelledby="team-radio-heading"
    >
      <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-slate-800/80 pb-4">
        <Radio className="text-red-500" size={24} aria-hidden="true" />
        <div className="flex-1">
          <h2 id="team-radio-heading" className="text-lg font-extrabold text-slate-100">
            Pit-to-Driver Team Radio
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {session
              ? `${session.location ?? 'Latest race'} · ${
                  session.date_start ? new Date(session.date_start).toLocaleDateString() : ''
                }`
              : 'Loading latest race session…'}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:max-w-xs">
        <label
          htmlFor="team-radio-driver"
          className="text-xxs font-bold uppercase tracking-wider text-slate-400"
        >
          Driver
        </label>
        <select
          id="team-radio-driver"
          value={selectedDriver}
          onChange={(event) => setSelectedDriver(event.target.value)}
          disabled={!driverOptions.length}
          className="h-10 rounded border border-slate-800 bg-slate-950 px-3 text-sm font-bold text-slate-100 focus:border-red-500 focus:outline-none disabled:opacity-50"
        >
          <option value={ALL_DRIVERS}>All drivers ({clips?.length ?? 0})</option>
          {driverOptions.map((option) => (
            <option key={option.number} value={String(option.number)}>
              {option.acronym} · {option.label}
            </option>
          ))}
        </select>
      </div>

      <audio
        ref={audioRef}
        onEnded={() => setActiveTrack(null)}
        onPause={() => setActiveTrack(null)}
        className="hidden"
      >
        {/* Radio clips are raw pit-wall audio; no caption track is published
            by the upstream feed. */}
      </audio>

      {playbackError && (
        <p
          role="alert"
          className="mb-4 flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300"
        >
          <AlertCircle size={14} aria-hidden="true" />
          {playbackError}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-2" aria-busy="true">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded" />
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-xl border border-slate-800/40 py-8 text-center text-sm text-slate-400">
          Team radio is unavailable right now. Please try again shortly.
        </p>
      ) : visibleClips.length > 0 ? (
        <ul className="max-h-72 space-y-3 overflow-y-auto pr-2">
          {visibleClips.map((clip) => {
            const driver = driversByNumber.get(clip.driver_number);
            const isCurrent = activeTrack === clip.recording_url;
            const name = driver?.full_name ?? `Driver #${clip.driver_number}`;
            const teamColour = driver?.team_colour ? `#${driver.team_colour}` : '#64748b';

            return (
              <li
                key={`${clip.driver_number}-${clip.date}`}
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                  isCurrent
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-9 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: teamColour }}
                  />
                  <div className="rounded-full border border-slate-700/60 bg-slate-800 p-2 text-slate-300">
                    <Volume2 size={16} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-100">{name}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Badge variant="slate" className="text-xxs uppercase tracking-widest">
                        {driver?.team_name ?? `#${clip.driver_number}`}
                      </Badge>
                      <span className="font-mono text-xxs text-slate-400">
                        {formatClipTime(clip.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => togglePlayback(clip.recording_url)}
                  aria-pressed={isCurrent}
                  aria-label={`${isCurrent ? 'Pause' : 'Play'} team radio from ${name} at ${formatClipTime(clip.date)}`}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-950'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isCurrent ? (
                    <Pause size={16} aria-hidden="true" />
                  ) : (
                    <Play size={16} className="ml-0.5" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-slate-800/40 bg-slate-950/10 py-8 text-center text-sm text-slate-400">
          No archived audio transmissions for this selection.
        </p>
      )}
    </section>
  );
};

import React, { useState } from 'react';
import { useGetSessionsQuery, useGetTeamRadioQuery } from '../../../store/services/openF1Service';
import { Badge } from '@/components/atoms/badge';
import { Skeleton } from '@/components/atoms/skeleton';
import { Radio, Play, Pause, Volume2 } from 'lucide-react';
import './radio.scss';

export const TeamRadio: React.FC = () => {
  const [driverNumber, setDriverNumber] = useState('1');
  
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionsQuery({ year: '2024', session_name: 'Race' });
  const activeSessionKey = sessions?.[0]?.session_key || '9158';

  const { data: audioLogs, isLoading: audioLoading } = useGetTeamRadioQuery(
    { session_key: activeSessionKey, driver_number: driverNumber },
    { skip: !activeSessionKey }
  );

  const [activeTrack, setActiveTrack] = useState<string | null>(null);

  const togglePlayback = (url: string) => {
    const audioNode = document.getElementById('global-radio-node') as HTMLAudioElement;
    if (!audioNode) return;

    if (activeTrack === url) {
      audioNode.pause();
      setActiveTrack(null);
    } else {
      audioNode.src = url;
      audioNode.play();
      setActiveTrack(url);
    }
  };

  return (
    <div className="f1-team-radio rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-4">
        <Radio className="text-red-500 animate-pulse" size={24} />
        <div>
          <h2 className="text-lg font-extrabold text-slate-100">Pit-to-Driver Team Radio</h2>
          <p className="text-xs text-slate-400 mt-0.5">Listen to official communications across live sessions.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6 sm:w-1/3">
        <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Driver No</label>
        <input
          type="number"
          value={driverNumber}
          onChange={(e) => setDriverNumber(e.target.value)}
          className="h-10 rounded border border-slate-800 bg-slate-950 px-3 text-sm text-slate-100 placeholder-slate-500 focus:border-red-500 focus:outline-none font-bold"
          placeholder="e.g. 1, 44, 16"
        />
      </div>

      <audio id="global-radio-node" onEnded={() => setActiveTrack(null)} className="hidden" />

      {audioLoading || sessionsLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded" />
          ))}
        </div>
      ) : audioLogs && audioLogs.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {audioLogs.slice(0, 8).map((record: any, idx: number) => {
            const isCurrent = activeTrack === record.recording_url;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                  isCurrent ? 'border-red-500 bg-red-500/5' : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-800 p-2 border border-slate-700/60 text-slate-300">
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">
                      {new Date(record.date).toLocaleTimeString()}
                    </div>
                    <Badge variant="slate" className="text-xxs uppercase tracking-widest mt-1">
                      Driver #{record.driver_number}
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={() => togglePlayback(record.recording_url)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    isCurrent ? 'bg-slate-100 text-slate-950' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isCurrent ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-sm text-slate-500 border border-slate-800/40 rounded-xl bg-slate-950/10">
          No archived audio transmissions detected.
        </div>
      )}
    </div>
  );
};

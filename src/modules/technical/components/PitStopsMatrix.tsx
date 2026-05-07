import React from 'react';
import { useGetPitStopsQuery } from '../../../store/services/jolpicaService';
import { Timer, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { Skeleton } from '../../../shared/components/atoms/skeleton';
import './pitstops.scss';

interface PitStopsProps {
  year: string;
  round: string;
}

export const PitStopsMatrix: React.FC<PitStopsProps> = ({ year, round }) => {
  const { data, isLoading, isError } = useGetPitStopsQuery({ year, round });

  const pitStops = data?.MRData?.RaceTable?.Races?.[0]?.PitStops || [];

  return (
    <div className="f1-pitstops rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur shadow-xl space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-4">
        <Timer className="text-red-500 animate-pulse" size={20} />
        <div>
          <h2 className="text-lg font-bold text-slate-100">Pit Stop Frequency Index</h2>
          <p className="text-xxs text-slate-400">Precision turnaround efficiency metrics.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-slate-400 text-xs text-center py-4 flex flex-col items-center gap-1.5">
          <ShieldAlert size={20} className="text-slate-600" />
          No archived pit stop metrics available for the target session range.
        </div>
      ) : pitStops.length > 0 ? (
        <div className="space-y-3">
          {pitStops.slice(0, 5).map((stop: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between rounded bg-slate-950 p-3 border border-slate-800/60 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-500 font-bold">#{stop.stop}</span>
                <div>
                  <span className="text-xs font-black text-slate-200 uppercase">Driver #{stop.driverId}</span>
                  <div className="flex items-center gap-1.5 text-xxs text-slate-400 mt-0.5">
                    <ArrowRightLeft size={10} className="text-red-500" /> Lap: {stop.lap}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs font-black text-red-400">{stop.duration}s</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-500">Telemetry feed unavailable.</div>
      )}
    </div>
  );
};

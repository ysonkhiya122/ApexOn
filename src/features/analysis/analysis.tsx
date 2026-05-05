import React, { useState } from 'react';
import { Award, Zap, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';
import './analysis.scss';

interface DriverProfile {
  id: string;
  name: string;
  team: string;
  wins: number;
  podiums: number;
  qualifying: number; // 0-100
  tireManagement: number; // 0-100
  wetWeather: number; // 0-100
  overtaking: number; // 0-100
}

export const AnalysisDashboard: React.FC = () => {
  const drivers: DriverProfile[] = [
    { id: 'max', name: 'Max Verstappen', team: 'Red Bull Racing', wins: 61, podiums: 106, qualifying: 95, tireManagement: 92, wetWeather: 98, overtaking: 94 },
    { id: 'lewis', name: 'Lewis Hamilton', team: 'Ferrari', wins: 105, podiums: 201, qualifying: 98, tireManagement: 96, wetWeather: 97, overtaking: 95 },
    { id: 'charles', name: 'Charles Leclerc', team: 'Ferrari', wins: 7, podiums: 36, qualifying: 97, tireManagement: 85, wetWeather: 88, overtaking: 92 },
    { id: 'lando', name: 'Lando Norris', team: 'McLaren', wins: 3, podiums: 21, qualifying: 92, tireManagement: 89, wetWeather: 85, overtaking: 90 },
    { id: 'fernando', name: 'Fernando Alonso', team: 'Aston Martin', wins: 32, podiums: 106, qualifying: 90, tireManagement: 95, wetWeather: 94, overtaking: 96 },
  ];

  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(['max', 'lewis']);

  const toggleDriverSelection = (id: string) => {
    if (selectedDrivers.includes(id)) {
      if (selectedDrivers.length > 1) {
        setSelectedDrivers(selectedDrivers.filter((d) => d !== id));
      }
    } else {
      if (selectedDrivers.length < 5) {
        setSelectedDrivers([...selectedDrivers, id]);
      }
    }
  };

  const activeProfiles = drivers.filter((p) => selectedDrivers.includes(p.id));

  return (
    <div className="f1-analysis rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp size={24} className="text-red-500" />
          Driver Comparison Matrix
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Compare traits, telemetry predictions, and structural profiles for elite racers.
        </p>
      </div>

      {/* Selector Checkboxes */}
      <div className="flex flex-wrap gap-2">
        {drivers.map((d) => {
          const isSelected = selectedDrivers.includes(d.id);
          return (
            <button
              key={d.id}
              onClick={() => toggleDriverSelection(d.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isSelected
                  ? 'border-red-600 bg-red-600/10 text-slate-100 shadow-md'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isSelected && <CheckCircle2 size={12} className="text-red-500" />}
              {d.name}
            </button>
          );
        })}
      </div>

      {/* Comparison visual bars */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Metric 1: Wins */}
        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800/80">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <Award size={14} className="text-yellow-500" /> Total Grand Prix Wins
          </h3>
          <div className="space-y-3">
            {activeProfiles.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>{p.name}</span>
                  <span>{p.wins} Wins</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded transition-all duration-1000"
                    style={{ width: `${Math.min(100, (p.wins / 105) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric 2: Overtaking Pace */}
        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800/80">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <Zap size={14} className="text-amber-500" /> Overtaking Capability
          </h3>
          <div className="space-y-3">
            {activeProfiles.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>{p.name}</span>
                  <span>{p.overtaking}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded transition-all duration-1000"
                    style={{ width: `${p.overtaking}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric 3: Tire Management */}
        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800/80">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <TrendingUp size={14} className="text-emerald-500" /> Tire Management
          </h3>
          <div className="space-y-3">
            {activeProfiles.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>{p.name}</span>
                  <span>{p.tireManagement}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded transition-all duration-1000"
                    style={{ width: `${p.tireManagement}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric 4: Wet Weather */}
        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800/80">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <ShieldAlert size={14} className="text-blue-400" /> Wet Weather Resilience
          </h3>
          <div className="space-y-3">
            {activeProfiles.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>{p.name}</span>
                  <span>{p.wetWeather}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded transition-all duration-1000"
                    style={{ width: `${p.wetWeather}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

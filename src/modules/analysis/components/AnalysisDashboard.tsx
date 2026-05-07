import React, { useState, useMemo } from 'react';
import { Award, Zap, TrendingUp, ShieldAlert, X, ChevronDown } from 'lucide-react';
import './analysis.scss';

interface DriverProfile {
  id: string;
  name: string;
  team: string;
  wins: number;
  podiums: number;
  qualifying: number;
  tireManagement: number;
  wetWeather: number;
  overtaking: number;
}

const ALL_DRIVERS: DriverProfile[] = [
  { id: 'max', name: 'Max Verstappen', team: 'Red Bull Racing', wins: 61, podiums: 106, qualifying: 95, tireManagement: 92, wetWeather: 98, overtaking: 94 },
  { id: 'lewis', name: 'Lewis Hamilton', team: 'Ferrari', wins: 105, podiums: 201, qualifying: 98, tireManagement: 96, wetWeather: 97, overtaking: 95 },
  { id: 'charles', name: 'Charles Leclerc', team: 'Ferrari', wins: 7, podiums: 36, qualifying: 97, tireManagement: 85, wetWeather: 88, overtaking: 92 },
  { id: 'lando', name: 'Lando Norris', team: 'McLaren', wins: 3, podiums: 21, qualifying: 92, tireManagement: 89, wetWeather: 85, overtaking: 90 },
  { id: 'fernando', name: 'Fernando Alonso', team: 'Aston Martin', wins: 32, podiums: 106, qualifying: 90, tireManagement: 95, wetWeather: 94, overtaking: 96 },
  { id: 'oscar', name: 'Oscar Piastri', team: 'McLaren', wins: 2, podiums: 9, qualifying: 88, tireManagement: 91, wetWeather: 86, overtaking: 89 },
  { id: 'carlos', name: 'Carlos Sainz', team: 'Williams', wins: 3, podiums: 26, qualifying: 89, tireManagement: 93, wetWeather: 90, overtaking: 91 },
  { id: 'george', name: 'George Russell', team: 'Mercedes', wins: 3, podiums: 14, qualifying: 91, tireManagement: 88, wetWeather: 89, overtaking: 88 },
];

export const AnalysisDashboard: React.FC = () => {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(['max', 'lewis']);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDriverSelection = (id: string) => {
    if (selectedDrivers.includes(id)) {
      setSelectedDrivers(selectedDrivers.filter((d) => d !== id));
    } else {
      if (selectedDrivers.length < 5) {
        setSelectedDrivers([...selectedDrivers, id]);
      }
    }
  };

  const removeDriver = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedDrivers.length > 1) {
      setSelectedDrivers(selectedDrivers.filter((d) => d !== id));
    }
  };

  const activeProfiles = useMemo(
    () => ALL_DRIVERS.filter((p) => selectedDrivers.includes(p.id)),
    [selectedDrivers]
  );

  const availableDrivers = ALL_DRIVERS.filter((d) => !selectedDrivers.includes(d.id));

  const getBarWidth = (value: number, max: number = 100) => {
    return Math.min(100, (value / max) * 100);
  };

  return (
    <div className="f1-analysis rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp size={24} className="text-red-500" />
          Driver Comparison Matrix
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select up to 5 drivers to compare traits, telemetry predictions, and structural profiles.
        </p>
      </div>

      {/* Driver Selection Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-750 transition-colors"
        >
          <span className="text-slate-400">
            {availableDrivers.length === 0 ? 'All drivers selected' : 'Add driver to compare...'}
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 shadow-2xl max-h-60 overflow-y-auto">
            {availableDrivers.map((driver) => (
              <button
                key={driver.id}
                onClick={() => {
                  toggleDriverSelection(driver.id);
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <span>{driver.name}</span>
                <span className="text-xs text-slate-400">{driver.team}</span>
              </button>
            ))}
            {availableDrivers.length === 0 && (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">
                Maximum 5 drivers reached
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Driver Chips */}
      <div className="flex flex-wrap gap-2">
        {activeProfiles.map((driver) => (
          <div
            key={driver.id}
            className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-slate-100"
          >
            <span className="truncate max-w-[120px]">{driver.name}</span>
            {selectedDrivers.length > 1 && (
              <button
                onClick={(e) => removeDriver(driver.id, e)}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors"
              >
                <X size={10} className="text-red-400" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Visual Bars */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800/80">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <Award size={14} className="text-yellow-500" /> Total Grand Prix Wins
          </h3>
          <div className="space-y-3">
            {activeProfiles.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span className="truncate max-w-[140px]">{p.name}</span>
                  <span>{p.wins} Wins</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="bar-fill bar-fill--red"
                    style={{ '--bar-width': `${getBarWidth(p.wins, 105)}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800/80">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <Zap size={14} className="text-amber-500" /> Overtaking Capability
          </h3>
          <div className="space-y-3">
            {activeProfiles.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span className="truncate max-w-[140px]">{p.name}</span>
                  <span>{p.overtaking}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="bar-fill bar-fill--overtake"
                    style={{ '--bar-width': `${p.overtaking}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800/80">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <TrendingUp size={14} className="text-emerald-500" /> Tire Management
          </h3>
          <div className="space-y-3">
            {activeProfiles.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span className="truncate max-w-[140px]">{p.name}</span>
                  <span>{p.tireManagement}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="bar-fill bar-fill--tire"
                    style={{ '--bar-width': `${p.tireManagement}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800/80">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <ShieldAlert size={14} className="text-blue-400" /> Wet Weather Resilience
          </h3>
          <div className="space-y-3">
            {activeProfiles.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span className="truncate max-w-[140px]">{p.name}</span>
                  <span>{p.wetWeather}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="bar-fill bar-fill--wet"
                    style={{ '--bar-width': `${p.wetWeather}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeProfiles.length === 0 && (
        <div className="text-center py-8 text-xs text-slate-500 border border-slate-800/40 rounded-xl bg-slate-950/10">
          Select at least one driver to view comparison metrics.
        </div>
      )}
    </div>
  );
};

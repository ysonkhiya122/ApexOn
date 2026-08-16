import React, { useState } from 'react';
import { Award, Star, History, Trophy } from 'lucide-react';
import './hall-of-fame.scss';

interface LegendProfile {
  id: string;
  name: string;
  titles: number;
  activeYears: string;
  legacy: string;
  details: string;
}

export const HallOfFame: React.FC = () => {
  const legends: LegendProfile[] = [
    {
      id: 'michael',
      name: 'Michael Schumacher',
      titles: 7,
      activeYears: '1991–2012',
      legacy: 'Unrivaled precision & tactical discipline.',
      details: 'Commanded the scarlet Ferrari into unmatched golden eras.',
    },
    {
      id: 'ayrton',
      name: 'Ayrton Senna',
      titles: 3,
      activeYears: '1984–1994',
      legacy: 'Absolute raw pace & uncompromised charisma.',
      details: 'His wet weather masterclasses at Donington 1993 define history.',
    },
    {
      id: 'lewis',
      name: 'Lewis Hamilton',
      titles: 7,
      activeYears: '2007–Present',
      legacy: 'Boundary-breaking consistency & activism.',
      details: 'Broke all-time pole position records while matching Schumacher.',
    },
    {
      id: 'juan',
      name: 'Juan Manuel Fangio',
      titles: 5,
      activeYears: '1950–1958',
      legacy: 'The original maestro of motorsport limits.',
      details: 'Claimed 5 titles across 4 contrasting manufacturer networks.',
    },
  ];

  const [activeLegend, setActiveLegend] = useState<string>('michael');
  const currentLegend = legends.find((l) => l.id === activeLegend) || legends[0];

  return (
    <div className="f1-hall-of-fame rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Star className="text-yellow-500 animate-pulse" size={24} />
        <div>
          <h2 className="text-xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
            Hall of Fame
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Honoring exceptional individuals establishing racing standards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          {legends.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLegend(l.id)}
              className={`text-left p-3 rounded-lg border transition-all cursor-pointer font-medium text-sm flex items-center justify-between ${
                activeLegend === l.id
                  ? 'bg-red-600 border-red-500 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <span>{l.name}</span>
              <Trophy
                size={16}
                className={activeLegend === l.id ? 'text-white' : 'text-slate-600'}
              />
            </button>
          ))}
        </div>

        <div className="md:col-span-2 rounded-xl bg-slate-950 p-5 border border-slate-800/80 relative overflow-hidden flex flex-col justify-between shadow-inner">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 bg-yellow-500/5 blur-3xl rounded-full" />

          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <h3 className="text-xl font-black italic text-slate-100">{currentLegend.name}</h3>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                <Award size={14} /> {currentLegend.titles} Championships
              </div>
            </div>

            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold tracking-wider mb-4">
              <History size={14} className="text-red-500" /> ACTIVE: {currentLegend.activeYears}
            </span>

            <p className="text-sm font-bold text-red-400 mb-2 leading-snug">
              {currentLegend.legacy}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{currentLegend.details}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/40 text-xxs font-bold text-slate-500 uppercase tracking-widest">
            Data sourced independently via Apexon criteria.
          </div>
        </div>
      </div>
    </div>
  );
};

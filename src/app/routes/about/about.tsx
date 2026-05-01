import React, { useState } from 'react';
import { Badge } from '../../../components/atoms/badge';
import { History, Trophy, Award } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import './about.scss';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  era: 'Vintage' | 'Turbo' | 'Modern';
}

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeEra, setActiveEra] = useState<'All' | 'Vintage' | 'Turbo' | 'Modern'>('All');

  const milestones: TimelineEvent[] = [
    {
      year: '1950',
      title: 'The Inaugural Championship',
      description: 'The first official F1 World Championship race takes place at Silverstone, England. Giuseppe Farina takes the crown.',
      era: 'Vintage',
    },
    {
      year: '1970',
      title: 'Aerodynamic Innovations',
      description: 'Lotus introduces the iconic ground-effect concept, revolutionizing racecar downforce metrics exponentially.',
      era: 'Vintage',
    },
    {
      year: '1988',
      title: 'Senna vs Prost Rivalry',
      description: 'McLaren-Honda captures 15 out of 16 GPs in a season fueled by aggressive engine limits and supreme internal competition.',
      era: 'Turbo',
    },
    {
      year: '2014',
      title: 'V6 Turbo Hybrid Era',
      description: 'Shift from classic fuel formats into modern hybrid recovery setups. Mercedes begins unprecedented dominance.',
      era: 'Turbo',
    },
    {
      year: '2022',
      title: 'Return of Ground Effect',
      description: 'Massive regulations remodel aiming to promote closer wheel-to-wheel battles across narrow street circuits.',
      era: 'Modern',
    },
  ];

  const eras = [
    { id: 'All', name: t('about.full_legacy') },
    { id: 'Vintage', name: t('about.vintage') },
    { id: 'Turbo', name: t('about.turbo') },
    { id: 'Modern', name: t('about.modern') },
  ];

  const filteredMilestones =
    activeEra === 'All' ? milestones : milestones.filter((m) => m.era === activeEra);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 text-slate-100 space-y-12 pb-16">
      <div className="text-center space-y-3">
        <Badge variant="red" className="text-xs uppercase tracking-widest font-bold">
          {t('about.chronology')}
        </Badge>
        <h1 className="text-4xl font-black italic tracking-tighter text-white sm:text-5xl uppercase">
          {t('about.title')}
        </h1>
        <p className="mx-auto max-w-xl text-slate-400 text-sm sm:text-base">
          {t('about.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 border-b border-slate-800 pb-4">
        {eras.map((era) => (
          <button
            key={era.id}
            onClick={() => setActiveEra(era.id as any)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              activeEra === era.id
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100'
            }`}
          >
            {era.name}
          </button>
        ))}
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 space-y-10 py-4">
        {filteredMilestones.map((item, idx) => (
          <div key={idx} className="relative pl-8 group">
            <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-slate-950 bg-red-600 group-hover:scale-125 transition-transform duration-200" />

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg group-hover:border-slate-700 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xl font-black text-red-500">{item.year}</span>
                <Badge variant="slate" className="text-xxs uppercase tracking-wider font-bold">
                  {item.era}
                </Badge>
              </div>
              <h3 className="text-base font-extrabold text-slate-100 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
        {[
          { icon: Trophy, count: '10+', label: 'Teams Competing' },
          { icon: Award, count: '20', label: 'Races Annually' },
          { icon: History, count: '70+ Yrs', label: 'Racing Heritage' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 flex flex-col items-center gap-2">
              <Icon className="text-red-500" size={28} />
              <div className="font-mono text-2xl font-black text-slate-100">{stat.count}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Badge } from '../../../components/atoms/badge';
import { ShieldCheck, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import './rules.scss';

interface Rule {
  id: string;
  category: 'Sporting' | 'Technical';
  title: string;
  summary: string;
  details: string[];
}

export const RulesPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCat, setSelectedCat] = useState<'All' | 'Sporting' | 'Technical'>('All');
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const rulebook: Rule[] = [
    {
      id: 'pts',
      category: 'Sporting',
      title: 'Point Allocation Breakdown',
      summary: 'Only the leading 10 finishers earn standard grand prix points.',
      details: [
        '1st Place: 25 pts | 2nd Place: 18 pts | 3rd Place: 15 pts',
        '4th: 12 pts | 5th: 10 pts | 6th: 8 pts | 7th: 6 pts | 8th: 4 pts | 9th: 2 pts | 10th: 1 pt',
        'Fastest Lap Bonus: 1 extra point awarded if the driver clears in top 10.',
      ],
    },
    {
      id: 'tire',
      category: 'Technical',
      title: 'Tire Compound Regulations',
      summary: 'Teams must utilize multiple compound formats on dry runs.',
      details: [
        'Pirelli distributes 3 dry compounds each weekend (Soft, Medium, Hard).',
        'Mandatory usage of at least two unique sets throughout complete races.',
        'Wet weather formats bypass selection limits.',
      ],
    },
    {
      id: 'budget',
      category: 'Technical',
      title: 'Financial Cost Cap Thresholds',
      summary: 'Restricting annual team capital outputs to secure equal playing bounds.',
      details: [
        'Total seasonal allocations capped near roughly $135 million.',
        'Excludes driver wages, marketing funds, and administrative benefits.',
      ],
    },
    {
      id: 'penalties',
      category: 'Sporting',
      title: 'Drive-Through & Grid Penalties',
      summary: 'Standardized enforcement policies correcting dangerous behaviors.',
      details: [
        '5-second or 10-second stop penalties served inside pitboxes.',
        'Engine parts replacement above legal quotas triggers trailing grid assignments.',
      ],
    },
  ];

  const filteredRules = selectedCat === 'All' ? rulebook : rulebook.filter((r) => r.category === selectedCat);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-slate-100 space-y-10 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight uppercase text-red-500 flex items-center gap-2">
          <ShieldCheck size={32} />
          {t('nav.rules')}
        </h1>
        <p className="text-slate-400 text-sm">
          A summarized compilation of crucial parameters establishing modern grand prix racing logic.
        </p>
      </div>

      <div className="flex gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg w-fit">
        {(['All', 'Sporting', 'Technical'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCat(cat);
              setExpandedRule(null);
            }}
            className={`rounded-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCat === cat
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRules.map((rule) => {
          const isExpanded = expandedRule === rule.id;
          return (
            <div
              key={rule.id}
              className={`rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden transition-all ${
                isExpanded ? 'border-red-500/40 bg-slate-900/50 shadow-red-500/5 shadow-md' : 'hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={rule.category === 'Sporting' ? 'blue' : 'yellow'} className="font-bold text-xxs">
                      {rule.category}
                    </Badge>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-100">{rule.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{rule.summary}</p>
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700/60 text-slate-400 text-xs font-bold uppercase tracking-widest font-mono">
                  {isExpanded ? 'Collapse' : 'Expand'}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 bg-slate-950/20">
                  <h4 className="text-xs font-black tracking-widest text-red-400 uppercase mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} /> Comprehensive Details
                  </h4>
                  <ul className="space-y-2">
                    {rule.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={14} />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 flex gap-3 text-sm text-slate-300">
        <HelpCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
        <p>
          Need targeted specifics? Open the floating **AI Chatbot Dock** at the lower viewport corner to clarify standard sporting inquiries efficiently.
        </p>
      </div>
    </div>
  );
};

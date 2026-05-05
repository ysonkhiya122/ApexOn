import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { ShieldAlert } from 'lucide-react';
import './error.scss';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="f1-error-view flex flex-col items-center justify-center min-h-[70vh] px-4 text-center text-slate-100">
      <div className="p-4 rounded-full bg-red-600/10 border border-red-500/20 mb-6">
        <ShieldAlert className="text-red-500 animate-bounce" size={48} />
      </div>
      <h2 className="text-4xl font-extrabold text-red-500 uppercase tracking-tight">{t('error.box')}</h2>
      <p className="mt-2 text-slate-400 max-w-sm">{t('error.pit_stop')}</p>
      
      <Link to="/" className="mt-8">
        <button className="h-10 px-5 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-colors cursor-pointer">
          {t('error.back')}
        </button>
      </Link>
    </div>
  );
};

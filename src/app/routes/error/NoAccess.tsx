import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { ShieldAlert } from 'lucide-react';
import './error.scss';

export const NoAccess: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="f1-error-view flex flex-col items-center justify-center min-h-[70vh] px-4 text-center text-slate-100">
      <div className="p-4 rounded-full bg-yellow-600/10 border border-yellow-500/20 mb-6">
        <ShieldAlert className="text-yellow-500 animate-pulse" size={48} />
      </div>
      <h2 className="text-4xl font-extrabold text-yellow-500 uppercase tracking-tight">{t('error.oversteer')}</h2>
      <p className="mt-2 text-slate-400 max-w-sm">{t('error.no_access')}</p>
      
      <Link to="/" className="mt-8">
        <button className="h-10 px-5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-100 font-medium transition-colors cursor-pointer">
          {t('error.back')}
        </button>
      </Link>
    </div>
  );
};

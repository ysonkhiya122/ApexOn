import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import './error.scss';

export const NoAccess: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="f1-error-view flex min-h-[70vh] flex-col items-center justify-center px-4 text-center text-slate-100">
      <div className="error-icon-wrapper mb-6 rounded-full border border-yellow-500/20 bg-yellow-600/10 p-4">
        <ShieldAlert className="animate-pulse text-yellow-500" size={48} aria-hidden="true" />
      </div>
      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-yellow-500">
        {t('error.oversteer')}
      </h1>
      <p className="mt-2 max-w-sm text-slate-400">{t('error.no_access')}</p>

      <Link to="/" className="mt-8">
        <button
          type="button"
          className="error-button h-10 cursor-pointer rounded border border-slate-700 bg-slate-800 px-5 font-medium text-slate-100 transition-colors hover:bg-slate-700"
        >
          {t('error.back')}
        </button>
      </Link>
    </div>
  );
};

export default NoAccess;

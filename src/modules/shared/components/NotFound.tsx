import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import './error.scss';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="f1-error-view flex min-h-[70vh] flex-col items-center justify-center px-4 text-center text-slate-100">
      <div className="error-icon-wrapper mb-6 rounded-full border border-red-500/20 bg-red-600/10 p-4">
        <ShieldAlert className="animate-bounce text-red-500" size={48} aria-hidden="true" />
      </div>
      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-red-500">
        {t('error.box')}
      </h1>
      <p className="mt-2 max-w-sm text-slate-400">{t('error.pit_stop')}</p>

      <Link to="/" className="mt-8">
        <button
          type="button"
          className="error-button h-10 cursor-pointer rounded bg-red-600 px-5 font-medium text-white transition-colors hover:bg-red-700"
        >
          {t('error.back')}
        </button>
      </Link>
    </div>
  );
};

export default NotFound;

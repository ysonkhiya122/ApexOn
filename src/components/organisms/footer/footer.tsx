import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import './footer.scss';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="f1-footer border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-xl font-black italic text-red-600">APEXON</span>
            <p className="text-sm text-slate-400">
              {t('footer.desc')}
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-100">{t('footer.links')}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-red-500">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-red-500">
                  {t('nav.schedule')}
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-red-500">
                  {t('nav.results')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn & Play */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-100">{t('footer.guides')}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/rules" className="hover:text-red-500">
                  {t('nav.rules')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-red-500">
                  {t('nav.games')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Attribution */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-100">{t('footer.data_src')}</h3>
            <p className="mt-4 text-xs leading-relaxed">
              Open-source insights provided courtesy of the{' '}
              <a href="https://jolpi.ca/" target="_blank" rel="noreferrer" className="text-red-400 hover:underline">
                Jolpica Ergast
              </a>{' '}
              and{' '}
              <a href="https://openf1.org/" target="_blank" rel="noreferrer" className="text-red-400 hover:underline">
                OpenF1 API
              </a>
              . This portal remains an unofficial product.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs">
          <p>&copy; {currentYear} Apexon Inc. {t('hero.tagline')} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

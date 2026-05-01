import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Calendar, Info, BookOpen, BarChart3, Gamepad2, User, Globe } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setLanguage, LanguageCode } from '../../../store/slices/languageSlice';
import { useTranslation } from '../../../hooks/useTranslation';
import './header.scss';

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { t, currentLang } = useTranslation();
  const profile = useSelector((state: RootState) => state.fanProfile);

  const navItems = [
    { name: t('nav.home'), path: '/', icon: Trophy },
    { name: t('nav.schedule'), path: '/schedule', icon: Calendar },
    { name: t('nav.results'), path: '/results', icon: BarChart3 },
    { name: t('nav.rules'), path: '/rules', icon: BookOpen },
    { name: t('nav.about'), path: '/about', icon: Info },
    { name: t('nav.games'), path: '/games', icon: Gamepad2 },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value as LanguageCode));
  };

  return (
    <header className="f1-header sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-black italic tracking-tighter text-red-600">
            APEXON
          </span>
          <span className="hidden text-xs font-semibold uppercase tracking-widest text-slate-400 sm:block">
            {t('hero.tagline')}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-red-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Language picker + Profile */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Language picker */}
          <div className="flex items-center gap-1.5 text-slate-400 border border-slate-800 bg-slate-900 rounded-md px-2.5 py-1">
            <Globe size={14} className="text-slate-500" />
            <select
              value={currentLang}
              onChange={handleLangChange}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer font-bold"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
            </select>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400">{profile.level}</div>
            <div className="text-xs text-red-500 font-bold">{profile.points} XP</div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            <User size={16} />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <select
            value={currentLang}
            onChange={handleLangChange}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded focus:outline-none font-bold"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
          </select>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded p-2 text-slate-300 hover:bg-slate-800 focus:outline-none"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-900 md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded px-3 py-2.5 text-base font-medium transition-colors ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-slate-800 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                <User size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-200">{profile.level}</div>
                <div className="text-xs text-slate-400">{profile.points} XP</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Calendar, BarChart3, ChevronDown, Users, MapPin, BookOpen, Info, Gamepad2, User, Globe } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setLanguage, LanguageCode } from '../../../store/slices/languageSlice';
import { useTranslation } from '../../../hooks/useTranslation';
import './header.scss';

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [championshipOpen, setChampionshipOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { t, currentLang } = useTranslation();
  const profile = useSelector((state: RootState) => state.fanProfile);

  const primaryNav = [
    { name: t('nav.home'), path: '/', icon: Trophy },
    { name: t('nav.schedule'), path: '/schedule', icon: Calendar },
    { name: t('nav.results'), path: '/results', icon: BarChart3 },
    { name: t('nav.standings'), path: '/standings', icon: Trophy },
  ];

  const championshipNav = [
    { name: t('nav.drivers'), path: '/drivers', icon: Users },
    { name: t('nav.teams'), path: '/teams', icon: Users },
    { name: t('nav.circuits'), path: '/circuits', icon: MapPin },
  ];

  const moreNav = [
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
    <header className="f1-header">
      <div className="f1-header__container">
        {/* Logo */}
        <Link to="/" className="f1-header__logo">
          <span className="f1-header__logo-text">APEXON</span>
          <span className="f1-header__tagline">{t('hero.tagline')}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="f1-header__nav">
          {/* Primary Navigation */}
          <div className="f1-header__primary">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`f1-header__link ${active ? 'f1-header__link--active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Championship Dropdown */}
          <div className="f1-header__dropdown" onMouseLeave={() => setChampionshipOpen(false)}>
            <button
              className="f1-header__dropdown-trigger"
              onClick={() => setChampionshipOpen(!championshipOpen)}
              onMouseEnter={() => setChampionshipOpen(true)}
            >
              <Users size={16} />
              <span>Championship</span>
              <ChevronDown size={14} className={`f1-header__chevron ${championshipOpen ? 'f1-header__chevron--open' : ''}`} />
            </button>
            <div className={`f1-header__menu ${championshipOpen ? 'f1-header__menu--open' : ''}`}>
              {championshipNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`f1-header__menu-link ${active ? 'f1-header__menu-link--active' : ''}`}
                  >
                    <Icon size={14} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* More Dropdown */}
          <div className="f1-header__dropdown" onMouseLeave={() => setMoreOpen(false)}>
            <button
              className="f1-header__dropdown-trigger"
              onClick={() => setMoreOpen(!moreOpen)}
              onMouseEnter={() => setMoreOpen(true)}
            >
              <span>More</span>
              <ChevronDown size={14} className={`f1-header__chevron ${moreOpen ? 'f1-header__chevron--open' : ''}`} />
            </button>
            <div className={`f1-header__menu ${moreOpen ? 'f1-header__menu--open' : ''}`}>
              {moreNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`f1-header__menu-link ${active ? 'f1-header__menu-link--active' : ''}`}
                  >
                    <Icon size={14} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Language picker + Profile */}
        <div className="f1-header__actions">
          <div className="f1-header__lang">
            <Globe size={14} className="f1-header__lang-icon" />
            <select
              value={currentLang}
              onChange={handleLangChange}
              className="f1-header__lang-select"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
            </select>
          </div>
          <div className="f1-header__profile">
            <div className="f1-header__level">{profile.level}</div>
            <div className="f1-header__xp">{profile.points} XP</div>
            <div className="f1-header__avatar">
              <User size={16} />
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="f1-header__mobile-toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="f1-header__mobile">
          <div className="f1-header__mobile-section">
            <div className="f1-header__mobile-title">Main Menu</div>
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`f1-header__mobile-link ${active ? 'f1-header__mobile-link--active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="f1-header__mobile-section">
            <div className="f1-header__mobile-title">Championship</div>
            {championshipNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`f1-header__mobile-link ${active ? 'f1-header__mobile-link--active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="f1-header__mobile-section">
            <div className="f1-header__mobile-title">More</div>
            {moreNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`f1-header__mobile-link ${active ? 'f1-header__mobile-link--active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="f1-header__mobile-footer">
            <div className="f1-header__mobile-profile">
              <div className="f1-header__mobile-avatar">
                <User size={20} />
              </div>
              <div>
                <div className="f1-header__mobile-level">{profile.level}</div>
                <div className="f1-header__mobile-xp">{profile.points} XP</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

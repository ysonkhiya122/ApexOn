import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import { Header } from './components/organisms/header';
import { Footer } from './components/organisms/footer';
import { Preloader } from './components/organisms/preloader';
import { ChatDock } from './modules/ai';
import { RaceCenterPage } from './modules/race-center';
import { RaceCenterTest } from './modules/race-center/pages/RaceCenterTest';
import { LeaderboardTest } from './modules/race-center/pages/LeaderboardTest';
import { LiveDebugPage } from './modules/race-center/pages/LiveDebugPage';
import { LoginForm, RegisterForm } from './components/auth';

// Lazy loaded module routes
const HomePage = lazy(() => import('./modules/home'));
const SchedulePage = lazy(() => import('./modules/schedule'));
const ResultsPage = lazy(() => import('./modules/results'));
const RulesPage = lazy(() => import('./modules/rules'));
const AboutPage = lazy(() => import('./modules/history'));
const GamesPage = lazy(() => import('./modules/games'));
const DriversPage = lazy(() => import('./modules/drivers'));
const DriverDetail = lazy(() => import('./modules/drivers/pages/DriverDetail'));
const TeamsPage = lazy(() => import('./modules/teams'));
const TeamDetail = lazy(() => import('./modules/teams/pages/TeamDetail'));
const CircuitsPage = lazy(() => import('./modules/circuits'));
const CircuitDetail = lazy(() => import('./modules/circuits/pages/CircuitDetail'));
const StandingsPage = lazy(() => import('./modules/standings'));
const NoAccess = lazy(() => import('./modules/shared').then(m => ({ default: m.NoAccess })));
const NotFound = lazy(() => import('./modules/shared').then(m => ({ default: m.NotFound })));

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-red-600 selection:text-white">
          <Preloader />
          <Header />
          <main className="flex-1">
            <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 font-mono">WARMING TIRES...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/drivers" element={<DriversPage />} />
                <Route path="/drivers/:driverId" element={<DriverDetail />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/teams/:teamId" element={<TeamDetail />} />
                <Route path="/circuits" element={<CircuitsPage />} />
                <Route path="/circuits/:circuitId" element={<CircuitDetail />} />
                <Route path="/standings" element={<StandingsPage />} />
                <Route path="/race-center" element={<RaceCenterPage />} />
                <Route path="/race-center/test" element={<RaceCenterTest />} />
                <Route path="/race-center/test-leaderboard" element={<LeaderboardTest />} />
                <Route path="/race-center/debug" element={<LiveDebugPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/403" element={<NoAccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ChatDock />
        </div>
      </Router>
    </Provider>
  );
}

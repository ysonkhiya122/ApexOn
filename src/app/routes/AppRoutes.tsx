import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginForm, RegisterForm } from '../../components/auth';
import { AboutPage } from './about';
import { GamesPage } from './games';
import { HomePage } from './home';
import { ResultsPage } from './results';
import { RulesPage } from './rules';
import { SchedulePage } from './schedule';
import { StandingsPage } from './standings';

const DriversPage = lazy(() => import('./drivers/drivers'));
const DriverDetail = lazy(() => import('./drivers/driver-detail'));
const TeamsPage = lazy(() => import('./teams/teams'));
const TeamDetail = lazy(() => import('./teams/team-detail'));
const CircuitsPage = lazy(() => import('./circuits/circuits'));
const CircuitDetail = lazy(() => import('./circuits/circuit-detail'));
const RaceCenterModule = lazy(() => import('./race-center/race-center'));
const RaceCenterTest = lazy(() => import('./race-center/race-center-test'));
const LeaderboardTest = lazy(() => import('./race-center/leaderboard-test'));
const LiveDebugPage = lazy(() => import('./race-center/live-debug'));
const NoAccess = lazy(() => import('../../modules/shared').then((module) => ({ default: module.NoAccess })));
const NotFound = lazy(() => import('../../modules/shared').then((module) => ({ default: module.NotFound })));

const RouteFallback = () => (
  <div className="p-8 text-center font-mono text-xs text-slate-500">WARMING TIRES...</div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
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
        <Route path="/race-center" element={<RaceCenterModule />} />
        <Route path="/race-center/test" element={<RaceCenterTest />} />
        <Route path="/race-center/test-leaderboard" element={<LeaderboardTest />} />
        <Route path="/race-center/debug" element={<LiveDebugPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/403" element={<NoAccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../../modules/home';
import { DEV_ROUTES, ROUTES } from './paths';

/**
 * Only the landing page ships in the initial bundle. Every other route is
 * code-split so a first visit downloads the home view and nothing else.
 */
const SchedulePage = lazy(() => import('../../modules/schedule'));
const ResultsPage = lazy(() => import('../../modules/results'));
const RulesPage = lazy(() => import('../../modules/rules'));
const AboutPage = lazy(() => import('../../modules/history'));
const GamesPage = lazy(() => import('../../modules/games'));
const StandingsPage = lazy(() => import('../../modules/standings'));

const DriversPage = lazy(() => import('../../modules/drivers/pages/DriversPage'));
const DriverDetail = lazy(() => import('../../modules/drivers/pages/DriverDetail'));
const TeamsPage = lazy(() => import('../../modules/teams/pages/TeamsPage'));
const TeamDetail = lazy(() => import('../../modules/teams/pages/TeamDetail'));
const CircuitsPage = lazy(() => import('../../modules/circuits/pages/CircuitsPage'));
const CircuitDetail = lazy(() => import('../../modules/circuits/pages/CircuitDetail'));

const RaceCenterPage = lazy(() => import('../../modules/race-center/pages/RaceCenterPage'));
// Diagnostic screens ship only in development. `import.meta.env.DEV` folds to
// `false` at build time, so Rollup drops both the branch and the chunk.
const RaceCenterTest = import.meta.env.DEV
  ? lazy(() => import('../../modules/race-center/pages/RaceCenterTest'))
  : null;
const LeaderboardTest = import.meta.env.DEV
  ? lazy(() => import('../../modules/race-center/pages/LeaderboardTest'))
  : null;
const LiveDebugPage = import.meta.env.DEV
  ? lazy(() => import('../../modules/race-center/pages/LiveDebugPage'))
  : null;

const LoginForm = lazy(() =>
  import('../../components/auth').then((m) => ({ default: m.LoginForm }))
);
const RegisterForm = lazy(() =>
  import('../../components/auth').then((m) => ({ default: m.RegisterForm }))
);
const NoAccess = lazy(() =>
  import('../../modules/shared').then((module) => ({ default: module.NoAccess }))
);
const NotFound = lazy(() =>
  import('../../modules/shared').then((module) => ({ default: module.NotFound }))
);

const RouteFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="p-8 text-center font-mono text-xs text-slate-400"
  >
    WARMING TIRES...
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
        <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
        <Route path={ROUTES.RULES} element={<RulesPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.GAMES} element={<GamesPage />} />
        <Route path={ROUTES.DRIVERS} element={<DriversPage />} />
        <Route path={`${ROUTES.DRIVERS}/:driverId`} element={<DriverDetail />} />
        <Route path={ROUTES.TEAMS} element={<TeamsPage />} />
        <Route path={`${ROUTES.TEAMS}/:teamId`} element={<TeamDetail />} />
        <Route path={ROUTES.CIRCUITS} element={<CircuitsPage />} />
        <Route path={`${ROUTES.CIRCUITS}/:circuitId`} element={<CircuitDetail />} />
        <Route path={ROUTES.STANDINGS} element={<StandingsPage />} />
        <Route path={ROUTES.RACE_CENTER} element={<RaceCenterPage />} />
        {RaceCenterTest && LeaderboardTest && LiveDebugPage && (
          <>
            <Route path={DEV_ROUTES.RACE_CENTER_TEST} element={<RaceCenterTest />} />
            <Route path={DEV_ROUTES.LEADERBOARD_TEST} element={<LeaderboardTest />} />
            <Route path={DEV_ROUTES.LIVE_DEBUG} element={<LiveDebugPage />} />
          </>
        )}
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
        <Route path={ROUTES.NO_ACCESS} element={<NoAccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

import { Suspense, lazy } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Header } from '../components/organisms/header';
import { Footer } from '../components/organisms/footer';
import { Preloader } from '../components/organisms/preloader';
import { AppRoutes } from './routes/AppRoutes';

// Floating assistant is never needed for first paint — defer it off the
// critical path so it doesn't tax the initial download.
const ChatDock = lazy(() => import('../modules/ai').then((m) => ({ default: m.ChatDock })));

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-red-600 selection:text-white">
          <Preloader />
          <Header />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
          <Suspense fallback={null}>
            <ChatDock />
          </Suspense>
        </div>
      </Router>
    </Provider>
  );
}

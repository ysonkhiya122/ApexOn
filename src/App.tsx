import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import { Header } from './components/organisms/header';
import { Footer } from './components/organisms/footer';
import { Preloader } from './components/organisms/Preloader';

import { HomePage } from './app/routes/home';
import { SchedulePage } from './app/routes/schedule';
import { ResultsPage } from './app/routes/results';
import { RulesPage } from './app/routes/rules';
import { AboutPage } from './app/routes/about';
import { GamesPage } from './app/routes/games';
import { ChatDock } from './features/chat/ChatDock';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-red-600 selection:text-white">
          <Preloader />
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route
                path="*"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-100">
                    <h2 className="text-4xl font-extrabold text-red-500 uppercase">404</h2>
                    <p className="mt-2 text-slate-400">Box, box! This route does not exist.</p>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ChatDock />
        </div>
      </Router>
    </Provider>
  );
}

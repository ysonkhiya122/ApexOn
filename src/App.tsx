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
import { NotFound, NoAccess } from './app/routes/error';
import { ChatDock } from './features/chat';

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
              <Route path="/403" element={<NoAccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ChatDock />
        </div>
      </Router>
    </Provider>
  );
}

import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Header } from '../components/organisms/header';
import { Footer } from '../components/organisms/footer';
import { Preloader } from '../components/organisms/preloader';
import { ChatDock } from '../modules/ai';
import { AppRoutes } from './routes/AppRoutes';

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
          <ChatDock />
        </div>
      </Router>
    </Provider>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LaudiaPage from './app/laudia/page';
import TodayPage from './app/laudia/today/page';
import PrayPage from './app/laudia/pray/page';
import CalendarPage from './app/laudia/calendar/page';
import EvangelioPage from './app/laudia/evangelio/page';
import LibraryPage from './app/laudia/library/page';
import LiturgiaPage from './app/laudia/liturgia/page';
import SettingsPage from './app/laudia/settings/page';
import MorePage from './app/laudia/more/page';
import LandingPage from './app/landing/page';
import { SwUpdatePrompt } from './components/laudia/SwUpdatePrompt';
import { PreferenceEffects } from './components/laudia/PreferenceEffects';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen">
        <PreferenceEffects />
        <SwUpdatePrompt />
        <Routes>
          <Route path="/laudia" element={<LaudiaPage />}>
            <Route index element={<TodayPage />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="pray" element={<PrayPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="more" element={<MorePage />} />
            <Route path="evangelio" element={<EvangelioPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="liturgia" element={<LiturgiaPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/laudia/today" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

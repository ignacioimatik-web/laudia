import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LaudiaPage from './app/laudia/page';
import TodayPage from './app/laudia/today/page';
import PrayPage from './app/laudia/pray/page';
import CalendarPage from './app/laudia/calendar/page';
import EvangelioPage from './app/laudia/evangelio/page';
import LibraryPage from './app/laudia/library/page';
import LiturgiaPage from './app/laudia/liturgia/page';
import SettingsPage from './app/laudia/settings/page';
import { SwUpdatePrompt } from './components/laudia/SwUpdatePrompt';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <SwUpdatePrompt />
        <Routes>
          <Route path="/laudia" element={<LaudiaPage />}>
            <Route index element={<TodayPage />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="pray" element={<PrayPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="evangelio" element={<EvangelioPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="liturgia" element={<LiturgiaPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/laudia/today" replace />} />
          <Route path="*" element={<Navigate to="/laudia/today" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

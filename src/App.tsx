import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LaudiaPage from './app/laudia/page';
import TodayPage from './app/laudia/today/page';
import PrayPage from './app/laudia/pray/page';
import CalendarPage from './app/laudia/calendar/page';
import LibraryPage from './app/laudia/library/page';
import SettingsPage from './app/laudia/settings/page';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/laudia" element={<LaudiaPage />}>
            <Route index element={<TodayPage />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="pray" element={<PrayPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          {/* Redirect root to /laudia/today */}
          <Route path="*" element={<LaudiaPage />}>
            <Route index element={<TodayPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
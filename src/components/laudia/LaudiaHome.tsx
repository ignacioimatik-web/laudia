import TodayCard from './TodayCard';
import { PrayerButtonGroup } from './PrayerSection';
import { CalendarPreview } from './CalendarPreview';
import { ModeSelector } from './ModeSelector';
import { LiturgicalBadge } from './LiturgicalBadge';

export default function LaudiaHome() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">LaudIA</h1>
        <p className="text-lg text-gray-600 mt-2">
          Laudes de la mañana con belleza, claridad y fidelidad litúrgica
        </p>
      </header>

      <TodayCard />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <PrayerButtonGroup />
        </div>
        <div>
          <CalendarPreview />
        </div>
      </div>

      <ModeSelector />

      <footer className="text-center text-sm text-gray-500">
        <p>⚠️ Algunos textos son datos de ejemplo y pendientes de verificación oficial</p>
      </footer>
    </div>
  );
}
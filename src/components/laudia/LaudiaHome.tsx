import TodayCard from './TodayCard';
import CalendarPreview from './CalendarPreview';
import ModeSelector from './ModeSelector';

export default function LaudiaHome() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header className="text-center py-8 space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mb-2">
          <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h1 className="laudia-h1 text-2xl">LaudIA</h1>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          Laudes de la mañana con belleza, claridad y fidelidad litúrgica
        </p>
      </header>

      <TodayCard />

      <div className="grid gap-4 md:grid-cols-2">
        <CalendarPreview />
        <ModeSelector />
      </div>

      <footer className="text-center py-4">
        <span className="text-xs text-stone-400">
          Textos provisionales · Pendientes de verificación oficial
        </span>
      </footer>
    </div>
  );
}

import { LiturgicalBadge } from './LiturgicalBadge';

export default function TodayCard() {
  const today = new Date();
  const civilDate = today.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="laudia-card-elevated p-5 md:p-6 animate-fade-in-up">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="laudia-h1">Laudes de hoy</h2>
          <p className="text-sm text-stone-500">{civilDate}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
              <LiturgicalBadge color="white" size="sm" />
              Navidad
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
              <LiturgicalBadge color="white" size="sm" />
              Semana 1
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
              <LiturgicalBadge color="blue" size="sm" />
              María, Madre de Dios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

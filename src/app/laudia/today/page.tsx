import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildLaudsOfficeFromOfficialSource } from '@/lib/laudia/official-source';
import type { LaudsOffice } from '@/types/laudia';

const seasonLabels: Record<string, string> = {
  ADVENTO: 'Adviento',
  NAVIDAD: 'Navidad',
  TIEMPO_ORDINARIO_1: 'Tiempo Ordinario',
  CUARESMA: 'Cuaresma',
  TRIDUO_PASCUAL: 'Triduo Pascual',
  PASCUA: 'Pascua',
  TIEMPO_ORDINARIO_2: 'Tiempo Ordinario',
};

const colorNames: Record<string, string> = {
  WHITE: 'Blanco',
  RED: 'Rojo',
  GREEN: 'Verde',
  VIOLET: 'Violeta',
  BLACK: 'Negro',
  ROSE: 'Rosa',
};

function formatLocalDate(date: Date) {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function TodayPage() {
  const [today] = useState(() => new Date());
  const [office, setOffice] = useState<LaudsOffice | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [savedStep, setSavedStep] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    buildLaudsOfficeFromOfficialSource(today)
      .then(result => {
        if (!cancelled) setOffice(result);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [today]);

  useEffect(() => {
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');
    try {
      const raw = localStorage.getItem(`laudia-pray-progress-${date}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { stepIndex?: number };
        if (typeof parsed.stepIndex === 'number' && parsed.stepIndex > 0) setSavedStep(parsed.stepIndex);
      }
    } catch {
      // El progreso es una mejora opcional; la portada sigue funcionando sin él.
    }
  }, [today]);

  if (!office && !loadFailed) {
    return (
      <div className="laudia-page flex items-center justify-center">
        <div className="laudia-loading" role="status">
          <span className="laudia-loading-mark" />
          <span>Preparando Laudes…</span>
        </div>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="laudia-page">
        <div className="laudia-page-inner max-w-xl">
          <div className="laudia-empty-state">
            <span className="laudia-brand-mark large" aria-hidden="true"><span /></span>
            <h1 className="laudia-display">No hemos podido preparar el oficio.</h1>
            <p>Comprueba la conexión y vuelve a intentarlo.</p>
            <button type="button" onClick={() => window.location.reload()} className="laudia-action-primary">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const prayerHref = `/laudia/pray?date=${office.day.date}`;
  const season = seasonLabels[office.day.season] ?? office.day.season;
  const sections = office.sections.length;

  return (
    <div className="laudia-page">
      <div className="laudia-page-inner max-w-3xl">
        <header className="mb-6">
          <p className="laudia-kicker">{getGreeting(today)}</p>
          <h1 className="laudia-display mt-2">Un momento de calma para empezar el día.</h1>
          <time className="block mt-3 text-sm text-stone-500 capitalize">{formatLocalDate(today)}</time>
        </header>

        <section className={`laudia-today-hero color-${office.day.color.toLowerCase()}`}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-stone-600">
              <span className="laudia-liturgical-dot" />
              {season}
            </div>
            <h2 className="mt-5 text-[clamp(1.9rem,8vw,3.25rem)] leading-[1.02] tracking-[-0.045em] text-stone-950 font-semibold max-w-xl">
              {office.day.title}
            </h2>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
              <span>Semana {office.day.psalterWeek} del Salterio</span>
              <span>{colorNames[office.day.color] ?? office.day.color}</span>
              <span>≈ 12 min</span>
            </div>

            <Link to={prayerHref} className="laudia-action-primary mt-7 w-full sm:w-auto">
              <span>{savedStep ? 'Continuar Laudes' : 'Comenzar Laudes'}</span>
              <span aria-hidden="true">→</span>
            </Link>
            {savedStep && (
              <p className="mt-3 text-xs text-stone-500">Tu progreso de hoy está guardado en este dispositivo.</p>
            )}
          </div>
          <div className="laudia-sun-orbit" aria-hidden="true"><span /></div>
        </section>

        <div className="grid gap-3 mt-4 sm:grid-cols-2">
          <Link to={`/laudia/evangelio?date=${office.day.date}`} className="laudia-quick-card">
            <span className="laudia-quick-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H12v18H7.5A2.5 2.5 0 0 0 5 22V4.5Zm14 0A2.5 2.5 0 0 0 16.5 2H12v18h4.5a2.5 2.5 0 0 1 2.5 2V4.5Z" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <span className="laudia-kicker text-[10px]">Palabra del día</span>
              <strong className="block mt-1 text-stone-900">Leer el Evangelio</strong>
            </span>
            <span className="ml-auto text-stone-300" aria-hidden="true">→</span>
          </Link>

          <Link to="/laudia/calendar" className="laudia-quick-card">
            <span className="laudia-quick-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <span className="laudia-kicker text-[10px]">Próximos días</span>
              <strong className="block mt-1 text-stone-900">Ver calendario</strong>
            </span>
            <span className="ml-auto text-stone-300" aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="laudia-quiet-note mt-5">
          <span className={`laudia-status-dot ${office.isFullyVerified ? 'verified' : ''}`} />
          <span>
            {sections} partes preparadas
            {office.isFullyVerified ? ' · textos verificados' : ' · fuente litúrgica pendiente de cotejo editorial'}
          </span>
        </div>
      </div>
    </div>
  );
}

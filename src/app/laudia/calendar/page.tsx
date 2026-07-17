import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMonthCalendar, getLiturgicalDay } from '@/lib/laudia/liturgical-calendar';
import { CalendarDay, LiturgicalDay, LiturgicalColor, LiturgicalRank } from '@/types/laudia';
import LiturgicalBadge from '@/components/laudia/LiturgicalBadge';
import { DeepgramNarrator } from '@/components/laudia/DeepgramNarrator';

// ── Helpers ─────────────────────────────────────────────────────────────────

const colorMap: Record<LiturgicalColor, LiturgicalBadgeProps['color']> = {
  WHITE: 'white', RED: 'red', GREEN: 'green',
  VIOLET: 'violet', BLACK: 'black', ROSE: 'rose',
};

const rankLabels: Record<LiturgicalRank, string> = {
  SOLEMNIDAD: 'Solemnidad',
  FIESTA: 'Fiesta',
  MEMORIA_OBLIGATORIA: 'Memoria obligatoria',
  MEMORIA_OPcional: 'Memoria libre',
  FERIA: 'Feria',
};

const rankStyle: Record<LiturgicalRank, string> = {
  SOLEMNIDAD:          'laudia-rank-chip laudia-rank-solemnidad',
  FIESTA:              'laudia-rank-chip laudia-rank-fiesta',
  MEMORIA_OBLIGATORIA: 'laudia-rank-chip laudia-rank-memoria',
  MEMORIA_OPcional:    'laudia-rank-chip laudia-rank-memoria',
  FERIA:               'laudia-rank-chip laudia-rank-feria',
};

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getSeasonLabel(season: string): string {
  const labels: Record<string, string> = {
    ADVENTO: 'Adviento', NAVIDAD: 'Navidad', TIEMPO_ORDINARIO_1: 'Tiempo Ordinario',
    CUARESMA: 'Cuaresma', TRIDUO_PASCUAL: 'Triduo Pascual', PASCUA: 'Pascua',
    TIEMPO_ORDINARIO_2: 'Tiempo Ordinario',
  };
  return labels[season] || season.replace(/_/g, ' ').toLowerCase();
}

function getColorLabel(c: LiturgicalColor): string {
  const labels: Record<LiturgicalColor, string> = {
    WHITE: 'Blanco', RED: 'Rojo', GREEN: 'Verde',
    VIOLET: 'Violeta', BLACK: 'Negro', ROSE: 'Rosa',
  };
  return labels[c] || '—';
}

function getWeekdayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── Types ───────────────────────────────────────────────────────────────────

import type { LiturgicalBadgeProps } from '@/components/laudia/LiturgicalBadge';

// ── Component ──────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const navigate = useNavigate();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(toLocalDateKey(today));

  const monthCalendar = useMemo(
    () => getMonthCalendar(displayYear, displayMonth),
    [displayYear, displayMonth]
  );

  const selectedDayLiturgical: LiturgicalDay | null = useMemo(() => {
    if (!selectedDate) return null;
    return getLiturgicalDay(new Date(selectedDate + 'T00:00:00'));
  }, [selectedDate]);

  const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay();

  const gridCells = useMemo(() => {
    const cells: ({ type: 'empty' } | { type: 'day'; day: CalendarDay })[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push({ type: 'empty' });
    for (const day of monthCalendar) cells.push({ type: 'day', day });
    const r = cells.length % 7;
    if (r > 0) for (let i = 0; i < 7 - r; i++) cells.push({ type: 'empty' });
    return cells;
  }, [monthCalendar, firstDayOfWeek]);

  const goPrevMonth = useCallback(() => {
    if (displayMonth === 0) { setDisplayYear(y => y - 1); setDisplayMonth(11); }
    else { setDisplayMonth(m => m - 1); }
  }, [displayMonth]);

  const goNextMonth = useCallback(() => {
    if (displayMonth === 11) {
      if (displayYear + 1 > 2030) return;
      setDisplayYear(y => y + 1); setDisplayMonth(0);
    } else { setDisplayMonth(m => m + 1); }
  }, [displayMonth, displayYear]);

  const goToday = useCallback(() => {
    setDisplayYear(today.getFullYear());
    setDisplayMonth(today.getMonth());
    setSelectedDate(toLocalDateKey(today));
  }, [today]);

  const selectDay = useCallback((date: string) => {
    const d = new Date(date + 'T00:00:00');
    if (d.getFullYear() > 2030) return;
    setSelectedDate(date);
  }, []);

  const goPray = useCallback(() => {
    navigate(selectedDate ? `/laudia/pray?date=${selectedDate}` : '/laudia/pray');
  }, [navigate, selectedDate]);

  const isToday = (date: string) => date === toLocalDateKey(today);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen laudia-gradient p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ══ Calendar =============================================== */}
          <div className="lg:w-3/5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={goPrevMonth}
                className="laudia-btn-secondary !px-2.5 !py-2 text-stone-500"
                aria-label="Mes anterior"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <h1 className="laudia-h1">
                  {MONTHS[displayMonth]} <span className="font-normal text-stone-500">{displayYear}</span>
                </h1>
                <button
                  onClick={goToday}
                  className="laudia-btn-ghost text-xs"
                >
                  Hoy
                </button>
              </div>

              <button
                onClick={goNextMonth}
                disabled={displayYear >= 2030 && displayMonth >= 11}
                className="laudia-btn-secondary !px-2.5 !py-2 text-stone-500 disabled:opacity-30"
                aria-label="Mes siguiente"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-3">
              {WEEKDAYS.map(wd => (
                <div key={wd} className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider py-1">
                  {wd}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="laudia-card p-2 md:p-3">
            <div className="grid grid-cols-7 gap-1.5">
              {gridCells.map((cell, idx) => {
                if (cell.type === 'empty') {
                  return <div key={`e-${idx}`} className="min-h-[3rem] md:min-h-[4.25rem]" />;
                }

                const d = cell.day;
                const isSel = d.date === selectedDate;
                const isT = isToday(d.date);
                const badgeColor = colorMap[d.color] || 'white';
                const isSolemnity = d.rank === 'SOLEMNIDAD';
                const dayDate = new Date(d.date + 'T00:00:00');
                const isSunday = dayDate.getDay() === 0;
                const rankState = d.rank === 'SOLEMNIDAD'
                  ? 'ring-1 ring-stone-300/60'
                  : d.rank === 'FIESTA'
                    ? 'ring-1 ring-rose-200/80'
                    : d.rank === 'FERIA'
                      ? 'ring-1 ring-stone-200/70'
                      : 'ring-1 ring-violet-200/75';

                return (
                  <button
                    key={d.date}
                    onClick={() => selectDay(d.date)}
                    className={`
                      relative flex flex-col items-start justify-start
                      p-2 md:p-3 min-h-[3rem] md:min-h-[4.25rem] w-full
                      rounded-xl transition-all duration-200 text-left
                      ${isSel
                        ? 'bg-amber-50 ring-2 ring-amber-400/60 shadow-sm'
                        : `bg-white/70 hover:bg-white border border-stone-200/60 ${rankState}`
                      }
                      ${isSolemnity ? 'font-semibold' : ''}
                      ${isSunday ? 'bg-amber-50/60' : ''}
                    `}
                  >
                    {/* Day number */}
                    <span className={`
                      text-sm md:text-base leading-tight
                      ${isT ? 'text-amber-700 font-semibold' : 'text-stone-700'}
                    `}>
                      {d.dayOfMonth}
                    </span>

                    {/* Color dot + rank label */}
                    <div className="mt-auto flex items-center gap-1.5">
                      <LiturgicalBadge color={badgeColor} glow={isSolemnity} size="sm" />
                        {(d.rank !== 'FERIA' || isSunday) && (
                          <span className="hidden md:inline text-[10px] text-stone-500 leading-tight truncate max-w-[4rem]">
                            {isSunday ? 'Domingo' : rankLabels[d.rank]?.substring(0, 6)}
                          </span>
                        )}
                    </div>

                    {/* Today indicator */}
                    {isT && !isSel && (
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-xs text-stone-600">
              {(['SOLEMNIDAD', 'FIESTA', 'MEMORIA_OBLIGATORIA', 'FERIA'] as LiturgicalRank[]).map(rank => (
                <span key={rank} className="flex items-center gap-1.5 rounded-full border border-stone-200/70 bg-white/55 px-2.5 py-1">
                  <LiturgicalBadge
                    color={
                      rank === 'SOLEMNIDAD' ? 'white' :
                      rank === 'FIESTA' ? 'red' :
                      rank === 'MEMORIA_OBLIGATORIA' ? 'violet' :
                      'green'
                    }
                    size="sm"
                  />
                  {rankLabels[rank]}
                </span>
              ))}
              <span className="flex items-center gap-1.5 rounded-full border border-stone-200/70 bg-white/55 px-2.5 py-1">
                <LiturgicalBadge color="blue" size="sm" /> Domingo
              </span>
            </div>
          </div>

          {/* ══ Details Panel =========================================== */}
          <div className="lg:w-2/5">
            <div className="laudia-card p-5 md:p-7 lg:sticky lg:top-8">
              {selectedDayLiturgical ? (
                <div className="space-y-5 animate-fade-in">
                  {/* Accent bar */}
                  <div className="h-1 rounded-full" style={{
                    backgroundColor: colorMap[selectedDayLiturgical.color] === 'white' ? '#e7e5e4'
                      : selectedDayLiturgical.color === 'RED' ? '#ef4444'
                      : selectedDayLiturgical.color === 'GREEN' ? '#22c55e'
                      : selectedDayLiturgical.color === 'VIOLET' ? '#8b5cf6'
                      : selectedDayLiturgical.color === 'BLACK' ? '#292524'
                      : '#f43f5e'
                  }} />

                  {/* Date */}
                  <div>
                    <p className="laudia-h3 mb-1">Día seleccionado</p>
                    <p className="laudia-h2">{getWeekdayName(selectedDate!)}</p>
                  </div>

                  <DeepgramNarrator
                    text={[
                      getWeekdayName(selectedDate),
                      selectedDayLiturgical.title,
                      rankLabels[selectedDayLiturgical.rank],
                      getSeasonLabel(selectedDayLiturgical.season),
                      `Color litúrgico ${getColorLabel(selectedDayLiturgical.color)}`,
                      `Salterio, semana ${selectedDayLiturgical.psalterWeek}`,
                    ].join('. ')}
                    label="Escuchar el día"
                    compact
                  />

                  {/* Celebration */}
                  <div className="space-y-2">
                    <p className="laudia-h3">Celebración</p>
                    <p className="text-base font-medium text-stone-800">{selectedDayLiturgical.title}</p>
                    <span className={rankStyle[selectedDayLiturgical.rank]}>
                      {rankLabels[selectedDayLiturgical.rank]}
                    </span>
                  </div>

                  {/* Season */}
                  <div className="flex items-center justify-between py-2 border-t border-stone-100">
                    <span className="laudia-h3">Tiempo litúrgico</span>
                    <span className="text-sm text-stone-700">{getSeasonLabel(selectedDayLiturgical.season)}</span>
                  </div>

                  {/* Color */}
                  <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                    <span className="laudia-h3">Color</span>
                    <div className="flex items-center gap-2">
                      <LiturgicalBadge color={colorMap[selectedDayLiturgical.color] || 'white'} glow size="sm" />
                      <span className="text-sm text-stone-700">{getColorLabel(selectedDayLiturgical.color)}</span>
                    </div>
                  </div>

                  {/* Psalter */}
                  <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                    <span className="laudia-h3">Salterio</span>
                    <span className="text-sm text-stone-700">Semana {selectedDayLiturgical.psalterWeek}</span>
                  </div>

                  {/* Proper */}
                  {selectedDayLiturgical.hasProper && (
                    <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                      <span className="laudia-h3">Propio</span>
                      <span className="text-sm text-stone-700">
                        {selectedDayLiturgical.properType === 'TEMPORAL' ? 'Del tiempo'
                          : selectedDayLiturgical.properType === 'SANCTORAL' ? 'De los santos'
                          : 'Común de santos'}
                      </span>
                    </div>
                  )}

                  {/* Action */}
                  <div className="pt-4 border-t border-stone-100">
                    <button onClick={goPray} className="laudia-btn-primary w-full">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                      </svg>
                      Rezar Laudes de este día
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-stone-500 text-center py-12 text-sm">
                  Selecciona un día para ver su información litúrgica
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { fetchDailyGospel } from '@/lib/laudia/gospel-source';

type GospelState = {
  liturgicalTitle: string;
  readingTitle: string;
  text: string;
};

function toLocalDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function EvangelioPage() {
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateInput(new Date()));
  const [data, setData] = useState<GospelState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayDate = useMemo(() => {
    const parsed = new Date(`${selectedDate}T00:00:00`);
    return parsed.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [selectedDate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const response = await fetchDailyGospel(new Date(`${selectedDate}T00:00:00`));
        if (cancelled) return;
        setData({
          liturgicalTitle: response.liturgicalTitle,
          readingTitle: response.readingTitle,
          text: response.text,
        });
      } catch {
        if (cancelled) return;
        setData(null);
        setError('No se pudo cargar el Evangelio de este día desde la fuente externa.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  return (
    <div className="min-h-screen laudia-gradient p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="laudia-card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="laudia-h3 mb-1">Evangelio del día</p>
              <h1 className="laudia-h1">Evangelio</h1>
              <p className="text-sm text-stone-600 capitalize">{displayDate}</p>
            </div>
            <label className="text-xs text-stone-600">
              Fecha
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ml-2 rounded-lg border border-stone-300 bg-white/70 px-2 py-1 text-sm text-stone-700"
              />
            </label>
          </div>
        </div>

        {loading && (
          <div className="laudia-card p-6 text-center">
            <p className="text-sm text-stone-500 animate-pulse-soft">Cargando Evangelio…</p>
          </div>
        )}

        {!loading && error && (
          <div className="laudia-card p-6 space-y-3">
            <p className="text-sm text-amber-800">{error}</p>
            <a
              href="https://feed.evangelizo.org/v2/reader.php"
              target="_blank"
              rel="noreferrer"
              className="laudia-btn-secondary text-sm"
            >
              Abrir fuente del Evangelio
            </a>
          </div>
        )}

        {!loading && data && (
          <article className="laudia-card p-5 md:p-6 space-y-4">
            <p className="laudia-h3">Fuente: Evangelizo (SP)</p>
            <p className="text-sm text-stone-600">{data.liturgicalTitle}</p>
            <h2 className="laudia-h2">{data.readingTitle}</h2>
            <div className="laudia-separator" />
            <p className="laudia-prayer laudia-prose whitespace-pre-line text-stone-800 leading-relaxed">
              {data.text}
            </p>
          </article>
        )}
      </div>
    </div>
  );
}

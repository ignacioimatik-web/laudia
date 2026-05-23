import { LaudsOffice } from '@/types/laudia';
import { buildLaudsOffice } from '@/lib/laudia/prayer-builder';
import { getLiturgicalInfo, getLiturgicalDayTitle } from '@/lib/laudia/liturgical-calendar';
import PrayerView from '@/components/laudia/PrayerView';
import { PrayerProgress } from '@/components/laudia/PrayerProgress';
import { useState, useEffect } from 'react';

export default function PrayPage() {
  const [today] = useState(new Date());
  const [office, setOffice] = useState<LaudsOffice | null>(null);
  const [preferences, setPreferences] = useState<{ preferredMode: 'STANDARD' | 'GUIDE' }>({ preferredMode: 'STANDARD' });

  useEffect(() => {
    // Build the office for today
    const builtOffice = buildLaudsOffice(today, preferences);
    setOffice(builtOffice);
  }, [today, preferences]);

  if (!office) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Cargando oficio de Laudes...</p>
      </div>
    );
  }

  const { day, sections, suggestedMode, isFullyVerified } = office;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Rezar Laudes</h1>
          <p className="text-sm text-gray-500">
            {day.title} • {day.season.replace(/_/g, ' ')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-gray-100 px-2 py-1 rounded-full">Semana {day.psalterWeek} del Salterio</span>
            <span className={`bg-${getLiturgicalColor(new Date(day.date))}-100 text-${getLiturgicalColor(new Date(day.date))}-800 px-2 py-1 rounded-full`}>
              {day.color}
            </span>
          </div>
        </header>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Modo actual: {preferences.preferredMode === 'STANDARD' ? 'Estándar' : 'Guía'}
            {suggestedMode !== preferences.preferredMode && (
              <span className="ml-2 text-xs text-orange-600">(sugerido: {suggestedMode === 'STANDARD' ? 'Estándar' : 'Guía'})</span>
            )}
          </p>
        </div>

        {!isFullyVerified && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              ⚠️ Algunos textos son placeholders pendientes de verificación oficial.
              En una implementación real, se cargarían los textos aprobados.
            </p>
          </div>
        )}

        <PrayerProgress sections={sections} />

        <PrayerView
          day={day}
          sections={sections}
          preferences={preferences}
          office={office}
        />

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>LaudIA - Modo de oración: {preferences.preferredMode}</p>
        </footer>
      </div>
    </div>
  );
}
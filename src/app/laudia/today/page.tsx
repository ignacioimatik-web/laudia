import TodayHeader from '@/components/laudia/TodayHeader';
import { LaudsOffice, PrayerSection, PrayerBlock } from '@/types/laudia';
import { buildLaudsOffice } from '@/lib/laudia/prayer-builder';
import { VerificationNotice } from '@/components/laudia/VerificationNotice';
import FontSizeControls from '@/components/laudia/FontSizeControls';
import ReadingModeToggle from '@/components/laudia/ReadingModeToggle';
import { LiturgicalValidatorPanel } from '@/components/laudia/LiturgicalValidatorPanel';
import { validateOffice } from '@/lib/laudia/liturgical-validator';
import { useState, useEffect, useMemo } from 'react';

export default function TodayPage() {
  const [today] = useState(new Date());
  const [office, setOffice] = useState<LaudsOffice | null>(null);
  const [fontSize, setFontSize] = useState<number>(16);
  const [showRubrics, setShowRubrics] = useState<boolean>(true);
  const [readingMode, setReadingMode] = useState<boolean>(false);

  useEffect(() => {
    const built = buildLaudsOffice(today);
    setOffice(built);
  }, [today]);

  const validation = useMemo(() => office ? validateOffice(office) : null, [office]);

  if (!office) {
    return (
      <div className="min-h-screen flex items-center justify-center laudia-gradient">
        <div className="text-center animate-pulse-soft">
          <div className="inline-block h-10 w-10 rounded-full border-2 border-stone-300 border-t-stone-600 animate-spin mb-4" />
          <p className="text-sm text-stone-500">Cargando Laudes de hoy…</p>
        </div>
      </div>
    );
  }

  const increaseFontSize = () => setFontSize(Math.min(24, fontSize + 2));
  const decreaseFontSize = () => setFontSize(Math.max(12, fontSize - 2));
  const effectiveShowRubrics = readingMode ? false : showRubrics;

  return (
    <div className="min-h-screen laudia-gradient">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <TodayHeader office={office} />

        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-4 mt-5 mb-6 px-1">
          <FontSizeControls
            fontSize={fontSize}
            onIncrease={increaseFontSize}
            onDecrease={decreaseFontSize}
          />
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showRubrics}
              onChange={(e) => setShowRubrics(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-stone-700 focus:ring-0"
            />
            <span className="text-sm text-stone-500">Rúbricas</span>
          </label>
          <ReadingModeToggle
            readingMode={readingMode}
            onToggle={() => setReadingMode(!readingMode)}
          />
        </div>

        {/* Verification notice if needed */}
        {!office.isFullyVerified && (
          <div className="mb-6 reading-hide">
            <VerificationNotice office={office} />
          </div>
        )}

        {validation && <LiturgicalValidatorPanel result={validation} />}

        {/* Prayer sections */}
        <div
          className={`laudia-prayer space-y-6 ${
            fontSize <= 14 ? 'text-sm' : fontSize <= 18 ? 'text-base' : fontSize <= 22 ? 'text-lg' : 'text-xl'
          } ${readingMode ? 'reading-mode' : ''}`}
        >
          {office.sections.map((section: PrayerSection, si: number) => (
            <section
              key={section.id}
              className={`laudia-card p-5 md:p-6 ${si === 0 ? '' : 'animate-fade-in'}`}
              style={si > 0 ? { animationDelay: `${si * 60}ms` } : undefined}
            >
              <h2 className="laudia-h2 mb-4">{section.title}</h2>
              <div className="space-y-5">
                {section.blocks.map((block: PrayerBlock, bi: number) => (
                  <div
                    key={block.id}
                    className={bi > 0 ? 'pt-5 border-t border-stone-100' : ''}
                  >
                    {/* Rubric */}
                    {effectiveShowRubrics && block.rubrics && (
                      <p className="rubric mb-2">{block.rubrics}</p>
                    )}

                    {/* Block label */}
                    {block.type !== 'TEXT' && (
                      <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1.5">
                        {block.type === 'ANTIPHON' && 'Antífona'}
                        {block.type === 'PSALM' && (block.psalmInfo
                          ? `Salmo ${block.psalmInfo.number}${block.psalmInfo.verses ? ` (${block.psalmInfo.verses})` : ''}`
                          : 'Salmo')}
                        {block.type === 'CANTICLE_OT' && 'Cántico del Antiguo Testamento'}
                        {block.type === 'CANTICLE_GOSPEL' && (block.canticleInfo?.name ?? 'Cántico evangélico')}
                        {block.type === 'GLORIA' && 'Gloria al Padre'}
                        {block.type === 'INVITATORY' && 'Invitatorio'}
                        {block.type === 'HYMN' && 'Himno'}
                        {block.type === 'READING' && 'Lectura breve'}
                        {block.type === 'RESPONSORY' && 'Responsorio breve'}
                        {block.type === 'INTERCESSIONS' && 'Preces'}
                        {block.type === 'OUR_FATHER' && 'Oración del Señor'}
                        {block.type === 'CONCLUDING_PRAYER' && 'Oración final'}
                        {block.type === 'CONCLUSION' && 'Conclusión'}
                      </p>
                    )}

                    {/* Official text */}
                    <p className="whitespace-pre-line leading-relaxed text-stone-800">
                      {block.officialText}
                    </p>

                    {/* AI reflection placeholder (future) */}
                    {false && block.aiReflection && (
                      <div className="mt-3 p-3 bg-blue-50/60 border-l-2 border-blue-300 rounded-r-lg">
                        <p className="text-sm text-blue-700">{block.aiReflection.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-stone-400">
          <p>A+ / A− para cambiar tamaño · Ocultar rúbricas en modo lectura</p>
        </div>
      </div>
    </div>
  );
}

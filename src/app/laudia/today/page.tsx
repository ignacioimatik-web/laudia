import TodayHeader from '@/components/laudia/TodayHeader';
import { PrayerSection, PrayerBlock, AiReflection } from '@/types/laudia';
import { buildLaudsOffice } from '@/lib/laudia/prayer-builder';
import { VerificationNotice } from '@/components/laudia/VerificationNotice';
import { FontSizeControls } from '@/components/laudia/FontSizeControls';
import { ReadingModeToggle } from '@/components/laudia/ReadingModeToggle';
import { useState, useEffect } from 'react';

export default function TodayPage() {
  const [today] = useState(new Date());
  const [office, setOffice] = useState<any>(null);
  const [fontSize, setFontSize] = useState<number>(16); // base in px
  const [showRubrics, setShowRubrics] = useState<boolean>(true);
  const [readingMode, setReadingMode] = useState<boolean>(false);

  useEffect(() => {
    const built = buildLaudsOffice(today);
    setOffice(built);
  }, [today]);

  if (!office) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mb-4"></div>
          <p className="text-lg text-amber-800">Cargando Laudes de hoy...</p>
        </div>
      </div>
    );
  }

  // Helper to increase/decrease font size
  const increaseFontSize = () => setFontSize(Math.min(24, fontSize + 2));
  const decreaseFontSize = () => setFontSize(Math.max(12, fontSize - 2));

  // Determine text size class based on fontSize px
  const textSizeClass =
    fontSize <= 14
      ? 'text-sm'
      : fontSize <= 16
      ? 'text-base'
      : fontSize <= 18
      ? 'text-lg'
      : fontSize <= 20
      ? 'text-xl'
      : 'text-2xl';

  // If reading mode, hide rubrics and simplify layout
  const effectiveShowRubrics = readingMode ? false : showRubrics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <TodayHeader office={office} />

        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-4 mt-4 mb-2">
          <FontSizeControls
            fontSize={fontSize}
            onIncrease={increaseFontSize}
            onDecrease={decreaseFontSize}
          />
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showRubrics}
                onChange={(e) => setShowRubrics(e.target.checked)}
                className="h-4 w-4 text-amber-600"
              />
              <span>Mostrar rúbricas</span>
            </label>
          </div>
          <ReadingModeToggle
            readingMode={readingMode}
            onToggle={() => setReadingMode(!readingMode)}
          />
        </div>

        {/* Verification notice if needed */}
        {!office.isFullyVerified && (
          <VerificationNotice office={office} />
        )}

        {/* Prayer content */}
        <div className={`prose prose-amber max-w-none ${textSizeClass} ${readingMode ? 'reading-mode' : ''}`}>
          {office.sections.map((section: PrayerSection) => (
            <div key={section.id} className="mb-8 last:mb-0">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.blocks.map((block: PrayerBlock) => (
                  <div key={block.id} className="mb-4 last:mb-0">
                    {/* Rubricas */}
                    {effectiveShowRubrics && block.rubrics && (
                      <p className="text-xs text-amber-500 italic mb-1">
                        {block.rubrics}
                      </p>
                    )}

                    {/* Contenido oficial */}
                    <p className="whitespace-pre-line">
                      {block.officialText}
                    </p>

                    {/* Antífona, salmo, etc. ya vienen en officialText; aquí podríamos separar si quisieramos
                    pero por ahora el builder pone todo en officialText con saltos de línea.
                    Para demostrar estructura, podemos dejarlo así.
                    */}

                    {/* Reflexión de IA si modo guía y existe */}
                    {false && block.aiReflection && (
                      <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400">
                        <p className="text-sm text-amber-800">{block.aiReflection.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer with navigation hints */}
        <div className="mt-8 text-center text-sm text-amber-600">
          <p>
            <span className="mr-2">⬆️⬇️ Navegar entre secciones</span>
            <span>A+ / A- para cambiar tamaño de letra</span>
          </p>
        </div>
      </div>
    </div>
  );
}
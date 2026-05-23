import { PrayerBlock, AiReflection } from '@/types/laudia';

type PrayerBlockProps = {
  block: PrayerBlock;
  showRubrics: boolean;
  readingMode: boolean;
  textSizeClass: string;
};

export default function PrayerBlock({ block, showRubrics, readingMode, textSizeClass }: PrayerBlockProps) {
  const effectiveShowRubrics = showRubrics && !readingMode; // hide rubrics in reading mode

  // Helper to format text with line breaks (preserve newlines)
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="mb-4 last:mb-0">
      {/* Rubricas */}
      {effectiveShowRubrics && block.rubrics && (
        <p className="text-xs text-amber-500 italic mb-1">
          {block.rubrics}
        </p>
      )}
      
      {/* Contenido oficial */}
      <p className={`${textSizeClass} whitespace-pre-line text-amber-800`}>
        {formatText(block.officialText)}
      </p>

      {/* Reflexión de IA si modo guía y existe (not implemented in today page but kept for completeness) */}
      {false && block.aiReflection && (
        <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400">
          <p className="text-sm text-amber-800">{block.aiReflection.content}</p>
        </div>
      )}
    </div>
  );
}
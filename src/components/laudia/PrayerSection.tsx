import type { PrayerSection as PrayerSectionData } from '@/types/laudia';
import PrayerBlock from './PrayerBlock';

type PrayerSectionProps = {
  section: PrayerSectionData;
  showRubrics: boolean;
  readingMode: boolean;
  textSizeClass: string;
};

export default function PrayerSection({ section, showRubrics, readingMode, textSizeClass }: PrayerSectionProps) {
  return (
    <div className="mb-8 last:mb-0">
      <h2 className="text-xl font-semibold text-amber-800 mb-4">{section.title}</h2>
      <div className="space-y-4">
        {section.blocks.map((block) => (
          <PrayerBlock
            key={block.id}
            block={block}
            showRubrics={showRubrics}
            readingMode={readingMode}
            textSizeClass={textSizeClass}
          />
        ))}
      </div>
    </div>
  );
}

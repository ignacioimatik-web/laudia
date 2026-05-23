import { PrayerSection } from '@/types/laudia';

type PrayerProgressProps = {
  sections: PrayerSection[];
  completedSections: string[]; // IDs of completed sections
};

export default function PrayerProgress({ sections, completedSections }: PrayerProgressProps) {
  const total = sections.length;
  const completed = completedSections.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
        <span>Progreso de la oración</span>
        <span>{completed}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`bg-gray-900 h-2.5 rounded-full transition-width duration-500`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
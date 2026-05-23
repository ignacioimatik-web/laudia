import React from 'react';
import { LaudsOffice, PrayerSection, PrayerBlock } from '@/types/laudia';

type PrayerViewProps = {
  day: LaudsOffice['day'];
  sections: PrayerSection[];
  preferences?: { preferredMode: 'STANDARD' | 'GUIDE' };
  office?: LaudsOffice;
};

export default function PrayerView({ day, sections, preferences, office }: PrayerViewProps) {
  const showAiReflections = preferences?.preferredMode === 'GUIDE';

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
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="border-l-4 border-gray-200 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {section.title}
          </h3>
          <div className="space-y-4">
            {section.blocks.map((block) => (
              <div key={block.id} className="mb-4 last:mb-0">
                {/* Rubricas si existen */}
                {block.rubrics && (
                  <p className="text-xs text-gray-500 italic mb-1">
                    {block.rubrics}
                  </p>
                )}
                
                {/* Contenido oficial */}
                <div className="mb-2">
                  <p className="text-gray-800 whitespace-pre-line">
                    {formatText(block.officialText)}
                  </p>
                </div>
                
                {/* Reflexión de IA si está activada y existe */}
                {showAiReflections && block.aiReflection && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">
                      {block.aiReflection.content}
                    </p>
                    <p className="text-xs text-blue-600 mt-1 italic">
                      Reflejo de guía • {block.aiReflection.estimatedReadingTimeSeconds}s lectura
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
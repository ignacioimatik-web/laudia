import { LaudsOffice, PrayerMode } from '@/types/laudia';
import { getLiturgicalDay } from '@/lib/laudia/liturgical-calendar';

/**
 * Generates a sample LaudsOffice for demonstration purposes.
 * All texts are placeholders clearly marked as pending official verification.
 * 
 * @param date - Date for which to generate the sample office
 * @returns A LaudsOffice with placeholder texts and structure
 */
export function generateSampleLaudsOffice(date: Date, preferences?: { preferredMode?: PrayerMode }): LaudsOffice {
  // Get basic liturgical info from our calendar (approximate)
  const day = getLiturgicalDay(date);

  // In a real implementation, this would pull from official liturgical books
  // For now, we construct the structure with placeholders

  // Helper to create a placeholder block
  function createPlaceholderBlock(
    id: string,
    type: NonNullable<LaudsOffice['sections'][0]['blocks'][0]>['type'],
    content: string,
    rubrics?: string,
    source: OfficeSource = 'LITURGIA_HORAS_OFICIAL' // we assume official source but unverified
  ): PrayerBlock {
    return {
      id,
      type,
      officialText: content,
      verificationStatus: 'PLACEHOLDER' as const,
      source,
      aiReflection: null,
      rubrics,
      psalmInfo: null,
      canticleInfo: null,
    };
  }

  // Helper to create an antiphon block
  function createAntiphonBlock(id: string, text: string): PrayerBlock {
    return createPlaceholderBlock(id, 'ANTIPHON', text, undefined, 'LITURGIA_HORAS_OFICIAL');
  }

  // Helper to create a psalm block
  function createPsalmBlock(id: string, number: number, verses?: string): PrayerBlock {
    return createPlaceholderBlock(
      id,
      'PSALM',
      `Salmo ${number}${verses ? ` (${verses})` : ''}\n\n[Texto oficial del salmo pendiente de cargar/verificar]`,
      'Se sentado',
      'SALTERIO_OFICIAL'
    );
  }

  // Helper to create a gloria block
  function createGloriaBlock(id: string): PrayerBlock {
    return createPlaceholderBlock(
      id,
      'GLORIA',
      'Gloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre,\npor los siglos de los siglos. Amén.',
      undefined,
      'LITURGIA_HORAS_OFICIAL'
    );
  }

  // Build the office sections according to the requested structure
  const sections: PrayerSection[] = [
    {
      id: 'opening',
      title: 'Inicio',
      blocks: [
        createPlaceholderBlock(
          'opening-invite',
          'INVITATORY',
          'Señor, abre mis labios\n[y mi boca proclamará tu alabanza]\n\nAnt. Venid, adoremos al Señor...\n[Texto oficial del invitatorio pendiente de cargar/verificar]',
          'Se dice de pie, con signo de la cruz',
          'LITURGIA_HORAS_OFICIAL'
        ),
      ],
    },
    {
      id: 'hymn',
      title: 'Himno',
      blocks: [
        createPlaceholderBlock(
          'hymn-text',
          'HYMN',
          '[Texto oficial del himno pendiente de cargar/verificar]',
          'Se sentado',
          'LITURGIA_HORAS_OFICIAL'
        ),
      ],
    },
    {
      id: 'psalmody',
      title: 'Salmodia',
      blocks: [
        // Antífona 1
        createAntiphonBlock('antiphon-1', '[Antífona 1 oficial pendiente de cargar/verificar]'),
        // Salmo 1
        createPsalmBlock('psalm-1', 147, '1-11'), // example psalm and verses
        // Gloria
        createGloriaBlock('gloria-1'),
        // Antífona 1 (repeat)
        createAntiphonBlock('antiphon-1-repeat', '[Antífona 1 oficial pendiente de cargar/verificar]'),
        // Antífona 2
        createAntiphonBlock('antiphon-2', '[Antífona 2 oficial pendiente de cargar/verificar]'),
        // Cántico del Antiguo Testamento
        createPlaceholderBlock(
          'canticle-ot',
          'CANTICLE_OT',
          '[Cántico del Antiguo Testamento oficial pendiente de cargar/verificar]\n\nEj: Daniel 3,57-88 o 1 Samuel 2,1-10',
          'Se sentado',
          'LITURGIA_HORAS_OFICIAL'
        ),
        // Gloria
        createGloriaBlock('gloria-2'),
        // Antífona 2 (repeat)
        createAntiphonBlock('antiphon-2-repeat', '[Antífona 2 oficial pendiente de cargar/verificar]'),
        // Antífona 3
        createAntiphonBlock('antiphon-3', '[Antífona 3 oficial pendiente de cargar/verificar]'),
        // Salmo de alabanza (often Psalms 148, 149, 150)
        createPsalmBlock('praise-psalm', 148, '1-6'), // example
        // Gloria
        createGloriaBlock('gloria-3'),
        // Antífona 3 (repeat)
        createAntiphonBlock('antiphon-3-repeat', '[Antífona 3 oficial pendiente de cargar/verificar]'),
      ],
    },
    {
      id: 'reading',
      title: 'Lectura breve',
      blocks: [
        createPlaceholderBlock(
          'reading-text',
          'READING',
          '[Lectura breve oficial pendiente de cargar/verificar]',
          'Se sentado',
          'LITURGIA_HORAS_OFICIAL'
        ),
      ],
    },
    {
      id: 'responsory',
      title: 'Responsorio breve',
      blocks: [
        createPlaceholderBlock(
          'responsory-text',
          'RESPONSORY',
          '[Responsorio breve oficial pendiente de cargar/verificar]',
          'Se sentado',
          'LITURGIA_HORAS_OFICIAL'
        ),
      ],
    },
    {
      id: 'benedictus',
      title: 'Benedictus',
      blocks: [
        // Antífona del Benedictus
        createAntiphonBlock('benedictus-antiphon', '[Antífona del Benedictus oficial pendiente de cargar/verificar]'),
        // Cántico evangélico (Benedictus)
        createPlaceholderBlock(
          'benedictus-canticle',
          'CANTICLE_GOSPEL',
          '[Cántico evangélico (Benedictus) oficial pendiente de cargar/verificar]\n\nLucas 1,68-79',
          undefined,
          'LITURGIA_HORAS_OFICIAL'
        ),
        // Gloria
        createGloriaBlock('gloria-benedictus'),
        // Antífona del Benedictus (repeat)
        createAntiphonBlock('benedictus-antiphon-repeat', '[Antífona del Benedictus oficial pendiente de cargar/verificar]'),
      ],
    },
    {
      id: 'intercessions',
      title: 'Preces',
      blocks: [
        createPlaceholderBlock(
          'intercessions-text',
          'INTERCESSIONS',
          '[Preces oficiales pendientes de cargar/verificar]\n\nEj: Por la Santa Iglesia... Por los necesitados...',
          'Se sentado o de rodillas',
          'LITURGIA_HORAS_OFICIAL'
        ),
      ],
    },
    {
      id: 'our-father',
      title: 'Padrenuestro',
      blocks: [
        createPlaceholderBlock(
          'our-father-text',
          'OUR_FATHER',
          'Padre nuestro que estás en los cielos,\nsantificado sea tu nombre;\nvenga tu reino;\nhágase tu voluntad\nen la tierra como en el cielo.\nDanos hoy nuestro pan de cada día;\nperdona nuestras ofensas,\ncomo nosotros perdonamos a los que nos ofenden;\nno nos dejes caer en tentación\ny líbranos del mal. Amén.\n\n[Nota: Esta es la versión común; verificar la aprobada para uso litúrgico]',
          'Se dice de pie o de rodillas',
          'LITURGIA_HORAS_OFICIAL'
        ),
      ],
    },
    {
      id: 'concluding-prayer',
      title: 'Oración conclusiva',
      blocks: [
        createPlaceholderBlock(
          'concluding-prayer-text',
          'CONCLUDING_PRAYER',
          '[Oración colecta oficial pendiente de cargar/verificar]',
          'Se dice de pie',
          'LITURGIA_HORAS_OFICIAL'
        ),
      ],
    },
    {
      id: 'conclusion',
      title: 'Conclusión',
      blocks: [
        createPlaceholderBlock(
          'conclusion-text',
          'CONCLUSION',
          'El Señor nos conceda su paz,\ny vida eterna.\nAmén.',
          'Se hace la señal de la cruz',
          'LITURGIA_HORAS_OFICIAL'
        ),
      ],
    },
  ];

  // Determine suggested mode based on preferences (simple logic)
  const suggestedMode = preferences?.preferredMode ?? 'STANDARD';

  // Determine if fully verified (false because we have placeholders)
  const isFullyVerified = false;

  return {
    day,
    psalterWeek: day.psalterWeek,
    sections,
    suggestedMode,
    isFullyVerified,
  };
}
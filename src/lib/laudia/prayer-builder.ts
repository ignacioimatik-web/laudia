import { 
  LaudsOffice, 
  LiturgicalDay, 
  PrayerMode, 
  OfficeSource, 
  TextVerificationStatus,
  PrayerSection,
  PrayerBlock,
  AiReflection
} from '@/types/laudia';
import { getLiturgicalDay } from '@/lib/laudia/liturgical-calendar';

/**
 * Construye un objeto LaudsOffice para una fecha dada.
 * 
 * Esta es una implementación básica que utiliza placeholders para todos los textos oficiales.
 * En una implementación real, esta función obtendría los textos de fuentes oficiales
 * (basadas en el día litúrgico, semana del salterio, propio del tiempo/santos, etc.)
 * 
 * @param date - Fecha para la que construir el oficio
 * @param preferences - Preferencias del usuario (opcional)
 * @returns LaudsOffice con estructura completa pero textos de placeholder
 */
export function buildLaudsOffice(
  date: Date, 
  preferences?: { preferredMode?: PrayerMode }
): LaudsOffice {
  // Obtener información litúrgica básica del día
  const day: LiturgicalDay = getLiturgicalDay(date);

  /**
   * Crea un bloque de placeholder con el texto de advertencia estándar.
   * 
   * @param id - Identificador único del bloque
   * @param type - Tipo de bloque
   * @param contentHint - Pista sobre qué contenido debería ir aquí (para el placeholder)
   * @param rubrics - Indicaciones rubrísticas opcionales
   * @param source - Fuente oficial asumida (por defecto Liturgia de las Horas)
   * @returns PrayerBlock con texto de placeholder
   */
  function createPlaceholderBlock(
    id: string,
    type: NonNullable<LaudsOffice['sections'][0]['blocks'][0]>['type'],
    contentHint: string,
    rubrics?: string,
    source: OfficeSource = 'LITURGIA_HORAS_OFICIAL',
    canticleInfo?: { name: string; verses?: string }
  ): PrayerBlock {
    return {
      id,
      type,
      officialText: `Texto oficial pendiente de cargar/verificar: ${contentHint}`,
      verificationStatus: 'PLACEHOLDER' as const,
      source,
      aiReflection: null,
      rubrics,
      psalmInfo: null,
      canticleInfo: canticleInfo ?? null,
    };
  }

  /**
   * Crea un bloque de antífona de placeholder.
   */
  function createPlaceholderAntiphon(
    id: string,
    contentHint: string
  ): PrayerBlock {
    return createPlaceholderBlock(id, 'ANTIPHON', contentHint, undefined, 'LITURGIA_HORAS_OFICIAL');
  }

  /**
   * Crea un bloque de salmo de placeholder.
   */
  function createPlaceholderPsalm(
    id: string,
    number: number,
    versesHint?: string
  ): PrayerBlock {
    const contentHint = `Salmo ${number}${versesHint ? ` (${versesHint})` : ''}`;
    return createPlaceholderBlock(
      id,
      'PSALM',
      contentHint,
      'Se sentado', // Rubrica típica para salmodia
      'SALTERIO_OFICIAL'
    );
  }

  /**
   * Crea un bloque de Gloria de placeholder.
   */
  function createPlaceholderGloria(
    id: string
  ): PrayerBlock {
    return createPlaceholderBlock(
      id,
      'GLORIA',
      'Gloria al Padre, y al Hijo, y al Espíritu Santo',
      undefined,
      'LITURGIA_HORAS_OFICIAL'
    );
  }

  /**
   * Crea un bloque de cántico de placeholder.
   */
  function createPlaceholderCanticle(
    id: string,
    type: 'CANTICLE_OT' | 'CANTICLE_GOSPEL',
    nameHint: string,
    versesHint?: string
  ): PrayerBlock {
    const contentHint = `${nameHint}${versesHint ? ` (${versesHint})` : ''}`;
    return createPlaceholderBlock(
      id,
      type,
      contentHint,
      'Se sentado',
      'LITURGIA_HORAS_OFICIAL',
      { name: nameHint, verses: versesHint }
    );
  }

  // Construir las secciones según la estructura solicitada
  const sections: PrayerSection[] = [
    {
      id: 'opening',
      title: 'Inicio',
      blocks: [
        createPlaceholderBlock(
          'opening-invite',
          'INVITATORY',
          'Invitatorio (Señor, abre mis labios...)',
          'Se dice de pie, con signo de la cruz'
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
          'Himno de Laudes para este día',
          'Se sentado'
        ),
      ],
    },
    {
      id: 'psalmody',
      title: 'Salmodia',
      blocks: [
        // Antífona 1
        createPlaceholderAntiphon('antiphon-1', 'Antífona 1 para el salmo 1'),
        // Salmo 1
        createPlaceholderPsalm('psalm-1', 147, '1-11'), // Ejemplo de salmo y versículos
        // Gloria 1
        createPlaceholderGloria('gloria-1'),
        // Antífona 1 (repetir)
        createPlaceholderAntiphon('antiphon-1-repeat', 'Antífona 1 para el salmo 1'),
        // Antífona 2
        createPlaceholderAntiphon('antiphon-2', 'Antífona 2 para el cántico'),
        // Cántico del Antiguo Testamento
        createPlaceholderCanticle(
          'canticle-ot',
          'CANTICLE_OT',
          'Cántico del Antiguo Testamento',
          'Ej: Daniel 3,57-88' // Ejemplo común
        ),
        // Gloria 2
        createPlaceholderGloria('gloria-2'),
        // Antífona 2 (repetir)
        createPlaceholderAntiphon('antiphon-2-repeat', 'Antífona 2 para el cántico'),
        // Antífona 3
        createPlaceholderAntiphon('antiphon-3', 'Antífona 3 para el salmo de alabanza'),
        // Salmo de alabanza (a menudo Salmos 148, 149, 150)
        createPlaceholderPsalm('praise-psalm', 148, '1-6'), // Ejemplo
        // Gloria 3
        createPlaceholderGloria('gloria-3'),
        // Antífona 3 (repetir)
        createPlaceholderAntiphon('antiphon-3-repeat', 'Antífona 3 para el salmo de alabanza'),
      ],
    },
    {
      id: 'reading',
      title: 'Lectura breve',
      blocks: [
        createPlaceholderBlock(
          'reading-text',
          'READING',
          'Lectura breve del día',
          'Se sentado'
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
          'Responsorio breve del día',
          'Se sentado'
        ),
      ],
    },
    {
      id: 'benedictus',
      title: 'Benedictus',
      blocks: [
        // Antífona del Benedictus
        createPlaceholderAntiphon('benedictus-antiphon', 'Antífona del Benedictus'),
        // Cántico evangélico (Benedictus)
        createPlaceholderCanticle(
          'benedictus-canticle',
          'CANTICLE_GOSPEL',
          'Benedictus',
          'Lucas 1,68-79'
        ),
        // Gloria
        createPlaceholderGloria('gloria-benedictus'),
        // Antífona del Benedictus (repetir)
        createPlaceholderAntiphon('benedictus-antiphon-repeat', 'Antífona del Benedictus'),
      ],
    },
    {
      id: 'intercessions',
      title: 'Preces',
      blocks: [
        createPlaceholderBlock(
          'intercessions-text',
          'INTERCESSIONS',
          'Preces de Laudes para este día',
          'Se sentado o de rodillas'
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
          'Oración del Señor',
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
          'Oración colecta conclusiva',
          'Se dice de pie'
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
          'Conclusión de Laudes (El Señor nos conceda su paz...)',
          'Se hace la señal de la cruz'
        ),
      ],
    },
  ];

  // Añadir rubrica específica al Padrenuestro (opcional, pero común)
  // Encontramos el bloque del Padrenuestro y le añadimos rubrica
  const ourFatherSection = sections.find(s => s.id === 'our-father');
  if (ourFatherSection && ourFatherSection.blocks.length > 0) {
    ourFatherSection.blocks[0] = {
      ...ourFatherSection.blocks[0],
      rubrics: 'Se dice de pie o de rodillas'
    };
  }

  // Determinar modo sugerido basado en preferencias
  const suggestedMode = preferences?.preferredMode ?? 'STANDARD';

  // En esta implementación básica, nunca está completamente verificado porque usamos placeholders
  const isFullyVerified = false;

  return {
    day,
    psalterWeek: day.psalterWeek,
    sections,
    suggestedMode,
    isFullyVerified
  };
}

/**
 * Función auxiliar para añadir una reflexión de IA a un bloque (si el modo lo permite).
 * 
 * NOTA: Esta función no modifica el texto oficial, solo añade una reflexión separada.
 * 
 * @param office - LaudsOffice al que añadir la reflexión
 * @param blockId - ID del bloque al que añadir la reflexión
 * @param reflection - Contenido de la reflexión de IA
 * @returns Nuevo LaudsOffice con la reflexión añadida (inmutable)
 */
export function addAiReflectionToBlock(
  office: LaudsOffice,
  blockId: string,
  reflection: Omit<AiReflection, 'id' | 'isRead'>
): LaudsOffice {
  // Crear una copia profunda mínima de las secciones y bloques afectados
  const newSections = office.sections.map(section => {
    const newBlocks = section.blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          aiReflection: {
            ...reflection,
            id: `${blockId}-ai-reflection-${Date.now()}`,
            isRead: false
          }
        };
      }
      return block;
    });
    return { ...section, blocks: newBlocks };
  });

  return {
    ...office,
    sections: newSections
  };
}
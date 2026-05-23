/**
 * Tipos principales para la aplicación LaudIA
 * Define la estructura de datos para el modelo litúrgico y de oración
 */

/**
 * Temporadas litúrgicas principales del año litúrgico romano
 * Basado en el Orden General del Año Litúrgico y del Calendario (OGACL)
 */
export type LiturgicalSeason =
  | 'ADVENTO'          // Adviento
  | 'NAVIDAD'          // Navidad
  | 'TIEMPO_ORDINARIO_1' // Tiempo Ordinario después de la Bautiza del Señor
  | 'CUARESMA'         // Cuaresma
  | 'TRIDUO_PASCUAL'   // Triduo Pascual (Jueves, Viernes y Sábado Santo)
  | 'PASCUA'           // Tiempo de Pascua
  | 'TIEMPO_ORDINARIO_2'; // Tiempo Ordinario después de Pentecostés

/**
 * Colores litúrgicos utilizados en las vestiduras y adornos
 */
export type LiturgicalColor =
  | 'WHITE'    // Blanco (Navidad, Pascua, solemnidades del Señor fuera de tiempo, fiestas de santos no mártires)
  | 'RED'      // Rojo (Domingo de Ramos, Viernes Santo, Pentecostés, fiestas de Apóstoles y mártires)
  | 'GREEN'    // Verde (Tiempo Ordinario)
  | 'VIOLET'   // Violeta (Adviento, Cuaresma, Misas de difuntos)
  | 'BLACK'    // Negro (opcional, Misas de difuntos)
  | 'ROSE';    // Rosa (Gaudete y Laetere - 3er Domingo de Adviento y 4to Domingo de Cuaresma)

/**
 * Jerarquía de celebraciones litúrgicas según el OGACL
 */
export type LiturgicalRank =
  | 'SOLEMNIDAD'     // Solemnidad (mayor grado de fiesta)
  | 'FIESTA'         // Fiesta
  | 'MEMORIA_OBLIGATORIA' // Memoria obligatoria
  | 'MEMORIA_OPcional'   // Memoria opcional (libre)
  | 'FERIA';         // Feria (día sin celebración particular)

/**
 * Representa una semana del Salterio (ciclo de 4 semanas para la Liturgia de las Horas)
 * Cada semana tiene una distribución de salmos para Laudes en cada día
 */
export interface PsalterWeek {
  week: 1 | 2 | 3 | 4; // Número de semana del Salterio (1-4)
  /**
   * Distribución de salmos y antífonas para Laudes de cada día
   * Las claves son los días de la semana en minúsculas
   */
  laudes: Record<
    string, // 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
    {
      /** Salmos asignados para Laudes de ese día */
      psalms: {
        number: number;   // Número del salmo según la Vulgata/Biblia Hebrea
        title?: string;   // Título opcional del salmo (para referencia)
      }[];
      /** Antífonas que acompañan a cada salmo (opcional) */
      antiphons?: string[]; // Referencias o textos de antífonas
    }
  >;
}

/**
 * Modos de uso de la aplicación para la experiencia de oración
 */
export type PrayerMode =
  | 'STANDARD'   // Modo estándar: solo muestra los textos oficiales
  | 'GUIDE';     // Modo guía: muestra textos oficiales + reflexiones IA opcionales

/**
 * Fuentes de los textos litúrgicos
 * Importante para rastrear la procedencia y asegurar que solo se usen textos oficiales
 */
export type OfficeSource =
  | 'LITURGIA_HORAS_OFICIAL'    // Textos de la Liturgia de las Horas aprobada
  | 'SALTERIO_OFICIAL'          // Salterio con antífonas aprobado
  | 'PROPIUM_DE_TIEMPO'         // Propio del tiempo (Adviento, Cuaresma, Pascua, etc.)
  | 'PROPIUM_DE_SANTOS'         // Propio de los santos (fecha específica)
  | 'COMUN_DE_SANTOS'           // Común de santos (para varios santos del mismo tipo)
  | 'COMMONS';                  // Otros comunes (dedicaciones, etc.)

/**
 * Estado de verificación de un texto litúrgico
 * Garantiza que se distinga claramente entre lo oficial y lo pendiente de revisión
 */
export type TextVerificationStatus =
  | 'VERIFIED'      // Texto verificado contra edición oficial
  | 'PENDING'       // Texto pendiente de verificación oficial
  | 'PLACEHOLDER';  // Placeholder evidente (no debe usarse en producción sin verificación)

/**
 * Representa un día litúrgico específico con toda su información
 * Permite calcular el oficium para cualquier fecha hasta 2030
 */
export interface LiturgicalDay {
  /** Fecha en formato ISO (YYYY-MM-DD) */
  date: string;
  
  /** Título de la celebración (ej: "Solemnidad de María, Madre de Dios") */
  title: string;
  
  /** Temporada litúrgica a la que pertenece */
  season: LiturgicalSeason;
  
  /** Color litúrgico correspondiente para ese día */
  color: LiturgicalColor;
  
  /** Jerarquía de la celebración */
  rank: LiturgicalRank;
  
  /** Semana del Salterio correspondiente (1-4) */
  psalterWeek: PsalterWeek['week'];
  
  /**
   * Indica si el día tiene propiamente asignado (es decir, textos propios
   * que sustituyen o complementan los delordinario)
   */
  hasProper: boolean;
  
  /**
   * Tipo de propio que tiene el día (si tiene proper)
   * Esto determina de dónde provienen las lecturas, antífonas, etc. específicos
   */
  properType?: 
    | 'TEMPORAL'    // Propio del tiempo (Adviento, Navidad, Cuaresma, Pascua, Tiempo Ordinario)
    | 'SANCTORAL'   // Propio de los santos (fecha fija en el calendario)
    | 'COMMON';     // Común (se usa un común apropiado según la categoría del santo)
  
  /** 
   * Para días con propio de santos o comunes: identificación del santo o celebración
   * Ej: for solemnity of St. Joseph: "Joseph, Husband of Mary"
   */
  commemorated?: string;
  
  /** Texto introductorio opcional para el día (fuente: Praenotanda) */
  introduction?: string;
}

/**
 * Unidad básica de contenido en la Liturgia de las Horas
 * Cada bloque representa una parte estructural con su texto y metadatos
 */
export interface PrayerBlock {
  /** Identificador único del bloque dentro de la oficina */
  id: string;
  
  /** Tipo de bloque según la estructura de Laudes */
  type: 
    | 'INVITATORY'    // Invitatorio (opcional, se dice antes de Laudes si no se hizo en Maitines)
    | 'HYMN'          // Himno
    | 'ANTIPHON'      // Antífona
    | 'PSALM'         // Salmo
    | 'GLORIA'        // Gloria Patri
    | 'CANTICLE_OT'   // Cántico del Antiguo Testamento
    | 'CANTICLE_GOSPEL' // Cántico evangélico (Benedictus, Magnificat, etc.)
    | 'READING'       // Lectura breve
    | 'RESPONSORY'    // Responsorio breve
    | 'INTERCESSIONS' // Preces
    | 'OUR_FATHER'    // Padrenuestro
    | 'CONCLUDING_PRAYER' // Oración conclusiva (después de preces)
    | 'CONCLUSION';   // Conclusión final
  
  /** Texto oficial del bloque (nunca generado por IA) */
  officialText: string;
  
  /** Estado de verificación del texto oficial */
  verificationStatus: TextVerificationStatus;
  
  /** Fuente oficial de donde proviene el texto */
  source: OfficeSource;
  
  /** 
   * Comentario opcional de IA para guía o reflexión.
   * NUNCA modifica o reemplaza el texto oficial, solo lo complementa informativamente.
   * Este campo debe estar claramente identificado como no oficial en la UI.
   */
  aiReflection?: AiReflection | null;
  
  /** Indicaciones rubrísticas opcionales (posturas, gestos, etc.) */
  rubrics?: string;
  
  /** 
   * Para bloques de salmo: información del salmo y antífona asociada (si aplica)
   * null para otros tipos de bloque
   */
  psalmInfo?: {
    number: number;
    /** Versículos del salmo que se rezan (opcional, para salmos largos) */
    verses?: string; // Ej: "1-5" o "1-7, 10-13"
    /** Antífona que precede y sigue al salmo (opcional, el bloque antífona por separado también puede existir) */
    antiphon?: {
      text: string;
      verificationStatus: TextVerificationStatus;
      source: OfficeSource;
    };
  } | null;
  
  /** 
   * Para bloques cántico: información opcional
   */
  canticleInfo?: {
    /** Nombre del cántico (ej: "Benedictus", "Magnificat") */
    name?: string;
    /** Versículos o sección que se rezan */
    verses?: string;
  } | null;
}

/**
 * Agrupación lógica de bloques que forman una sección completa
 * Útil para el progreso de oración y organización visual
 */
export interface PrayerSection {
  /** Identificador único de la sección */
  id: string;
  
  /** Título descriptivo de la sección */
  title: string;
  
  /** Bloques que componen esta sección en orden */
  blocks: PrayerBlock[];
  
  /** Indicador si la sección ha sido completada en la sesión actual */
  isCompleted?: boolean;
}

/**
 * Representa la Oficina de Laudes completa para un día específico
 * Contiene toda la estructura necesaria para guiar la oración
 */
export interface LaudsOffice {
  /** Día litúrgico al que corresponde esta oficina */
  day: LiturgicalDay;
  
  /** Semana del Salterio utilizada (redundante con day.psalterWeek pero útil para cálculos) */
  psalterWeek: PsalterWeek['week'];
  
  /** Todas las secciones de la oficina en orden de rezado */
  sections: PrayerSection[];
  
  /** 
   * Modo sugerido basado en preferencias del usuario y disponibilidad de contenidos IA
   * El usuario puede sobrescribir esta sugerencia
   */
  suggestedMode: PrayerMode;
  
  /** 
   * Indicador si toda la oficina tiene textos verificados
   * Útil para decidir si mostrar advertencias generales
   */
  isFullyVerified: boolean;
}

/**
 * Representa un día en el calendario litúrgico para navegación y vista mensual/semanal
 * Versión simplificada de LiturgicalDay para uso en widgets de calendario
 */
export interface CalendarDay {
  /** Fecha en formato ISO */
  date: string;
  
  /** Número del día del mes (1-31) */
  dayOfMonth: number;
  
  /** Día de la semana (0=domingo, 1=lunes, ..., 6=sábado) */
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  
  /** Título abreviado para mostrar en calendario */
  title: string;
  
  /** Color litúrgico del día */
  color: LiturgicalColor;
  
  /** Jerarquía de la celebración */
  rank: LiturgicalRank;
  
  /** Indica si es un día especial que merece destacar en el calendario */
  isHighlighted: boolean;
  
  /** Información de herramienta opcional */
  tooltip?: string;
}

/**
 * Preferencias del usuario relacionadas con su experiencia de oración
 * Almacenadas en localStorage o servidor según implementación
 */
export interface UserPrayerPreferences {
  /** Modo de oración preferido */
  preferredMode: PrayerMode;
  
  /** Tamaño de texto preferido */
  textSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
  
  /** Tipo de fuente preferido (serif, sans-serif, etc.) */
  fontFamily: 'SERIF' | 'SANS_SERIF' | 'MONOSPACE';
  
  /** Indicador si se quiere mostrar siempre las reflexiones IA */
  alwaysShowAiReflections: boolean;
  
  /** Indicador si se quiere escuchar audio de los textos (si está disponible) */
  enableAudio: boolean;
  
  /** Velocidad de lectura si se usa audio */
  audioRate: number; // 0.5 a 2.0
  
  /** Indicador si se quiere usar modo oscuro/nocturno */
  darkMode: boolean;
  
  /** Umbral para mostrar advertencias de textos no verificados */
  verificationWarningThreshold: 'ALL' | 'ANY_UNVERIFIED' | 'NEVER';
  
  /** Hora preferida para recordatorio de oración (opcional) */
  preferredPrayerTime?: string; // HH:MM formato 24h
}

/**
 * Reflexión o comentario generado por IA para guiar la oración
 * Estructura estrictamente separada del texto oficial
 */
export interface AiReflection {
  /** Identificador único de la reflexión */
  id: string;
  
  /** Texto de la reflexión (máximo longitud razonable para no distraer) */
  content: string;
  
  /** Tipo de reflexión */
  type: 
    | 'HISTORICAL'    // Comentario histórico/contextual
    | 'THEOLOGICAL'   // Comentario teológico o doctrinal
    | 'LITURGICAL'    // Comentario sobre el significado litúrgico
    | 'SPIRITUAL'     // Sugerencia espiritual o aplicación personal
    | 'WORD_STUDY';   // Estudio breve de una palabra o expresión
  
  /** Fuente o inspiración de la reflexión (opcional, para transparencia) */
  source?: string;
  
  /** Longitud estimada de lectura en segundos */
  estimatedReadingTimeSeconds: number;
  
  /** Indicador si la reflexión ha sido leída/acknowledgada por el usuario en esta sesión */
  isRead: boolean;
}

/**
 * Referencias a textos litúrgicos para un día del calendario.
 * No contiene los textos literales, solo rutas/claves para localizarlos.
 */
export interface TextRefs {
  hymn: string;
  antiphon1: string;
  psalm1: string;
  canticleOt: string;
  antiphon2: string;
  psalmLaudate: string;
  reading: string;
  responsory: string;
  benedictusAntiphon: string;
  intercessions: string;
  closingPrayer: string;
}

/**
 * Entrada del calendario litúrgico (formato JSON en /data/laudia/calendar/).
 * Representa un día con su metadata y referencias textuales.
 */
export interface CalendarDayEntry {
  date: string;
  celebrationName: string;
  season: string;
  rank: LiturgicalRank;
  color: LiturgicalColor;
  psalterWeek: PsalterWeek['week'];
  easterRelated?: {
    daysAfterEaster?: number;
    daysBeforeEaster?: number;
    feastGroup?: 'PRE_PASCHAL' | 'PASCHAL' | 'ORDINARY';
  };
  textRefs: TextRefs;
  verificationStatus: 'pending' | 'needs_review' | 'verified';
  sourceNote: string;
  textSourceNote: string;
}

/**
 * Archivo de calendario anual completo.
 */
export interface CalendarYearFile {
  year: number;
  liturgicalYear: number;
  generatedAt: string;
  totalDays: number;
  days: CalendarDayEntry[];
}

/**
 * Resultado de una validación litúrgica individual.
 */
export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  details?: string;
  blockId?: string;
  sectionId?: string;
}

/**
 * Resultado completo de la validación de un LaudsOffice.
 */
export interface ValidationResult {
  date: string;
  celebrationName: string;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  infos: ValidationIssue[];
  /** true si hay al menos un error */
  hasErrors: boolean;
  /** true si hay al menos una advertencia */
  hasWarnings: boolean;
  /** true si no hay errores ni advertencias */
  isClean: boolean;
}

/**
 * Resultado de la operación de construcción de una oficina litúrgica
 * Separa exitoso de error para manejo adecuado
 */
export type BuildOfficeResult = {
  success: true;
  office: LaudsOffice;
} | {
  success: false;
  error: string;
  /** Fecha para la que falló la construcción */
  date: string;
};
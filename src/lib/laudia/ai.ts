import { PrayerBlock, LaudsOffice, LiturgicalDay } from '@/types/laudia';

// ── Disclaimer ─────────────────────────────────────────────────────────────

export const AI_DISCLAIMER = 'La explicación IA no sustituye el texto litúrgico oficial.';

// ── Types ──────────────────────────────────────────────────────────────────

export type AiProvider = 'mock' | 'openai' | 'custom';

export interface AiConfig {
  provider: AiProvider;
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export interface AiResponse {
  content: string;
  disclaimer: string;
  isMock: boolean;
}

// ── Configuration (change to switch provider) ──────────────────────────────

const config: AiConfig = {
  provider: 'mock', // change to 'openai' or 'custom' when a real backend is ready
};

export function getAiConfig(): Readonly<AiConfig> {
  return config;
}

export function setAiConfig(partial: Partial<AiConfig>): void {
  Object.assign(config, partial);
}

// ── Mock responses ─────────────────────────────────────────────────────────

const MOCK_EXPLAIN_BLOCK: Record<string, string> = {
  INVITATORY: 'El Invitatorio abre los Laudes con el salmo 94 (u otro salmo de invitación). Es una llamada a la alabanza: «Venid, aclamemos al Señor». Su función es disponer el corazón para la oración matutina, recordando que Dios nos espera al inicio del día.',
  HYMN: 'El himno es un poema cantado que introduce el tema del día o de la temporada litúrgica. Los himnos de Laudes suelen alabar la luz del nuevo día y la victoria de Cristo sobre las tinieblas. Cada tiempo litúrgico tiene sus propios himnos.',
  PSALM: 'Los salmos son la oración por excelencia de la Iglesia. En Laudes se rezan salmos de alabanza, porque la mañana es el momento de bendecir a Dios por el nuevo día. Cada salmo va precedido y seguido de una antífona que ayuda a comprenderlo desde la perspectiva cristiana.',
  CANTICLE_OT: 'Los cánticos del Antiguo Testamento son textos poéticos tomados de los libros proféticos o históricos. En Laudes ocupan el lugar del segundo salmo, aportando variedad y profundidad a la salmodia.',
  CANTICLE_GOSPEL: 'El Benedictus (Lc 1,68-79) es el cántico evangélico de Laudes, pronunciado por Zacarías al recuperar el habla. Bendice a Dios por la visita del Mesías y anuncia la misión de Juan el Bautista. Es el momento culminante de los Laudes.',
  READING: 'La lectura breve es un pasaje de la Escritura, normalmente del Nuevo Testamento o de los profetas. Tras la lectura se guarda un breve silencio para interiorizar la Palabra.',
  RESPONSORY: 'El responsorio breve es una aclamación que responde a la lectura, tomando un versículo que se repite como eco. Ayuda a fijar el mensaje en el corazón.',
  INTERCESSIONS: 'Las preces de Laudes son súplicas matutinas por la Iglesia, el mundo y las necesidades del día. Se estructuran como una letanía: cada intención va seguida de una respuesta («Te rogamos, óyenos»).',
  OUR_FATHER: 'El Padrenuestro es la oración que el Señor nos enseñó. En la Liturgia de las Horas se reza al final de las preces, como síntesis de todas las súplicas y preparación para la oración conclusiva.',
  CONCLUDING_PRAYER: 'La oración conclusiva (colecta) recoge el sentido del día litúrgico y de la celebración. Varía según el tiempo, la fiesta o la memoria del día.',
  CONCLUSION: 'La conclusión de Laudes es breve: el sacerdote o quien dirige bendice a la asamblea y se despide con «Podéis ir en paz». En la oración individual, se termina con «El Señor nos conceda su paz» y la señal de la cruz.',
};

const MOCK_MORNING_REFLECTION =
  'Esta mañana, la liturgia nos invita a abrir el corazón a la luz de Cristo. Cada nuevo amanecer es un recordatorio de la fidelidad de Dios: su misericordia se renueva cada día. Tómate un momento para respirar profundamente y ofrecer este día al Señor, pidiéndole que te conceda un corazón atento a su Palabra y disponible para servir a los demás.';

const MOCK_FAMILY_GUIDE = 'Rezar los Laudes en familia puede ser un momento de encuentro y paz antes de comenzar las actividades. Sugerencias para hoy:\n' +
  '• Un adulto guía la oración y las lecturas.\n' +
  '• Los niños pueden decir las antífonas o acompañar con gestos sencillos.\n' +
  '• Tras la lectura breve, compartid una palabra o pensamiento que os haya llamado la atención.\n' +
  '• Las preces pueden incluir intenciones personales de cada miembro de la familia.\n' +
  '• Terminad con un gesto de paz (un abrazo o una sonrisa) antes de empezar el día.';

const MOCK_SPIRITUAL_QUESTIONS = 'Preguntas para la reflexión personal tras los Laudes:\n\n' +
  '1. ¿Qué palabra o frase de la liturgia de hoy me ha llegado al corazón?\n' +
  '2. ¿Hay algo en mi vida por lo que quiera dar gracias a Dios esta mañana?\n' +
  '3. ¿Hay alguna persona o situación por la que sienta que debo orar hoy?\n' +
  '4. ¿Cómo puedo vivir la alegría del Evangelio en mis actividades de hoy?\n' +
  '5. ¿Qué aspecto de mi carácter necesito ofrecer a Dios para que lo transforme?';

const MOCK_PURPOSE_TODAY = 'Hoy, elige una intención concreta para tu día. Puede ser algo pequeño: sonreír a alguien, escuchar con atención, dar las gracias por algo que normalmente das por sentado, o simplemente recordar durante el día que Dios camina contigo. Anota tu propósito en un papel o en tu corazón, y al final del día, vuelve a él para ver cómo lo has vivido.';

function mockLiturgicalDayExplanation(day: LiturgicalDay): string {
  return (
    `Hoy celebramos: **${day.title}**. ` +
    `Pertenece al tiempo de ${day.season.replace(/_/g, ' ').toLowerCase()}, ` +
    `con el rango de ${day.rank.replace(/_/g, ' ').toLowerCase()}. ` +
    `El color litúrgico es el ${colorName(day.color)}. ` +
    `Corresponde a la semana ${day.psalterWeek} del Salterio.` +
    (day.hasProper
      ? `\n\nEste día tiene propio litúrgico (${day.properType?.toLowerCase() === 'sanctoral' ? 'propio de los santos' : day.properType?.toLowerCase() === 'temporal' ? 'propio del tiempo' : 'común de santos'}), lo que significa que algunas partes de Laudes tienen textos específicos para esta celebración.`
      : '')
  );
}

function colorName(color: string): string {
  const names: Record<string, string> = {
    WHITE: 'blanco',
    RED: 'rojo',
    GREEN: 'verde',
    VIOLET: 'violeta',
    BLACK: 'negro',
    ROSE: 'rosa',
  };
  return names[color] || color.toLowerCase();
}

// ── Public API (mock default) ──────────────────────────────────────────────

export async function explainPrayerBlock(block: PrayerBlock): Promise<AiResponse> {
  const explanation = MOCK_EXPLAIN_BLOCK[block.type] ?? 'Este bloque forma parte de la estructura de Laudes.';
  return {
    content: explanation,
    disclaimer: AI_DISCLAIMER,
    isMock: config.provider === 'mock',
  };
}

export async function generateMorningReflection(_office: LaudsOffice): Promise<AiResponse> {
  return {
    content: MOCK_MORNING_REFLECTION,
    disclaimer: AI_DISCLAIMER,
    isMock: config.provider === 'mock',
  };
}

export async function generateFamilyGuide(_office: LaudsOffice): Promise<AiResponse> {
  return {
    content: MOCK_FAMILY_GUIDE,
    disclaimer: AI_DISCLAIMER,
    isMock: config.provider === 'mock',
  };
}

export async function generateSpiritualQuestions(_office: LaudsOffice): Promise<AiResponse> {
  return {
    content: MOCK_SPIRITUAL_QUESTIONS,
    disclaimer: AI_DISCLAIMER,
    isMock: config.provider === 'mock',
  };
}

export async function generatePurposeForToday(_office: LaudsOffice): Promise<AiResponse> {
  return {
    content: MOCK_PURPOSE_TODAY,
    disclaimer: AI_DISCLAIMER,
    isMock: config.provider === 'mock',
  };
}

export async function explainLiturgicalDay(day: LiturgicalDay): Promise<AiResponse> {
  return {
    content: mockLiturgicalDayExplanation(day),
    disclaimer: AI_DISCLAIMER,
    isMock: config.provider === 'mock',
  };
}

// ── Generic call for real provider (future) ────────────────────────────────

export async function callAi(
  prompt: string,
  _context?: unknown,
): Promise<AiResponse> {
  if (config.provider === 'openai' && config.apiKey) {
    // ── Real OpenAI call (placeholder) ────────────────────────────────────
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` },
    //   body: JSON.stringify({
    //     model: config.model ?? 'gpt-4o-mini',
    //     messages: [{ role: 'user', content: prompt }],
    //     max_tokens: 500,
    //   }),
    // });
    // const data = await response.json();
    // const content = data.choices?.[0]?.message?.content ?? '';
    // return { content, disclaimer: AI_DISCLAIMER, isMock: false };

    throw new Error('OpenAI provider not yet connected');
  }

  if (config.provider === 'custom' && config.endpoint) {
    // ── Custom endpoint call (placeholder) ────────────────────────────────
    throw new Error('Custom provider not yet connected');
  }

  // Fallback mock
  return {
    content: prompt,
    disclaimer: AI_DISCLAIMER,
    isMock: true,
  };
}

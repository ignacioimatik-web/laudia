import { buildLaudsOffice } from '@/lib/laudia/prayer-builder';
import { LaudsOffice, PrayerSection } from '@/types/laudia';

const MONTH_SEGMENTS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function decodeHtml(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

function normalizeHtmlToText(html: string): string {
  let out = html;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<style[\s\S]*?<\/style>/gi, '');
  out = out.replace(/<br\s*\/?>/gi, '\n');
  out = out.replace(/<\/p>/gi, '\n\n');
  out = out.replace(/<[^>]+>/g, '');
  out = decodeHtml(out);
  out = out.replace(/\r/g, '');
  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.replace(/[ \t]+\n/g, '\n');
  out = out.replace(/\n[ \t]+/g, '\n');
  return out.trim();
}

function extractSection(source: string, start: RegExp, end?: RegExp): string | null {
  const startMatch = source.match(start);
  if (!startMatch || startMatch.index === undefined) {
    return null;
  }
  const startIndex = startMatch.index;
  const rest = source.slice(startIndex);
  if (!end) {
    return rest.trim();
  }
  const endMatch = rest.match(end);
  if (!endMatch || endMatch.index === undefined) {
    return rest.trim();
  }
  return rest.slice(0, endMatch.index).trim();
}

function buildSectionsFromText(text: string): PrayerSection[] | null {
  const bodyStart = text.search(/\bLAUDES\b/i);
  const body = bodyStart >= 0 ? text.slice(bodyStart) : text;

  const opening = extractSection(body, /INVITATORIO/i, /Himno:/i);
  const hymn = extractSection(body, /Himno:/i, /SALMODIA/i);
  const psalmody = extractSection(body, /SALMODIA/i, /LECTURA BREVE/i);
  const reading = extractSection(body, /LECTURA BREVE/i, /RESPONSORIO BREVE/i);
  const responsory = extractSection(body, /RESPONSORIO BREVE/i, /C[AÁ]NTICO EVANG[EÉ]LICO/i);
  const benedictus = extractSection(body, /C[AÁ]NTICO EVANG[EÉ]LICO/i, /PRECES/i);
  const intercessions = extractSection(body, /PRECES/i, /Padre nuestro/i);
  const ourFather = extractSection(body, /Padre nuestro/i, /ORACI[OÓ]N|ORACION/i);
  const concludingPrayer = extractSection(body, /ORACI[OÓ]N|ORACION/i, /CONCLUSI[OÓ]N|CONCLUSION/i);
  const conclusion = extractSection(body, /CONCLUSI[OÓ]N|CONCLUSION/i);

  if (!opening || !hymn || !psalmody || !reading || !responsory || !benedictus || !intercessions || !ourFather || !concludingPrayer || !conclusion) {
    return null;
  }

  return [
    { id: 'opening', title: 'Inicio', blocks: [{ id: 'opening-text', type: 'INVITATORY', officialText: opening, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
    { id: 'hymn', title: 'Himno', blocks: [{ id: 'hymn-text', type: 'HYMN', officialText: hymn, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
    { id: 'psalmody', title: 'Salmodia', blocks: [{ id: 'psalmody-text', type: 'PSALM', officialText: psalmody, verificationStatus: 'PENDING', source: 'SALTERIO_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
    { id: 'reading', title: 'Lectura breve', blocks: [{ id: 'reading-text', type: 'READING', officialText: reading, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
    { id: 'responsory', title: 'Responsorio breve', blocks: [{ id: 'responsory-text', type: 'RESPONSORY', officialText: responsory, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
    { id: 'benedictus', title: 'Benedictus', blocks: [{ id: 'benedictus-text', type: 'CANTICLE_GOSPEL', officialText: benedictus, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: { name: 'Benedictus' } }] },
    { id: 'intercessions', title: 'Preces', blocks: [{ id: 'intercessions-text', type: 'INTERCESSIONS', officialText: intercessions, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
    { id: 'our-father', title: 'Padrenuestro', blocks: [{ id: 'our-father-text', type: 'OUR_FATHER', officialText: ourFather, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
    { id: 'concluding-prayer', title: 'Oración conclusiva', blocks: [{ id: 'concluding-prayer-text', type: 'CONCLUDING_PRAYER', officialText: concludingPrayer, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
    { id: 'conclusion', title: 'Conclusión', blocks: [{ id: 'conclusion-text', type: 'CONCLUSION', officialText: conclusion, verificationStatus: 'PENDING', source: 'LITURGIA_HORAS_OFICIAL', aiReflection: null, psalmInfo: null, canticleInfo: null }] },
  ];
}

async function fetchLaudesHtml(date: Date): Promise<string> {
  const year = date.getFullYear();
  const month = MONTH_SEGMENTS[date.getMonth()];
  const day = pad2(date.getDate());

  const base = `https://liturgiadelashoras.github.io/sync/${year}/${month}/${day}`;
  const candidates = [`${base}/laudes.htm`, `${base}/1/laudes.htm`, `${base}/2/laudes.htm`, `${base}/3/laudes.htm`];

  for (const url of candidates) {
    const response = await fetch(url);
    if (response.ok) {
      return response.text();
    }
  }

  throw new Error('No se encontró el archivo de Laudes para la fecha solicitada.');
}

export async function buildLaudsOfficeFromOfficialSource(date: Date): Promise<LaudsOffice> {
  const fallback = buildLaudsOffice(date);

  try {
    const html = await fetchLaudesHtml(date);
    const plainText = normalizeHtmlToText(html);
    const sections = buildSectionsFromText(plainText);

    if (!sections) {
      return fallback;
    }

    return {
      ...fallback,
      sections,
      isFullyVerified: false,
    };
  } catch {
    return fallback;
  }
}

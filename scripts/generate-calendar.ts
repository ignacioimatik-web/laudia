/**
 * Generador del calendario litúrgico 2026–2030
 *
 * Produce un JSON por año en /data/laudia/calendar/ con la estructura:
 *
 *   {
 *     "date": "2027-02-12",
 *     "celebrationName": "...",
 *     "season": "...",
 *     "rank": "...",
 *     "color": "...",
 *     "psalterWeek": 1,
 *     "textRefs": { hymn, antiphon1, psalm1, … },
 *     "verificationStatus": "pending",
 *     "sourceNote": "Calendario litúrgico estructural – pendiente de validación oficial"
 *   }
 *
 * Reglas:
 *  - No inventa textos oficiales.
 *  - El calendario estructural se genera con el motor litúrgico existente.
 *  - textRefs contiene solo claves de referencia (no textos literales).
 *  - verificationStatus = "pending" para todo (aún sin fuentes oficiales).
 *  - Existe sourceNote por día.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { getLiturgicalDay, getEasterDate, getMoveableFeasts } from '../src/lib/laudia/liturgical-calendar';
import { LiturgicalDay, LiturgicalSeason, LiturgicalColor, LiturgicalRank } from '../src/types/laudia';

// ── Config ─────────────────────────────────────────────────────────────────

const START_YEAR = 2026;
const END_YEAR = 2030;
const OUT_DIR = path.resolve(__dirname, '..', 'data', 'laudia', 'calendar');

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const SOURCE_NOTE = 'Calendario litúrgico estructural – pendiente de validación oficial. Generado con el algoritmo anónimo gregoriano (Pascua) y reglas de temporada/color/rango simplificadas. Requiere verificación contra el Ordo litúrgico oficial.';
const TEXT_SOURCE_NOTE = 'Referencia a texto litúrgico pendiente de cargar/verificar. Los textos oficiales deben obtenerse de fuentes autorizadas (Liturgia de las Horas aprobada por la CEE).';

// ── Mapear tipos internos → strings del JSON ───────────────────────────────

const seasonMap: Record<LiturgicalSeason, string> = {
  ADVENTO: 'ADVIENTO',
  NAVIDAD: 'NAVIDAD',
  TIEMPO_ORDINARIO_1: 'TIEMPO_ORDINARIO',
  CUARESMA: 'CUARESMA',
  TRIDUO_PASCUAL: 'TRIDUO_PASCUAL',
  PASCUA: 'PASCUA',
  TIEMPO_ORDINARIO_2: 'TIEMPO_ORDINARIO',
};

function mapSeason(s: LiturgicalSeason): string {
  return seasonMap[s] || 'TIEMPO_ORDINARIO';
}

// ── Generar referencias de texto para un día ──────────────────────────────

function buildTextRefs(day: LiturgicalDay, year: number) {
  const season = day.season;
  const isProper = day.hasProper;
  const usesProperOfTime =
    season === 'ADVENTO' ||
    season === 'NAVIDAD' ||
    season === 'CUARESMA' ||
    season === 'TRIDUO_PASCUAL' ||
    season === 'PASCUA';

  return {
    hymn: `hymn:${isProper && usesProperOfTime ? `${day.properType?.toLowerCase() ?? 'temporal'}/${day.date}` : `commons/${season.toLowerCase()}`}`,
    antiphon1: `antiphon:psalter-week-${day.psalterWeek}`,
    psalm1: `psalm:psalter-week-${day.psalterWeek}/${day.date.split('-')[2]}`,
    canticleOt: `canticle:ot/psalter-week-${day.psalterWeek}`,
    antiphon2: `antiphon:psalter-week-${day.psalterWeek}`,
    psalmLaudate: `psalm:laudate/psalter-week-${day.psalterWeek}`,
    reading: isProper && usesProperOfTime
      ? `reading:proper-of-time/${day.date}`
      : `reading:commons/${season.toLowerCase()}`,
    responsory: isProper && usesProperOfTime
      ? `responsory:proper-of-time/${day.date}`
      : `responsory:commons/${season.toLowerCase()}`,
    benedictusAntiphon: isProper
      ? `antiphon:benedictus/${day.properType?.toLowerCase() ?? 'temporal'}/${day.date}`
      : `antiphon:benedictus/psalter-week-${day.psalterWeek}/${day.date.split('-')[2]}`,
    intercessions: `intercessions:${day.season === 'CUARESMA' || day.season === 'PASCUA' || day.season === 'TRIDUO_PASCUAL' ? 'proper' : 'commons'}/${day.season.toLowerCase()}`,
    closingPrayer: `prayer:${isProper ? `${day.properType?.toLowerCase() ?? 'temporal'}/${day.date}` : `commons/${season.toLowerCase()}`}`,
  };
}

// ── Generar un año completo ────────────────────────────────────────────────

interface CalendarDayEntry {
  date: string;
  celebrationName: string;
  season: string;
  rank: string;
  color: string;
  psalterWeek: number;
  easterRelated?: {
    daysAfterEaster?: number;
    daysBeforeEaster?: number;
    feastGroup?: string;
  };
  textRefs: Record<string, string>;
  verificationStatus: 'pending' | 'needs_review' | 'verified';
  sourceNote: string;
  textSourceNote: string;
}

function generateYear(year: number): CalendarDayEntry[] {
  const days: CalendarDayEntry[] = [];
  const easter = getEasterDate(year);
  const feasts = getMoveableFeasts(year);

  const feastDates: Record<string, Date> = {
    'Ash Wednesday': feasts.ashWednesday,
    'Palm Sunday': feasts.palmSunday,
    'Holy Thursday': feasts.holyThursday,
    'Good Friday': feasts.goodFriday,
    'Holy Saturday': feasts.holySaturday,
    'Easter Sunday': feasts.easterSunday,
    'Ascension': feasts.ascension,
    'Pentecost': feasts.pentecost,
    'Trinity Sunday': feasts.trinitySunday,
    'Corpus Christi': feasts.corpusChristi,
    'Sacred Heart': feasts.sacredHeart,
    'Christ the King': feasts.christTheKing,
  };

  const feastNameMap: Record<string, string> = {
    'Ash Wednesday': 'Miércoles de Ceniza',
    'Palm Sunday': 'Domingo de Ramos de la Pasión del Señor',
    'Holy Thursday': 'Jueves Santo',
    'Good Friday': 'Viernes Santo de la Pasión del Señor',
    'Holy Saturday': 'Sábado Santo',
    'Easter Sunday': 'Domingo de Pascua de la Resurrección del Señor',
    'Ascension': 'Ascensión del Señor',
    'Pentecost': 'Pentecostés',
    'Trinity Sunday': 'Santísima Trinidad',
    'Corpus Christi': 'Santísimo Cuerpo y Sangre de Cristo',
    'Sacred Heart': 'Sagrado Corazón de Jesús',
    'Christ the King': 'Nuestro Señor Jesucristo, Rey del Universo',
  };

  const fixedSolemnities: [number, number, string][] = [
    [0, 1, 'Solemnidad de María, Madre de Dios'],
    [0, 6, 'Epifanía del Señor'],
    [2, 19, 'Solemnidad de San José'],
    [2, 25, 'Solemnidad de la Anunciación del Señor'],
    [5, 24, 'Solemnidad de la Natividad de San Juan Bautista'],
    [5, 29, 'Solemnidad de los Santos Pedro y Pablo, Apóstoles'],
    [7, 15, 'Solemnidad de la Asunción de la Bienaventurada Virgen María'],
    [10, 1, 'Solemnidad de Todos los Santos'],
    [11, 8, 'Solemnidad de la Inmaculada Concepción de la Bienaventurada Virgen María'],
    [11, 25, 'Solemnidad de la Navidad del Señor'],
  ];

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = toLocalDateStr(date);
      const liturgicalDay = getLiturgicalDay(date);

      // Determine celebration name
      let celebrationName = liturgicalDay.title;

      // For moveable feasts, override with proper name
      for (const [feastKey, feastDate] of Object.entries(feastDates)) {
        if (toLocalDateStr(feastDate) === dateStr) {
          celebrationName = feastNameMap[feastKey] || celebrationName;
          break;
        }
      }

      // For fixed solemnities, override
      for (const [m, d, name] of fixedSolemnities) {
        if (month === m && day === d) {
          celebrationName = name;
          break;
        }
      }

      // Build Easter relation
      const diffFromEaster = Math.round((date.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));
      let easterRelated: CalendarDayEntry['easterRelated'] | undefined;

      if (Math.abs(diffFromEaster) <= 70 || // within ~10 weeks of Easter
          toLocalDateStr(feasts.christTheKing) === dateStr) {
        easterRelated = {
          daysAfterEaster: diffFromEaster >= 0 ? diffFromEaster : undefined,
          daysBeforeEaster: diffFromEaster < 0 ? Math.abs(diffFromEaster) : undefined,
        };

        if (diffFromEaster < 0 && diffFromEaster >= -46) {
          easterRelated.feastGroup = 'PRE_PASCHAL';
        } else if (diffFromEaster >= 0 && diffFromEaster <= 63) {
          easterRelated.feastGroup = 'PASCHAL';
        } else {
          easterRelated.feastGroup = 'ORDINARY';
        }
      }

      const entry: CalendarDayEntry = {
        date: dateStr,
        celebrationName,
        season: mapSeason(liturgicalDay.season),
        rank: liturgicalDay.rank,
        color: liturgicalDay.color,
        psalterWeek: liturgicalDay.psalterWeek,
        easterRelated,
        textRefs: buildTextRefs(liturgicalDay, year),
        verificationStatus: 'pending',
        sourceNote: SOURCE_NOTE,
        textSourceNote: TEXT_SOURCE_NOTE,
      };

      days.push(entry);
    }
  }

  return days;
}

// ── Ejecución ──────────────────────────────────────────────────────────────

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

for (let year = START_YEAR; year <= END_YEAR; year++) {
  console.log(`Generando calendario litúrgico ${year}…`);
  const days = generateYear(year);

  const outPath = path.join(OUT_DIR, `${year}.json`);

  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        year,
        liturgicalYear: year - 1, // el año litúrgico comienza en Adviento del año anterior
        generatedAt: new Date().toISOString(),
        totalDays: days.length,
        days,
      },
      null,
      2,
    ),
    'utf-8',
  );

  console.log(`  → ${outPath} (${days.length} días)`);
}

// ── Reporte de resumen ────────────────────────────────────────────────────

const fixedSolemnityNames = [
  'María, Madre de Dios',
  'Epifanía',
  'San José',
  'Anunciación',
  'San Juan Bautista',
  'San Pedro y San Pablo',
  'Asunción',
  'Todos los Santos',
  'Inmaculada Concepción',
  'Navidad',
];

const moveableFeastNames = [
  'Miércoles de Ceniza',
  'Domingo de Ramos',
  'Jueves Santo',
  'Viernes Santo',
  'Sábado Santo',
  'Domingo de Pascua',
  'Ascensión',
  'Pentecostés',
  'Santísima Trinidad',
  'Corpus Christi',
  'Sagrado Corazón',
  'Cristo Rey',
];

console.log('\n✅ Calendario litúrgico generado.\n');
console.log('📅 Años:', `${START_YEAR}–${END_YEAR}`);
console.log('📁 Salida:', OUT_DIR);
console.log('');
console.log('⚠️  ADVERTENCIA: Todos los datos son estructurales y están marcados como "pending".');
console.log('   No contienen textos oficiales. Deben validarse contra el Ordo litúrgico oficial.\n');

console.log('📌 Solemnidades fijas incluidas:');
fixedSolemnityNames.forEach(n => console.log(`   • ${n}`));
console.log('');
console.log('📌 Fiestas móviles incluidas (basadas en Pascua):');
moveableFeastNames.forEach(n => console.log(`   • ${n}`));
console.log('');
console.log('🔑 Las referencias textuales (textRefs) usan el formato:\n');
console.log('   hymn:             {tipo}/{ref}');
console.log('   antiphonN:        {tipo}/{ref}');
console.log('   psalmN:           {tipo}/{ref}');
console.log('   reading:          {tipo}/{ref}');
console.log('   responsory:       {tipo}/{ref}');
console.log('   benedictusAntiphon: {tipo}/{ref}');
console.log('   intercessions:    {tipo}/{ref}');
console.log('   closingPrayer:    {tipo}/{ref}\n');
console.log('   → proper-of-time / proper-of-saints / commons / psalter-week-N');

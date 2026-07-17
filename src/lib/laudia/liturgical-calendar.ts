import {
  LiturgicalDay,
  LiturgicalSeason,
  LiturgicalColor,
  LiturgicalRank,
  PsalterWeek,
  CalendarDay,
} from '@/types/laudia';

/**
 * Convierte un Date a YYYY-MM-DD usando componentes de tiempo LOCAL.
 * Evita el desfase de huso horario que causa .toISOString().
 */
function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Liturgical Calendar Engine - Basic Implementation
 * 
 * NOTE: This is a simplified liturgical calendar for demonstration purposes.
 * It does NOT claim to be officially complete or accurate for all particular
 * calendars (local/proper). For production use with official liturgical texts,
 * this should be replaced with or validated against authoritative liturgical
 * calendars (e.g., Vatican's Ordo, national conference calendars).
 */

/**
 * Calcula la fecha de Domingo de Pascua para un año dado usando el
 * algoritmo anonimo gregoriano (valido para años 1583-4099).
 * 
 * @param year - Año gregoriano (ej: 2026)
 * @returns Objeto Date representando el Domingo de Pascua
 */
export function getEasterDate(year: number): Date {
  // Algorithm from Anonymous Gregorian version
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  // month: 3 = March, 4 = April
  return new Date(year, month - 1, day);
}

/**
 * Obtiene la fecha de un domingo que cae N días después de una fecha dada.
 */
function getSundayAfter(date: Date, daysAfter: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + daysAfter);
  // Adjust to next Sunday if not already Sunday
  const day = result.getDay(); // 0 = Sunday
  const offset = (day === 0) ? 0 : (7 - day);
  result.setDate(result.getDate() + offset);
  return result;
}

/**
 * Obtiene la fecha de un domingo que cae N días antes de una fecha dada.
 */
function getSundayBefore(date: Date, daysBefore: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - daysBefore);
  // Adjust to previous Sunday
  const day = result.getDay(); // 0 = Sunday
  const offset = (day === 0) ? 7 : day;
  result.setDate(result.getDate() - offset);
  return result;
}

/**
 * Calcula fechas importantes relacionadas con Pascua.
 */
export function getMoveableFeasts(year: number): {
  ashWednesday: Date;
  palmSunday: Date;
  holyThursday: Date;
  goodFriday: Date;
  holySaturday: Date;
  easterSunday: Date;
  ascension: Date;
  pentecost: Date;
  trinitySunday: Date;
  corpusChristi: Date;
  sacredHeart: Date;
  christTheKing: Date;
} {
  const easter = getEasterDate(year);

  // Ash Wednesday: 46 days before Easter (including Sundays)
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);

  // Palm Sunday: Sunday before Easter
  const palmSunday = getSundayBefore(easter, 0); // actually just previous Sunday

  // Holy Thursday: Thursday before Easter
  const holyThursday = new Date(easter);
  holyThursday.setDate(easter.getDate() - 3);

  // Good Friday: Friday before Easter
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  // Holy Saturday: Saturday before Easter
  const holySaturday = new Date(easter);
  holySaturday.setDate(easter.getDate() - 1);

  // Ascension: Thursday 6th week of Easter (39 days after Easter)
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);

  // Pentecost: 49 days after Easter (or 7 weeks)
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);

  // Trinity Sunday: Sunday after Pentecost
  const trinitySunday = getSundayAfter(pentecost, 0);

  // Corpus Christi: Thursday after Trinity Sunday (or 60 days after Easter)
  // In many places transferred to following Sunday; we keep Thursday
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);

  // Sacred Heart: Friday after Corpus Christi (19 days after Pentecost)
  const sacredHeart = new Date(corpusChristi);
  sacredHeart.setDate(corpusChristi.getDate() + 1);

  // Christ the King: Sunday before Advent (last Sunday of Ordinary Time)
  // Approximated as Sunday between Nov 20-26
  const christTheKing = new Date(year, 10, 20); // Nov 20
  const day = christTheKing.getDay(); // 0 = Sunday
  const offset = (day === 0) ? 0 : (7 - day);
  christTheKing.setDate(christTheKing.getDate() + offset);
  // If date > Nov 26, subtract 7 days
  if (christTheKing.getDate() > 26) {
    christTheKing.setDate(christTheKing.getDate() - 7);
  }

  return {
    ashWednesday,
    palmSunday,
    holyThursday,
    goodFriday,
    holySaturday,
    easterSunday: easter,
    ascension,
    pentecost,
    trinitySunday,
    corpusChristi,
    sacredHeart,
    christTheKing,
  };
}

/**
 * Determina la temporada litúrgica básica para una fecha dada.
 * Esta es una aproximación simple basada en fechas fijas y Pascua.
 */
export function getLiturgicalSeason(date: Date): LiturgicalSeason {
  const year = date.getFullYear();
  const easter = getEasterDate(year);
  const feasts = getMoveableFeasts(year);

  // Christmas season (Dec 25 - Baptism of Lord, approx Jan 13)
  // For simplicity: Dec 24 to Jan 13
  if (
    (date.getMonth() === 11 && date.getDate() >= 24) || // Dec 24-31
    (date.getMonth() === 0 && date.getDate() <= 13)   // Jan 1-13
  ) {
    return 'NAVIDAD';
  }

  // Lent: Ash Wednesday to Holy Thursday (exclusive)
  if (date >= feasts.ashWednesday && date < feasts.holyThursday) {
    return 'CUARESMA';
  }

  // Triduum: Holy Thursday evening to Easter Sunday (exclusive)
  // We'll approximate as Holy Thursday to Holy Saturday
  if (date >= feasts.holyThursday && date <= feasts.holySaturday) {
    return 'TRIDUO_PASCUAL';
  }

  // Easter: Easter Sunday through Pentecost (exclusive of Pentecost)
  if (date >= feasts.easterSunday && date < feasts.pentecost) {
    return 'PASCUA';
  }

  // Advent: 4 Sundays before Christmas (approx Dec 3-24)
  // Simple: from 4th Sunday before Dec 25 to Dec 24
  const christmas = new Date(year, 11, 25);
  const fourthSundayBeforeChristmas = getSundayBefore(christmas, 21); // approx
  if (date >= fourthSundayBeforeChristmas && date < christmas) {
    return 'ADVENTO';
  }

  // Ordinary Time: everything else
  // We split into two but for basic we return first; could refine
  return 'TIEMPO_ORDINARIO_1';
}

/**
 * Determina el color litúrgico básico basado en temporada y algunas fiestas.
 */
export function getLiturgicalColor(date: Date): LiturgicalColor {
  const year = date.getFullYear();
  const easter = getEasterDate(year);
  const feasts = getMoveableFeasts(year);
  const season = getLiturgicalSeason(date);
  const rank = getLiturgicalRank(date);

  // Fixed dates with specific colors
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  const dateStr = toLocalDateStr(date);

  // Christmas Day, Epiphany (if not transferred), Baptism of Lord, etc.
  if ((month === 11 && day === 25) || // Christmas
      (month === 0 && day === 6)) {   // Epiphany (Jan 6)
    return 'WHITE';
  }

  // Solemnities override season color to WHITE
  // (except specific penitential/martyr days)
  if (rank === 'SOLEMNIDAD') {
    // Ash Wednesday: VIOLET (penitential)
    if (toLocalDateStr(feasts.ashWednesday) === dateStr) {
      return 'VIOLET';
    }
    // Palm Sunday: RED (Passion)
    if (toLocalDateStr(feasts.palmSunday) === dateStr) {
      return 'RED';
    }
    // Good Friday: RED regardless
    if (toLocalDateStr(feasts.goodFriday) === dateStr) {
      return 'RED';
    }
    return 'WHITE';
  }

  // Seasons
  switch (season) {
    case 'ADVENTO':
      return 'VIOLET';
    case 'NAVIDAD':
      return 'WHITE';
    case 'CUARESMA':
      return 'VIOLET';
    case 'TRIDUO_PASCUAL':
      // Holy Thursday (white), Good Friday (red/black), Holy Saturday (white/none)
      if (toLocalDateStr(feasts.holyThursday) === dateStr) {
        return 'WHITE';
      }
      if (toLocalDateStr(feasts.goodFriday) === dateStr) {
        return 'RED'; // sometimes black
      }
      return 'WHITE'; // Holy Saturday
    case 'PASCUA':
      return 'WHITE';
    case 'TIEMPO_ORDINARIO_1':
    case 'TIEMPO_ORDINARIO_2':
      return 'GREEN';
    default:
      return 'GREEN';
  }
}

/**
 * Determina el rango jerárquico (rank) básico de una fecha.
 * Esta implementación es muy aproximada y solo reconoce algunas solemnidades fijas.
 */
export function getLiturgicalRank(date: Date): LiturgicalRank {
  const year = date.getFullYear();
  const easter = getEasterDate(year);
  const feasts = getMoveableFeasts(year);

  // Fixed solemnities (simplified list)
  const fixedDates: [number, number, LiturgicalRank][] = [
    [0, 1, 'SOLEMNIDAD'],   // Jan 1: Mary, Mother of God
    [0, 6, 'SOLEMNIDAD'],   // Jan 6: Epiphany
    [2, 19, 'SOLEMNIDAD'],  // Mar 19: St. Joseph
    [2, 25, 'SOLEMNIDAD'],  // Mar 25: Annunciation
    [4, 31, 'SOLEMNIDAD'],  // May 31: Visitation (approx)
    [5, 24, 'SOLEMNIDAD'],  // Jun 24: St. John Baptist
    [5, 29, 'SOLEMNIDAD'],  // Jun 29: Sts. Peter & Paul
    [6, 25, 'SOLEMNIDAD'],  // Jul 25: St. James
    [7, 15, 'SOLEMNIDAD'],  // Aug 15: Assumption
    [10, 1, 'SOLEMNIDAD'],  // Nov 1: All Saints
    [11, 8, 'SOLEMNIDAD'],  // Dec 8: Immaculate Conception
    [11, 25, 'SOLEMNIDAD'], // Dec 25: Christmas
  ];

  for (const [m, d] of fixedDates) {
    if (date.getMonth() === m && date.getDate() === d) {
      return 'SOLEMNIDAD';
    }
  }

  // Moveable solemnities (based on Easter)
  const dateStr = toLocalDateStr(date);
  const moveableSolemnities: Date[] = [
    feasts.ashWednesday, // Actually not a solemnity, but penance day
    feasts.palmSunday,
    feasts.holyThursday,
    feasts.goodFriday,
    feasts.holySaturday,
    feasts.easterSunday,
    feasts.ascension,
    feasts.pentecost,
    feasts.trinitySunday,
    feasts.corpusChristi,
    feasts.sacredHeart,
    feasts.christTheKing,
  ];

  if (moveableSolemnities.some(d => toLocalDateStr(d) === dateStr)) {
    return 'SOLEMNIDAD';
  }

  // Some feasts (apostles, etc.) - simplified as fiesta
  // We'll just return FERIA for everything else
  return 'FERIA';
}

/**
 * Determina la semana del salterio de forma aproximada.
 * 
 * NOTE: This is a very rough approximation. The actual distribution of the
 * 4-week psalter in the Liturgy of the Hours is more complex and varies
 * by season, feast, etc. For Laudes, the psalter cycles continuously
 * through the weeks of the year, but is interrupted by certain seasons.
 * 
 * This function assumes:
 * - The psalter runs continuously through Ordinary Time
 * - Seasons like Advent, Christmas, Lent, Easter restart or have proper psalms
 * - We simply compute week number modulo 4, with adjustments for known seasons.
 */
export function getPsalterWeek(date: Date): PsalterWeek['week'] {
  const year = date.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const timeDiff = date.getTime() - jan1.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Simple approach: week of year (starting from Jan 1) modulo 4, plus 1
  // But we adjust so that certain seasons reset or have fixed weeks.
  const season = getLiturgicalSeason(date);
  
  // For simplicity, we'll just use dayDiff modulo 4 + 1
  // Marking this as approximate
  const weekNumber = ((dayDiff % 4) + 1) as PsalterWeek['week'];
  return weekNumber;
}

/**
 * Construye un objeto LiturgicalDay para una fecha dada.
 * 
 * NOTE: This function uses the basic approximations defined above.
 * For production use with official liturgical texts, the fields
 * (especially title, properType, hasProper, introduction) should be
 * sourced from official liturgical calendars and publications.
 */
export function getLiturgicalDay(date: Date): LiturgicalDay {
  const season = getLiturgicalSeason(date);
  const color = getLiturgicalColor(date);
  const rank = getLiturgicalRank(date);
  const psalterWeek = getPsalterWeek(date);
  
  // Title approximation: use rank and season or fixed names
  let title = '';
  const year = date.getFullYear();
  const feasts = getMoveableFeasts(year);
  const dateStr = toLocalDateStr(date);

  // Helper: check if date matches a feast Date (timezone-safe)
  function isSameDate(a: Date, b: Date): boolean {
    return toLocalDateStr(a) === toLocalDateStr(b);
  }

  // Check fixed dates for titles
  const month = date.getMonth();
  const day = date.getDate();
  const fixedTitles: Record<string, string> = {
    '0-1': 'Solemnidad de María, Madre de Dios',
    '0-6': 'Epifanía del Señor',
    '2-19': 'Solemnidad de San José',
    '2-25': 'Solemnidad de la Anunciación del Señor',
    '4-31': 'Visitación de la Bienaventurada Virgen María',
    '5-24': 'Solemnidad de la Natividad de San Juan Bautista',
    '5-29': 'Solemnidad de los Santos Pedro y Pablo, Apóstoles',
    '6-25': 'Santiago, Apóstol',
    '7-15': 'Solemnidad de la Asunción de la Bienaventurada Virgen María',
    '10-1': 'Solemnidad de Todos los Santos',
    '11-8': 'Solemnidad de la Inmaculada Concepción de la Bienaventurada Virgen María',
    '11-25': 'Solemnidad de la Navidad del Señor',
  };
  const key = `${month}-${day}`;
  if (fixedTitles[key]) {
    title = fixedTitles[key];
  } else {
    // Moveable feasts titles
    if (isSameDate(date, feasts.ashWednesday)) {
      title = 'Miércoles de Ceniza';
    } else if (isSameDate(date, feasts.palmSunday)) {
      title = 'Domingo de Ramos de la Pasión del Señor';
    } else if (isSameDate(date, feasts.holyThursday)) {
      title = 'Jueves Santo';
    } else if (isSameDate(date, feasts.goodFriday)) {
      title = 'Viernes Santo de la Pasión del Señor';
    } else if (isSameDate(date, feasts.holySaturday)) {
      title = 'Sábado Santo';
    } else if (isSameDate(date, feasts.easterSunday)) {
      title = 'Domingo de Pascua de la Resurrección del Señor';
    } else if (isSameDate(date, feasts.ascension)) {
      title = 'Ascensión del Señor';
    } else if (isSameDate(date, feasts.pentecost)) {
      title = 'Pentecostés';
    } else if (isSameDate(date, feasts.trinitySunday)) {
      title = 'Santísima Trinidad';
    } else if (isSameDate(date, feasts.corpusChristi)) {
      title = 'Santísimo Cuerpo y Sangre de Cristo';
    } else if (isSameDate(date, feasts.sacredHeart)) {
      title = 'Sagrado Corazón de Jesús';
    } else if (isSameDate(date, feasts.christTheKing)) {
      title = 'Nuestro Señor Jesucristo, Rey del Universo';
    } else {
      // Default title based on season
      const seasonTitles: Record<LiturgicalSeason, string> = {
        ADVENTO: 'Adviento',
        NAVIDAD: 'Tiempo de Navidad',
        TIEMPO_ORDINARIO_1: 'Tiempo Ordinario',
        CUARESMA: 'Cuaresma',
        TRIDUO_PASCUAL: 'Triduo Pascual',
        PASCUA: 'Tiempo de Pascua',
        TIEMPO_ORDINARIO_2: 'Tiempo Ordinario',
      };
      title = seasonTitles[season] || 'Tiempo Ordinario';
    }
  }

  // Proper flag approximation
  const hasProper = 
    rank === 'SOLEMNIDAD' || 
    rank === 'FIESTA' ||
    isSameDate(date, feasts.ashWednesday) ||
    isSameDate(date, feasts.palmSunday) ||
    isSameDate(date, feasts.holyThursday) ||
    isSameDate(date, feasts.goodFriday) ||
    isSameDate(date, feasts.holySaturday) ||
    isSameDate(date, feasts.easterSunday) ||
    isSameDate(date, feasts.ascension) ||
    isSameDate(date, feasts.pentecost) ||
    isSameDate(date, feasts.trinitySunday) ||
    isSameDate(date, feasts.corpusChristi) ||
    isSameDate(date, feasts.sacredHeart) ||
    isSameDate(date, feasts.christTheKing);

  // Proper type approximation
  let properType: LiturgicalDay['properType'] | undefined;
  if (hasProper) {
    // Simplified: if it's a moveable feast tied to Easter -> TEMPORAL
    const moveable = [
      feasts.ashWednesday,
      feasts.palmSunday,
      feasts.holyThursday,
      feasts.goodFriday,
      feasts.holySaturday,
      feasts.easterSunday,
      feasts.ascension,
      feasts.pentecost,
      feasts.trinitySunday,
      feasts.corpusChristi,
      feasts.sacredHeart,
      feasts.christTheKing,
    ];
    if (moveable.some(d => isSameDate(date, d))) {
      properType = 'TEMPORAL';
    } else {
      // Fixed dates could be SANCTORAL or COMMON
      // For simplicity, assign SANCTORAL to major fixed solemnities
      const solemnFixed = [
        [0,1], [0,6], [2,19], [2,25], [5,24], [5,29], [6,25], [7,15], [10,1], [11,8], [11,25]
      ];
      if (solemnFixed.some(([m,d]) => month === m && day === d)) {
        properType = 'SANCTORAL';
      } else {
        properType = 'COMMON';
      }
    }
  }

  return {
    date: toLocalDateStr(date),
    title,
    season,
    color,
    rank,
    psalterWeek,
    hasProper,
    properType,
    commemorated: properType === 'SANCTORAL' ? title : undefined,
    introduction: undefined, // Would come from Praenotanda in a full implementation
  };
}

/**
 * Genera un calendario mensual simplificado.
 * 
 * @param year - Año (ej: 2026)
 * @param month - Mes (0-11, donde 0 es enero)
 * @returns Array de objetos CalendarDay para cada día del mes
 */
export function getMonthCalendar(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const calendar: CalendarDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(year, month, day);
    const liturgicalDay = getLiturgicalDay(current);

    const calendarDay: CalendarDay = {
      date: toLocalDateStr(current),
      dayOfMonth: day,
      dayOfWeek: current.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      title: liturgicalDay.title.length > 15 
        ? liturgicalDay.title.substring(0, 12) + '...' 
        : liturgicalDay.title,
      color: liturgicalDay.color,
      rank: liturgicalDay.rank,
      isHighlighted: liturgicalDay.rank === 'SOLEMNIDAD' || 
                     liturgicalDay.rank === 'FIESTA',
      tooltip: liturgicalDay.title
    };

    calendar.push(calendarDay);
  }

  return calendar;
}

/**
 * Genera un rango de fechas desde un año de inicio hasta 2030 (inclusive).
 * 
 * @param startYear - Año de inicio (inclusive)
 * @returns Array de LiturgicalDay para cada día en el rango
 */
export function getDateRangeUntil2030(startYear: number): LiturgicalDay[] {
  const endYear = 2030;
  const days: LiturgicalDay[] = [];

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      const monthDays = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= monthDays; day++) {
        const date = new Date(year, month, day);
        days.push(getLiturgicalDay(date));
      }
    }
  }

  return days;
}

/**
 * Funciones de prueba simples (puras) para verificar cálculos conocidos.
 * Estas no requieren framework de testing y pueden llamarse directamente.
 */

/**
 * Prueba que el cálculo de Pascua para años conocidos sea correcto.
 * Valores tomados de tablas oficiales.
 * 
 * @returns true si todas las pruebas pasan
 */
export function testEasterCalculation(): boolean {
  const testCases: [number, number, number][] = [ // [year, expectedMonth, expectedDay]
    [2020, 4, 12], // April 12
    [2021, 4, 4],  // April 4
    [2022, 4, 17], // April 17
    [2023, 4, 9],  // April 9
    [2024, 3, 31], // March 31
    [2025, 4, 20], // April 20
    [2026, 4, 5],  // April 5
    [2027, 3, 28], // March 28
    [2028, 4, 16], // April 16
    [2029, 4, 1],  // April 1
    [2030, 4, 21], // April 21
  ];

  for (const [year, expectedMonth, expectedDay] of testCases) {
    const easter = getEasterDate(year);
    if (easter.getMonth() + 1 !== expectedMonth || easter.getDate() !== expectedDay) {
      console.error(`Easter test failed for ${year}: got ${easter.getMonth()+1}/${easter.getDate()}, expected ${expectedMonth}/${expectedDay}`);
      return false;
    }
  }
  return true;
}

/**
 * Prueba que los días de Semana Santa estén en secuencia correcta.
 * 
 * @returns true si la prueba pasa
 */
export function testHolyWeekSequence(): boolean {
  const year = 2026;
  const feasts = getMoveableFeasts(year);
  
  // Order should be: Ash Wednesday -> Palm Sunday -> Holy Thursday -> Good Friday -> Holy Saturday -> Easter
  const sequence = [
    feasts.ashWednesday,
    feasts.palmSunday,
    feasts.holyThursday,
    feasts.goodFriday,
    feasts.holySaturday,
    feasts.easterSunday
  ];

  for (let i = 0; i < sequence.length - 1; i++) {
    if (sequence[i].getTime() >= sequence[i + 1].getTime()) {
      console.error(`Holy week sequence failed at position ${i}`);
      return false;
    }
  }
  return true;
}

import {
  LaudsOffice,
  ValidationIssue,
  ValidationResult,
  PrayerBlock,
  PrayerSection,
} from '@/types/laudia';

const MIN_YEAR = 2026;
const MAX_YEAR = 2030;

type CheckFn = (office: LaudsOffice) => ValidationIssue[];

function getBlocks(office: LaudsOffice): PrayerBlock[] {
  return office.sections.flatMap((s: PrayerSection) => s.blocks);
}

function hasBlockType(office: LaudsOffice, type: PrayerBlock['type']): boolean {
  return getBlocks(office).some((b: PrayerBlock) => b.type === type);
}

function error(code: string, message: string, details?: string, blockId?: string, sectionId?: string): ValidationIssue {
  return { severity: 'error', code, message, details, blockId, sectionId };
}
function warning(code: string, message: string, details?: string, blockId?: string, sectionId?: string): ValidationIssue {
  return { severity: 'warning', code, message, details, blockId, sectionId };
}
function info(code: string, message: string, details?: string): ValidationIssue {
  return { severity: 'info', code, message, details };
}

const checks: CheckFn[] = [

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    if (!hasBlockType(office, 'HYMN')) {
      out.push(error('MISSING_HYMN', 'Falta el himno', 'Los Laudes deben iniciar con un himno propio del día o del tiempo litúrgico.'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const antiphons = getBlocks(office).filter((b: PrayerBlock) => b.type === 'ANTIPHON');
    if (antiphons.length === 0) {
      out.push(error('MISSING_ANTIPHONS', 'Faltan antífonas', 'Cada salmo y cántico debe llevar su antífona correspondiente.'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const psalms = getBlocks(office).filter((b: PrayerBlock) => b.type === 'PSALM');
    if (psalms.length === 0) {
      out.push(error('MISSING_PSALMS', 'Faltan salmos', 'La salmodia es parte esencial de Laudes.'));
    } else if (psalms.length < 2) {
      out.push(warning('FEW_PSALMS', 'Pocos salmos', `Se esperan al menos 2 salmos en Laudes, se encontraron ${psalms.length}.`));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    if (!hasBlockType(office, 'READING')) {
      out.push(error('MISSING_READING', 'Falta la lectura breve', 'Laudes incluye una lectura breve de la Escritura.'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    if (!hasBlockType(office, 'RESPONSORY')) {
      out.push(warning('MISSING_RESPONSORY', 'Falta el responsorio breve', 'Tras la lectura breve sigue el responsorio.'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    if (!hasBlockType(office, 'CANTICLE_GOSPEL')) {
      out.push(error('MISSING_BENEDICTUS', 'Falta el Benedictus', 'El cántico evangélico (Benedictus) es la cumbre de Laudes.'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    if (!hasBlockType(office, 'INTERCESSIONS')) {
      out.push(warning('MISSING_INTERCESSIONS', 'Faltan las preces', 'Las preces matutinas son parte habitual de Laudes.'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    if (!hasBlockType(office, 'CONCLUDING_PRAYER')) {
      out.push(warning('MISSING_CONCLUDING_PRAYER', 'Falta la oración conclusiva', 'Laudes concluye con una oración que recoge el sentido del día.'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const pending = getBlocks(office).filter((b: PrayerBlock) => b.verificationStatus === 'PENDING' || b.verificationStatus === 'PLACEHOLDER');
    if (pending.length > 0) {
      out.push(warning('PENDING_TEXTS', `${pending.length} texto(s) pendiente(s) de verificación`, 'Estos textos no han sido cotejados contra una fuente oficial.'));
      for (const b of pending) {
        out.push(info('PENDING_TEXT_DETAIL', `"${b.type}" — ${b.verificationStatus === 'PLACEHOLDER' ? 'placeholder' : 'pendiente'}`, `Bloque: ${b.id || b.type}`));
      }
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const day = office.day;
    const blocks = getBlocks(office);
    const ranksRequiringProper: PrayerBlock['type'][] = ['HYMN', 'READING', 'CONCLUDING_PRAYER'];
    const hasProperSources = blocks.filter((b: PrayerBlock) =>
      ranksRequiringProper.includes(b.type) &&
      (b.source === 'PROPIUM_DE_TIEMPO' || b.source === 'PROPIUM_DE_SANTOS')
    );
    if ((day.rank === 'SOLEMNIDAD' || day.rank === 'FIESTA') && hasProperSources.length < 2) {
      out.push(warning('MISSING_PROPER_SOURCES', `Día de rango "${day.rank}" con pocos textos de propio`, `${hasProperSources.length}/${ranksRequiringProper.length} bloques clave provienen de fuentes propias.`));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const day = office.day;
    if (day.rank === 'SOLEMNIDAD' && !day.hasProper) {
      out.push(warning('SOLEMNITY_WITHOUT_PROPER', 'Solemnidad sin propios cargados', 'Las solemnidades deberían tener textos propios (himno, antífonas, lecturas, oración).'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const day = office.day;
    if ((day.rank === 'MEMORIA_OBLIGATORIA' || day.rank === 'MEMORIA_OPcional') && !day.hasProper) {
      const hasCommonSources = getBlocks(office).some((b: PrayerBlock) => b.source === 'COMUN_DE_SANTOS');
      if (!hasCommonSources) {
        out.push(warning('MEMORIAL_WITHOUT_COMMON', `"${day.title}" es una memoria sin común de santos cargado`, 'Las memorias sin propio pueden usar textos del común correspondiente.'));
      }
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const dateStr = office.day.date;
    const year = parseInt(dateStr.split('-')[0], 10);
    if (year < MIN_YEAR || year > MAX_YEAR) {
      out.push(error('DATE_OUT_OF_RANGE', `Fecha fuera de rango (${dateStr})`, `El calendario litúrgico solo cubre ${MIN_YEAR}–${MAX_YEAR}.`));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const day = office.day;
    if ((day.season === 'CUARESMA' || day.season === 'TRIDUO_PASCUAL') && hasBlockType(office, 'GLORIA')) {
      out.push(info('GLORIA_DURING_LENT', 'Gloria en tiempo penitencial', 'En Cuaresma y Triduo Pascual el Gloria se omite, salvo solemnidades.'));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const psalmBlocks = getBlocks(office).filter((b: PrayerBlock) => b.type === 'PSALM');
    const mismatched = psalmBlocks.filter((b: PrayerBlock) =>
      b.psalmInfo?.number && (b.psalmInfo.number < 1 || b.psalmInfo.number > 150)
    );
    for (const b of mismatched) {
      out.push(warning('PSALM_NUMBER_OUT_OF_RANGE', `Salmo ${b.psalmInfo?.number} fuera del Salterio (1–150)`, `Bloque: ${b.id || b.type}`));
    }
    return out;
  },

  (office): ValidationIssue[] => {
    const out: ValidationIssue[] = [];
    const blocks = getBlocks(office);
    const empty = blocks.filter((b: PrayerBlock) => !b.officialText || b.officialText.trim() === '');
    for (const b of empty) {
      out.push(error('EMPTY_BLOCK', `Bloque "${b.type}" sin texto`, `El bloque ${b.id || b.type} está vacío.`));
    }
    return out;
  },
];

export function validateOffice(office: LaudsOffice): ValidationResult {
  const all: ValidationIssue[] = [];
  for (const check of checks) {
    all.push(...check(office));
  }

  const errors = all.filter((i: ValidationIssue) => i.severity === 'error');
  const warnings = all.filter((i: ValidationIssue) => i.severity === 'warning');
  const infos = all.filter((i: ValidationIssue) => i.severity === 'info');

  return {
    date: office.day.date,
    celebrationName: office.day.title,
    errors,
    warnings,
    infos,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    isClean: errors.length === 0 && warnings.length === 0,
  };
}

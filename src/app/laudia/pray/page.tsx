import { LaudsOffice, PrayerBlock } from '@/types/laudia';
import { buildLaudsOfficeFromOfficialSource } from '@/lib/laudia/official-source';
import { explainPrayerBlock, generateMorningReflection, generatePurposeForToday } from '@/lib/laudia/ai';
import type { AiResponse } from '@/lib/laudia/ai';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

interface PrayStep {
  id: string;
  title: string;
  blocks: PrayerBlock[];
  rubric?: string;
  estimatedSeconds: number;
}

interface SavedProgress {
  date: string;
  stepIndex: number;
  completedIds: string[];
  mode: 'guided' | 'expert';
}

const STORAGE_KEY_PREFIX = 'laudia-pray-progress-';
const ESTIMATED_SECONDS_PER_STEP = 30;

// ── Block type labels ──────────────────────────────────────────────────────

const blockLabels: Record<string, string> = {
  ANTIPHON: 'Antífona',
  PSALM: 'Salmo',
  CANTICLE_OT: 'Cántico del Antiguo Testamento',
  CANTICLE_GOSPEL: 'Cántico evangélico',
  GLORIA: 'Gloria al Padre',
  INVITATORY: 'Invitatorio',
  HYMN: 'Himno',
  READING: 'Lectura breve',
  RESPONSORY: 'Responsorio breve',
  INTERCESSIONS: 'Preces',
  OUR_FATHER: 'Oración del Señor',
  CONCLUDING_PRAYER: 'Oración final',
  CONCLUSION: 'Conclusión',
};

// ── Helper: extract steps from LaudsOffice ─────────────────────────────────

function extractSteps(office: LaudsOffice): PrayStep[] {
  const s = office.sections;
  const steps: PrayStep[] = [];

  // 1. Inicio
  const openingSection = s.find(ss => ss.id === 'opening');
  if (openingSection && openingSection.blocks.length > 0) {
    steps.push({
      id: 'opening', title: 'Inicio',
      blocks: [openingSection.blocks[0]],
      rubric: openingSection.blocks[0].rubrics,
      estimatedSeconds: 15,
    });
  }

  // 2. Himno
  const hymnSection = s.find(ss => ss.id === 'hymn');
  if (hymnSection && hymnSection.blocks.length > 0) {
    steps.push({
      id: 'hymn', title: 'Himno',
      blocks: [hymnSection.blocks[0]],
      rubric: hymnSection.blocks[0].rubrics,
      estimatedSeconds: 40,
    });
  }

  // 3-5: Salmodia
  const psalmodySection = s.find(ss => ss.id === 'psalmody');
  if (psalmodySection) {
    const blocks = psalmodySection.blocks;

    const psalm1Idx = blocks.findIndex(b => b.type === 'PSALM');
    if (psalm1Idx !== -1) {
      const beforePs1 = blocks.slice(0, psalm1Idx);
      const antiphon1 = beforePs1.reverse().find(b => b.type === 'ANTIPHON');
      const gloria1 = blocks.slice(psalm1Idx + 1).find(b => b.type === 'GLORIA');
      const repeatAnt1 = blocks.slice(psalm1Idx + 1).find(b => b.id?.includes('repeat'));

      const stepBlocks: PrayerBlock[] = [];
      if (antiphon1) stepBlocks.push(antiphon1);
      stepBlocks.push(blocks[psalm1Idx]);
      if (gloria1) stepBlocks.push(gloria1);
      if (repeatAnt1) stepBlocks.push(repeatAnt1);

      steps.push({
        id: 'psalm-1', title: 'Salmo 1', blocks: stepBlocks,
        rubric: blocks[psalm1Idx].rubrics,
        estimatedSeconds: 50,
      });
    }

    const canticleIdx = blocks.findIndex(b => b.type === 'CANTICLE_OT');
    if (canticleIdx !== -1) {
      const antiphon2 = blocks.slice(0, canticleIdx).reverse().find(b => b.type === 'ANTIPHON' && !b.id?.includes('repeat'));
      const gloria2 = blocks.slice(canticleIdx + 1).find(b => b.type === 'GLORIA');
      const repeatAnt2 = blocks.slice(canticleIdx + 1).find(b => b.type === 'ANTIPHON' && b.id?.includes('repeat'));

      const stepBlocks: PrayerBlock[] = [];
      if (antiphon2) stepBlocks.push(antiphon2);
      stepBlocks.push(blocks[canticleIdx]);
      if (gloria2) stepBlocks.push(gloria2);
      if (repeatAnt2) stepBlocks.push(repeatAnt2);

      steps.push({
        id: 'canticle-ot', title: 'Cántico', blocks: stepBlocks,
        rubric: blocks[canticleIdx].rubrics,
        estimatedSeconds: 45,
      });
    }

    const psalm2Idx = blocks.slice(psalm1Idx + 1).findIndex(b => b.type === 'PSALM' || b.type === 'CANTICLE_GOSPEL');
    if (psalm2Idx !== -1) {
      const actualIdx = psalm1Idx + 1 + psalm2Idx;
      const antiphon3 = blocks.slice(0, actualIdx).reverse().find(b => b.type === 'ANTIPHON' && !b.id?.includes('repeat'));
      const gloria3 = blocks.slice(actualIdx + 1).find(b => b.type === 'GLORIA');
      const repeatAnt3 = blocks.slice(actualIdx + 1).find(b => b.type === 'ANTIPHON' && b.id?.includes('repeat'));

      const stepBlocks: PrayerBlock[] = [];
      if (antiphon3) stepBlocks.push(antiphon3);
      stepBlocks.push(blocks[actualIdx]);
      if (gloria3) stepBlocks.push(gloria3);
      if (repeatAnt3) stepBlocks.push(repeatAnt3);

      steps.push({
        id: 'psalm-2', title: 'Salmo 2', blocks: stepBlocks,
        rubric: blocks[actualIdx].rubrics,
        estimatedSeconds: 40,
      });
    } else {
      const lastPsalm = [...blocks].reverse().find(b => b.type === 'PSALM');
      if (lastPsalm) {
        steps.push({
          id: 'psalm-2', title: 'Salmo 2', blocks: [lastPsalm],
          rubric: lastPsalm.rubrics,
          estimatedSeconds: 40,
        });
      }
    }
  }

  // 6. Lectura breve
  const readingSection = s.find(ss => ss.id === 'reading');
  if (readingSection && readingSection.blocks.length > 0) {
    steps.push({
      id: 'reading', title: 'Lectura breve',
      blocks: [readingSection.blocks[0]],
      rubric: readingSection.blocks[0].rubrics,
      estimatedSeconds: 20,
    });
  }

  // 7. Responsorio
  const responsorySection = s.find(ss => ss.id === 'responsory');
  if (responsorySection && responsorySection.blocks.length > 0) {
    steps.push({
      id: 'responsory', title: 'Responsorio',
      blocks: [responsorySection.blocks[0]],
      rubric: responsorySection.blocks[0].rubrics,
      estimatedSeconds: 20,
    });
  }

  // 8. Benedictus
  const benedictusSection = s.find(ss => ss.id === 'benedictus');
  if (benedictusSection) {
    const blocks = benedictusSection.blocks;
    const antiphon = blocks.find(b => b.type === 'ANTIPHON');
    const canticle = blocks.find(b => b.type === 'CANTICLE_GOSPEL');
    const gloria = blocks.find(b => b.type === 'GLORIA');
    const repeatAnt = blocks.filter(b => b.type === 'ANTIPHON').slice(1)[0];

    const stepBlocks: PrayerBlock[] = [];
    if (antiphon) stepBlocks.push(antiphon);
    if (canticle) stepBlocks.push(canticle);
    if (gloria) stepBlocks.push(gloria);
    if (repeatAnt) stepBlocks.push(repeatAnt);

    steps.push({
      id: 'benedictus', title: 'Benedictus', blocks: stepBlocks,
      rubric: canticle?.rubrics ?? stepBlocks[0]?.rubrics,
      estimatedSeconds: 50,
    });
  }

  // 9. Preces
  const intercessionsSection = s.find(ss => ss.id === 'intercessions');
  if (intercessionsSection && intercessionsSection.blocks.length > 0) {
    steps.push({
      id: 'intercessions', title: 'Preces',
      blocks: [intercessionsSection.blocks[0]],
      rubric: intercessionsSection.blocks[0].rubrics,
      estimatedSeconds: 40,
    });
  }

  // 10. Padre Nuestro
  const ourFatherSection = s.find(ss => ss.id === 'our-father');
  if (ourFatherSection && ourFatherSection.blocks.length > 0) {
    steps.push({
      id: 'our-father', title: 'Padre Nuestro',
      blocks: [ourFatherSection.blocks[0]],
      rubric: ourFatherSection.blocks[0].rubrics,
      estimatedSeconds: 30,
    });
  }

  // 11. Oración final
  const prayerSection = s.find(ss => ss.id === 'concluding-prayer');
  if (prayerSection && prayerSection.blocks.length > 0) {
    steps.push({
      id: 'concluding-prayer', title: 'Oración final',
      blocks: [prayerSection.blocks[0]],
      rubric: prayerSection.blocks[0].rubrics,
      estimatedSeconds: 20,
    });
  }

  // 12. Conclusión
  const conclusionSection = s.find(ss => ss.id === 'conclusion');
  if (conclusionSection && conclusionSection.blocks.length > 0) {
    steps.push({
      id: 'conclusion', title: 'Conclusión',
      blocks: [conclusionSection.blocks[0]],
      rubric: conclusionSection.blocks[0].rubrics,
      estimatedSeconds: 15,
    });
  }

  return steps;
}

// ── Helpers: localStorage ──────────────────────────────────────────────────

function getStorageKey(date: Date): string {
  return STORAGE_KEY_PREFIX + date.toISOString().split('T')[0];
}

function loadProgress(date: Date): SavedProgress | null {
  try {
    const raw = localStorage.getItem(getStorageKey(date));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedProgress;
    if (parsed.date !== date.toISOString().split('T')[0]) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveProgress(date: Date, progress: Omit<SavedProgress, 'date'>): void {
  try {
    localStorage.setItem(getStorageKey(date), JSON.stringify({
      date: date.toISOString().split('T')[0],
      ...progress,
    }));
  } catch {
    // silently ignore
  }
}

function clearProgress(date: Date): void {
  try { localStorage.removeItem(getStorageKey(date)); } catch { /* ignore */ }
}

// ── Helpers: time formatting ───────────────────────────────────────────────

function formatTimeRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 min';
  const minutes = Math.ceil(totalSeconds / 60);
  if (minutes < 1) return '<1 min';
  return `${minutes} min`;
}

function buildNarrationText(steps: PrayStep[]): string {
  return steps
    .map((step) => {
      const content = step.blocks.map((block) => block.officialText.trim()).filter(Boolean).join('\n\n');
      return `${step.title}.\n${content}`;
    })
    .join('\n\n');
}

function splitForSpeech(text: string, maxChunk = 1_800): string[] {
  const normalized = text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (normalized.length <= maxChunk) return [normalized];

  const chunks: string[] = [];
  let pending = normalized;
  while (pending.length > maxChunk) {
    let cut = pending.lastIndexOf('\n\n', maxChunk);
    if (cut < 250) cut = pending.lastIndexOf('. ', maxChunk);
    if (cut < 250) cut = maxChunk;
    chunks.push(pending.slice(0, cut).trim());
    pending = pending.slice(cut).trim();
  }
  if (pending) chunks.push(pending);
  return chunks;
}

// ── Page Component ─────────────────────────────────────────────────────────

export default function PrayPage() {
  const [searchParams] = useSearchParams();
  const prayerDate = useMemo(() => {
    const raw = searchParams.get('date');
    if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const parsed = new Date(`${raw}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        parsed.setHours(0, 0, 0, 0);
        return parsed;
      }
    }

    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, [searchParams]);

  const [office, setOffice] = useState<LaudsOffice | null>(null);
  const [steps, setSteps] = useState<PrayStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<'guided' | 'expert'>('guided');
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [explainingBlockId, setExplainingBlockId] = useState<string | null>(null);
  const [blockExplanation, setBlockExplanation] = useState<AiResponse | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [morningReflection, setMorningReflection] = useState<AiResponse | null>(null);
  const [dailyPurpose, setDailyPurpose] = useState<AiResponse | null>(null);
  const [showAIPanel, setShowAIPanel] = useState<'none' | 'reflection' | 'purpose'>('none');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechCancelled = useRef(false);
  const narrationAbort = useRef<AbortController | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isNarrationPaused, setIsNarrationPaused] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const selectedDateLabel = useMemo(() => {
    return prayerDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [prayerDate]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const built = await buildLaudsOfficeFromOfficialSource(prayerDate);
      if (cancelled) return;

      setOffice(built);
      const extracted = extractSteps(built);
      setSteps(extracted);

      const saved = loadProgress(prayerDate);
      if (saved && saved.mode === 'guided') {
        setCurrentStep(Math.min(saved.stepIndex, extracted.length - 1));
        setCompletedIds(new Set(saved.completedIds));
        if (saved.stepIndex >= extracted.length - 1) {
          setIsFinished(true);
        }
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [prayerDate]);

  useEffect(() => {
    if (loading || office === null) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProgress(prayerDate, {
        stepIndex: currentStep,
        completedIds: Array.from(completedIds),
        mode,
      });
    }, 200);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [currentStep, completedIds, mode, loading, prayerDate, office]);

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= totalSteps) return;
    setCurrentStep(index);
    if (index > currentStep) {
      setCompletedIds(prev => {
        const next = new Set(prev);
        next.add(steps[currentStep].id);
        return next;
      });
    }
    setIsFinished(false);
  }, [currentStep, totalSteps, steps]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      goTo(currentStep + 1);
    } else {
      const allIds = new Set(steps.map(s => s.id));
      setCompletedIds(allIds);
      setIsFinished(true);
      clearProgress(prayerDate);
    }
  }, [currentStep, totalSteps, steps, goTo, prayerDate]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const completedCount = completedIds.size;
  const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const remainingSteps = totalSteps - currentStep - 1;
  const remainingSeconds = remainingSteps * ESTIMATED_SECONDS_PER_STEP;

  const currentStepTime = step?.blocks.reduce((acc, b) => {
    const wordCount = (b.officialText || '').split(/\s+/).length;
    return acc + Math.max(10, Math.round(wordCount / 4));
  }, 0) ?? ESTIMATED_SECONDS_PER_STEP;

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'guided' ? 'expert' : 'guided');
    setCurrentStep(0);
    setCompletedIds(new Set());
    setIsFinished(false);
    clearProgress(prayerDate);
  }, [prayerDate]);

  const resetPrayer = useCallback(() => {
    setCurrentStep(0);
    setCompletedIds(new Set());
    setIsFinished(false);
    clearProgress(prayerDate);
  }, [prayerDate]);

  // ── AI handlers ──────────────────────────────────────────────────────────

  const handleExplainBlock = useCallback(async (block: PrayerBlock) => {
    if (aiBusy) return;
    setAiBusy(true);
    setExplainingBlockId(block.id);
    setBlockExplanation(null);
    try {
      const response = await explainPrayerBlock(block);
      setBlockExplanation(response);
    } catch { /* keep previous */ }
    finally { setAiBusy(false); }
  }, [aiBusy]);

  const handleMorningReflection = useCallback(async () => {
    if (aiBusy || !office) return;
    setAiBusy(true);
    setShowAIPanel('reflection');
    setMorningReflection(null);
    try {
      const response = await generateMorningReflection(office);
      setMorningReflection(response);
    } catch { /* keep previous */ }
    finally { setAiBusy(false); }
  }, [aiBusy, office]);

  const handleDailyPurpose = useCallback(async () => {
    if (aiBusy || !office) return;
    setAiBusy(true);
    setShowAIPanel('purpose');
    setDailyPurpose(null);
    try {
      const response = await generatePurposeForToday(office);
      setDailyPurpose(response);
    } catch { /* keep previous */ }
    finally { setAiBusy(false); }
  }, [aiBusy, office]);

  const stopNarration = useCallback(() => {
    speechCancelled.current = true;
    narrationAbort.current?.abort();
    narrationAbort.current = null;
    try {
      audioSource.current?.stop();
    } catch {
      // La fuente puede haber terminado antes de pulsar detener.
    }
    audioSource.current = null;
    if (audioContext.current) {
      void audioContext.current.close();
      audioContext.current = null;
    }
    setIsNarrating(false);
    setIsNarrationPaused(false);
    setIsVoiceLoading(false);
  }, []);

  const pauseNarration = useCallback(() => {
    if (!audioContext.current) return;
    void audioContext.current.suspend().then(() => setIsNarrationPaused(true));
  }, []);

  const resumeNarration = useCallback(() => {
    if (!audioContext.current) return;
    void audioContext.current.resume().then(() => setIsNarrationPaused(false)).catch(() => {
      setVoiceError('Toca de nuevo para reanudar el audio.');
    });
  }, []);

  const startNarration = useCallback(async () => {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) {
      setVoiceError('Tu navegador no soporta la reproducción de audio.');
      return;
    }

    const fullText = buildNarrationText(steps);
    if (!fullText) return;

    setVoiceError(null);
    speechCancelled.current = false;
    setIsNarrationPaused(false);

    const chunks = splitForSpeech(fullText);
    if (chunks.length === 0) return;

    const context = new AudioContextClass();
    audioContext.current = context;
    await context.resume();
    setIsNarrating(true);

    try {
      for (const chunk of chunks) {
        if (speechCancelled.current) break;
        setIsVoiceLoading(true);
        const controller = new AbortController();
        narrationAbort.current = controller;
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: chunk }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null) as { error?: string } | null;
          throw new Error(payload?.error ?? 'No se pudo generar la voz.');
        }

        const buffer = await response.arrayBuffer();
        const decoded = await context.decodeAudioData(buffer);
        if (speechCancelled.current) break;

        setIsVoiceLoading(false);
        const source = context.createBufferSource();
        audioSource.current = source;
        source.buffer = decoded;
        source.connect(context.destination);

        await new Promise<void>((resolve, reject) => {
          source.onended = () => resolve();
          try {
            source.start();
          } catch (error) {
            reject(error);
          }
        });
      }
    } catch (error) {
      if (!speechCancelled.current) {
        setVoiceError(error instanceof Error ? error.message : 'No se pudo completar la locución.');
      }
    } finally {
      narrationAbort.current = null;
      audioSource.current = null;
      setIsVoiceLoading(false);
      setIsNarrating(false);
      setIsNarrationPaused(false);
      if (audioContext.current === context) {
        void context.close();
        audioContext.current = null;
      }
    }
  }, [steps]);

  useEffect(() => stopNarration, [stopNarration]);

  // ═══════════════════════════════════════════════════════════════════════
  // EXPERT MODE
  // ═══════════════════════════════════════════════════════════════════════

  if (mode === 'expert' && office) {
    return (
      <div className="min-h-screen laudia-gradient p-4">
        <div className="max-w-3xl mx-auto py-6">
          <div className="text-center mb-6 space-y-1">
            <p className="text-xs text-stone-500 uppercase tracking-wider">Rezar • {selectedDateLabel}</p>
            <h1 className="laudia-h1">Laudes</h1>
            <p className="text-sm text-stone-600">{office.day.title}</p>
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-stone-200/70 text-stone-600">
              Modo experto
            </span>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={
                  !isNarrating
                    ? startNarration
                    : isNarrationPaused
                      ? resumeNarration
                      : pauseNarration
                }
                disabled={isVoiceLoading}
                className="laudia-btn-secondary text-xs disabled:cursor-wait disabled:opacity-70"
              >
                {!isNarrating
                  ? 'Escuchar Laudes · voz española'
                  : isVoiceLoading
                    ? 'Preparando voz…'
                    : isNarrationPaused
                      ? 'Reanudar voz'
                      : 'Pausar voz'}
              </button>
              {isNarrating && (
                <button onClick={stopNarration} className="laudia-btn-ghost text-xs">
                  Detener y reiniciar
                </button>
              )}
              <button onClick={toggleMode} className="laudia-btn-ghost">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
                Volver a modo guía
              </button>
            </div>
            <p className="mt-2 text-[11px] text-stone-400">Deepgram · Néstor · español de España</p>
            {voiceError && <p className="mt-2 text-xs text-amber-700">{voiceError}</p>}
          </div>

          <div className="space-y-6">
            {steps.map((st, i) => (
              <div key={st.id} className="laudia-card p-5 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-stone-400 tabular-nums">{(i + 1).toString().padStart(2, '0')}</span>
                  <h2 className="laudia-h2">{st.title}</h2>
                </div>
                {st.blocks.map(block => (
                  <div key={block.id} className="mb-3 last:mb-0">
                    {block.rubrics && (
                      <p className="rubric mb-1">{block.rubrics}</p>
                    )}
                    {block.type !== 'PSALM' && (
                      <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">
                        {blockLabels[block.type] || block.type}
                      </p>
                    )}
                    <p className="laudia-prayer whitespace-pre-line text-stone-700">{block.officialText}</p>
                    {block.aiReflection && (
                      <div className="mt-3 p-3 bg-blue-50/60 border-l-2 border-blue-300 rounded-r-lg text-sm text-blue-700 space-y-1">
                        <p className="font-medium text-xs text-blue-500">Reflexión</p>
                        <p>{block.aiReflection.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LOADING
  // ═══════════════════════════════════════════════════════════════════════

  if (loading || !step) {
    return (
      <div className="min-h-screen flex items-center justify-center laudia-gradient">
        <div className="text-center animate-pulse-soft">
          <div className="inline-block h-10 w-10 rounded-full border-2 border-stone-300 border-t-stone-600 animate-spin mb-4" />
          <p className="text-sm text-stone-500">Cargando Laudes…</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // FINISHED
  // ═══════════════════════════════════════════════════════════════════════

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center laudia-gradient p-4">
        <div className="max-w-lg w-full text-center space-y-8 animate-fade-in-up">
          {/* Sun icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
            <svg className="h-8 w-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="laudia-h1 text-2xl">Laudes completadas</h1>
            <p className="text-stone-500 text-sm">
              Has rezado las Laudes de <span className="text-stone-700 font-medium">{office?.day.title ?? 'hoy'}</span>.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button onClick={resetPrayer} className="laudia-btn-secondary text-sm">
              Rezar de nuevo
            </button>
            <button onClick={toggleMode} className="laudia-btn-primary text-sm">
              Modo experto
            </button>
          </div>

          {/* AI suggestions */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleMorningReflection}
              disabled={aiBusy}
              className="laudia-btn-ghost disabled:opacity-40"
            >
              {aiBusy && showAIPanel === 'reflection' ? '…' : 'Meditación breve'}
            </button>
            <button
              onClick={handleDailyPurpose}
              disabled={aiBusy}
              className="laudia-btn-ghost disabled:opacity-40"
            >
              {aiBusy && showAIPanel === 'purpose' ? '…' : 'Propósito para hoy'}
            </button>
          </div>

          {showAIPanel === 'reflection' && morningReflection && (
            <div className="laudia-card p-5 text-left space-y-2 animate-fade-in">
              <p className="whitespace-pre-line text-sm text-stone-700 leading-relaxed">{morningReflection.content}</p>
              <p className="text-xs text-stone-400 italic">{morningReflection.disclaimer}</p>
            </div>
          )}
          {showAIPanel === 'purpose' && dailyPurpose && (
            <div className="laudia-card p-5 text-left space-y-2 animate-fade-in">
              <p className="whitespace-pre-line text-sm text-stone-700 leading-relaxed">{dailyPurpose.content}</p>
              <p className="text-xs text-stone-400 italic">{dailyPurpose.disclaimer}</p>
            </div>
          )}

          <p className="text-sm text-stone-400 italic">Que el Señor te bendiga y te guarde.</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // GUIDED MODE
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen laudia-gradient flex flex-col">
      {/* Thin progress bar at very top */}
      <div className="h-1 bg-stone-200/80 w-full fixed top-0 left-0 z-20">
        <div
          className="h-full bg-stone-700 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pb-8 pt-6">
        {/* Header */}
        <div className="text-center mb-5 space-y-1">
          {office && (
            <p className="text-xs text-stone-500 uppercase tracking-wider">Rezar • {selectedDateLabel}</p>
          )}
          <h1 className="laudia-h1">Laudes</h1>
          {office && <p className="text-sm text-stone-600">{office.day.title}</p>}
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-stone-200/70 text-stone-600">
            Modo guía
          </span>
        </div>

        {/* Progress info */}
        <div className="flex justify-between text-xs text-stone-400 mb-2 px-1">
          <span>{completedCount}/{totalSteps} completado</span>
          <span>~{formatTimeRemaining(remainingSeconds)} restantes</span>
        </div>
        <div className="h-1.5 bg-stone-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-stone-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step title */}
        <div className="text-center mb-6">
          <span className="text-xs font-medium text-stone-400 tabular-nums">
            {(currentStep + 1).toString().padStart(2, '0')}/{totalSteps.toString().padStart(2, '0')}
          </span>
          <h2 className="laudia-h1 mt-0.5">{step.title}</h2>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          <div className="laudia-card p-5 md:p-6 animate-fade-in">
            {step.blocks.map((block, bi) => (
              <div key={block.id} className={bi > 0 ? 'pt-5 mt-5 border-t border-stone-100' : ''}>
                {/* Block type label */}
                <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1.5">
                  {block.type === 'PSALM' && block.psalmInfo
                    ? `Salmo ${block.psalmInfo.number}${block.psalmInfo.verses ? ` (${block.psalmInfo.verses})` : ''}`
                    : block.type === 'CANTICLE_GOSPEL' && block.canticleInfo
                    ? block.canticleInfo.name
                    : blockLabels[block.type] || block.type}
                </p>

                {/* Rubric */}
                {block.rubrics && bi === 0 && (
                  <p className="rubric mb-2">{block.rubrics}</p>
                )}

                {/* Block text */}
                <p className="laudia-prayer whitespace-pre-line">
                  {block.officialText}
                </p>

                {/* AI reflection */}
                {mode === 'guided' && block.aiReflection && (
                  <div className="mt-3 p-3 bg-blue-50/60 border-l-2 border-blue-300 rounded-r-lg text-sm text-blue-700 space-y-1">
                    <p className="font-medium text-xs text-blue-500">Reflexión</p>
                    <p>{block.aiReflection.content}</p>
                  </div>
                )}

                {/* AI explain button */}
                {mode === 'guided' && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleExplainBlock(block)}
                      disabled={aiBusy}
                      className="laudia-btn-ghost disabled:opacity-40"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 3a2.5 2.5 0 015 0M12 10v4m-4 4h8" />
                      </svg>
                      {aiBusy && explainingBlockId === block.id ? 'Cargando…' : 'Explicar este fragmento'}
                    </button>

                    {explainingBlockId === block.id && blockExplanation && (
                      <div className="mt-2 p-3 bg-blue-50/60 border-l-2 border-blue-300 rounded-r-lg text-sm text-blue-700 space-y-1 animate-fade-in">
                        <p className="whitespace-pre-line leading-relaxed">{blockExplanation.content}</p>
                        <p className="text-xs text-blue-400 italic">{blockExplanation.disclaimer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 space-y-3">
          <div className="text-center">
            <button
              onClick={
                !isNarrating
                  ? startNarration
                  : isNarrationPaused
                    ? resumeNarration
                    : pauseNarration
              }
              disabled={isVoiceLoading}
              className="laudia-btn-secondary text-sm disabled:cursor-wait disabled:opacity-70"
            >
              {!isNarrating
                ? 'Escuchar todo · voz española'
                : isVoiceLoading
                  ? 'Preparando voz…'
                  : isNarrationPaused
                    ? 'Reanudar voz'
                    : 'Pausar voz'}
            </button>
            {isNarrating && (
              <button onClick={stopNarration} className="laudia-btn-ghost text-xs ml-2">
                Detener y reiniciar
              </button>
            )}
            <p className="mt-2 text-[11px] text-stone-400">Deepgram · Néstor · español de España</p>
            {voiceError && <p className="mt-2 text-xs text-amber-700">{voiceError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={goPrev}
              disabled={currentStep === 0}
              className="laudia-btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <button onClick={goNext} className="laudia-btn-primary">
              {currentStep < totalSteps - 1 ? (
                <>
                  Siguiente
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : 'Finalizar'}
            </button>
          </div>

          <p className="text-center text-xs text-stone-400">
            Tiempo estimado: ~{currentStepTime}s
          </p>
        </div>

        {/* Bottom: mode toggle */}
        <div className="mt-5 text-center">
          <button onClick={toggleMode} className="laudia-btn-ghost">
            Cambiar a modo experto
          </button>
        </div>
      </div>
    </div>
  );
}

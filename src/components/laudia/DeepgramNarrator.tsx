import { useCallback, useEffect, useRef, useState } from 'react';

type NarrationText = string | (() => string);

interface DeepgramNarratorProps {
  text: NarrationText;
  label?: string;
  className?: string;
  compact?: boolean;
}

function splitForSpeech(text: string, maxChunk = 600): string[] {
  const normalized = text
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!normalized) return [];
  if (normalized.length <= maxChunk) return [normalized];

  const chunks: string[] = [];
  let pending = normalized;

  while (pending.length > maxChunk) {
    let cut = pending.lastIndexOf('\n\n', maxChunk);
    if (cut < 250) cut = pending.lastIndexOf('. ', maxChunk);
    if (cut < 250) cut = pending.lastIndexOf(', ', maxChunk);
    if (cut < 250) cut = maxChunk;
    chunks.push(pending.slice(0, cut).trim());
    pending = pending.slice(cut).trim();
  }

  if (pending) chunks.push(pending);
  return chunks;
}

export function DeepgramNarrator({
  text,
  label = 'Escuchar contenido',
  className = '',
  compact = false,
}: DeepgramNarratorProps) {
  const cancelled = useRef(false);
  const request = useRef<AbortController | null>(null);
  const context = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(async () => {
    cancelled.current = true;
    request.current?.abort();
    request.current = null;
    try {
      source.current?.stop();
    } catch {
      // The source may already have finished naturally.
    }
    source.current = null;
    const activeContext = context.current;
    context.current = null;
    if (activeContext && activeContext.state !== 'closed') {
      await activeContext.close().catch(() => undefined);
    }
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      cancelled.current = true;
      request.current?.abort();
      try {
        source.current?.stop();
      } catch {
        // Cleanup only.
      }
      void context.current?.close();
    };
  }, []);

  const playBuffer = useCallback((audioContext: AudioContext, buffer: AudioBuffer) => {
    return new Promise<void>((resolve, reject) => {
      if (cancelled.current) {
        resolve();
        return;
      }
      const nextSource = audioContext.createBufferSource();
      nextSource.buffer = buffer;
      nextSource.connect(audioContext.destination);
      nextSource.onended = () => {
        if (source.current === nextSource) source.current = null;
        resolve();
      };
      try {
        source.current = nextSource;
        nextSource.start();
      } catch (playError) {
        reject(playError);
      }
    });
  }, []);

  const start = useCallback(async () => {
    const resolvedText = typeof text === 'function' ? text() : text;
    const chunks = splitForSpeech(resolvedText);
    if (!chunks.length) {
      setError('No hay texto disponible para escuchar.');
      return;
    }

    await stop();
    cancelled.current = false;
    setError(null);
    setIsPlaying(true);
    setIsLoading(true);

    const AudioContextClass = window.AudioContext;
    const audioContext = new AudioContextClass();
    context.current = audioContext;
    const resumeRequest = audioContext.resume();

    try {
      for (let index = 0; index < chunks.length; index += 1) {
        if (cancelled.current) break;
        const controller = new AbortController();
        request.current = controller;
        setIsLoading(true);

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: chunks[index] }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('No se pudo generar la narración.');
        const audioData = await response.arrayBuffer();
        const decoded = await audioContext.decodeAudioData(audioData);
        await resumeRequest;
        if (audioContext.state === 'suspended') await audioContext.resume();
        setIsLoading(false);
        await playBuffer(audioContext, decoded);
      }

      if (!cancelled.current) await stop();
    } catch (narrationError) {
      if (!cancelled.current) {
        setError(narrationError instanceof Error ? narrationError.message : 'La voz no está disponible ahora.');
        await stop();
      }
    }
  }, [playBuffer, stop, text]);

  const togglePause = useCallback(async () => {
    const audioContext = context.current;
    if (!audioContext) return;
    if (audioContext.state === 'running') {
      await audioContext.suspend();
      setIsPaused(true);
    } else {
      await audioContext.resume();
      setIsPaused(false);
    }
  }, []);

  return (
    <div
      className={`rounded-2xl border border-emerald-900/10 bg-emerald-50/55 ${compact ? 'p-3' : 'p-4'} ${className}`}
      data-testid="deepgram-narrator"
    >
      <div className="flex flex-wrap items-center gap-2">
        {!isPlaying ? (
          <button type="button" onClick={start} className="laudia-btn-primary !px-4 !py-2.5">
            <span aria-hidden="true">▶</span>
            {label}
          </button>
        ) : (
          <>
            <button type="button" onClick={togglePause} className="laudia-btn-secondary !px-4 !py-2.5">
              <span aria-hidden="true">{isPaused ? '▶' : 'Ⅱ'}</span>
              {isPaused ? 'Reanudar' : 'Pausar'}
            </button>
            <button type="button" onClick={() => void stop()} className="laudia-btn-ghost !px-3 !py-2.5">
              Detener
            </button>
          </>
        )}
        <div className="min-w-[9rem] flex-1">
          <p className="text-xs font-semibold text-emerald-950">
            {isLoading ? 'Preparando la voz…' : isPlaying ? (isPaused ? 'Narración en pausa' : 'Reproduciendo') : 'Voz IA'}
          </p>
          <p className="text-[11px] text-emerald-900/60">Agustina · español de España · velocidad +30%</p>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {error || (isLoading ? 'Preparando la narración' : isPlaying ? 'Narración activa' : 'Narración detenida')}
      </p>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}

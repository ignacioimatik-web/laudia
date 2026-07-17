import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'laudia-preferences';
const CHANGE_EVENT = 'laudia-preferences-change';

export type VisualMode = 'light' | 'dark' | 'dawn';
export type DefaultMode = 'guide' | 'expert';
export type PrayerType = 'individual' | 'community' | 'family';

export interface LaudiaPreferences {
  fontSize: number;         // 12–24 px
  visualMode: VisualMode;
  showRubrics: boolean;
  defaultMode: DefaultMode;
  prayerType: PrayerType;
  enableAiHelp: boolean;
  enableMorningReminder: boolean;
  keepScreenActive: boolean;
  enableOffline: boolean;
  localCalendar: string;    // 'default' or a country code (future)
}

const DEFAULTS: LaudiaPreferences = {
  fontSize: 16,
  visualMode: 'dawn',
  showRubrics: true,
  defaultMode: 'guide',
  prayerType: 'individual',
  enableAiHelp: false,
  enableMorningReminder: false,
  keepScreenActive: false,
  enableOffline: false,
  localCalendar: 'default',
};

export function useLaudiaPreferences() {
  const [preferences, setPreferences] = useState<LaudiaPreferences>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LaudiaPreferences>;
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // corrupted data – ignore
    }
    setLoaded(true);

    const syncPreferences = (event: Event) => {
      const customEvent = event as CustomEvent<LaudiaPreferences>;
      if (customEvent.detail) setPreferences(customEvent.detail);
    };
    window.addEventListener(CHANGE_EVENT, syncPreferences);
    return () => window.removeEventListener(CHANGE_EVENT, syncPreferences);
  }, []);

  // Persist a single preference key
  const updatePreference = useCallback(
    <K extends keyof LaudiaPreferences>(key: K, value: LaudiaPreferences[K]) => {
      setPreferences(prev => {
        const next = { ...prev, [key]: value };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // quota exceeded or private mode – silently ignore
        }
        // El updater de React debe ser puro. Sincronizamos las demás
        // instancias del hook después de terminar el ciclo de render.
        queueMicrotask(() => {
          window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
        });
        return next;
      });
    },
    [],
  );

  // Reset everything to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: DEFAULTS }));
  }, []);

  return { preferences, updatePreference, resetPreferences, loaded };
}

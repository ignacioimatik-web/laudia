import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'laudia-preferences';

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
  }, []);

  return { preferences, updatePreference, resetPreferences, loaded };
}

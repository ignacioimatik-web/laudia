import { useEffect } from 'react';
import { useLaudiaPreferences } from '@/hooks/laudia/useLaudiaPreferences';

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request(type: 'screen'): Promise<{ release(): Promise<void> }>;
  };
};

export function PreferenceEffects() {
  const { preferences, loaded } = useLaudiaPreferences();

  useEffect(() => {
    if (!loaded) return;
    const root = document.documentElement;
    root.dataset.visualMode = preferences.visualMode;
    root.classList.toggle('dark', preferences.visualMode === 'dark');
    root.classList.toggle('dawn', preferences.visualMode === 'dawn');
    root.classList.toggle('light-mode', preferences.visualMode === 'light');
    root.style.setProperty('--laudia-font-size', `${preferences.fontSize}px`);
  }, [loaded, preferences.fontSize, preferences.visualMode]);

  useEffect(() => {
    if (!loaded || !preferences.keepScreenActive) return;
    const wakeLockApi = (navigator as NavigatorWithWakeLock).wakeLock;
    if (!wakeLockApi) return;

    let released = false;
    let lock: { release(): Promise<void> } | null = null;
    wakeLockApi.request('screen').then(value => {
      if (released) {
        void value.release();
      } else {
        lock = value;
      }
    }).catch(() => {
      // El navegador puede denegar Wake Lock por ahorro de batería.
    });

    return () => {
      released = true;
      if (lock) void lock.release();
    };
  }, [loaded, preferences.keepScreenActive]);

  return null;
}

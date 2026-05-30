import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface Props {
  label: string;
  lightLabel: string;
  darkLabel: string;
}

const STORAGE_KEY = 'radeq-theme-mode';

function getInitialMode(): ThemeMode {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Theme switching should still work when storage is blocked.
  }
}

export default function ThemeModeToggle({ label, lightLabel, darkLabel }: Props) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    let stored: string | null = null;

    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    const initialMode = stored === 'dark' || stored === 'light' ? stored : getInitialMode();

    setMode(initialMode);
    document.documentElement.dataset.theme = initialMode;
  }, []);

  function selectMode(nextMode: ThemeMode) {
    setMode(nextMode);
    applyThemeMode(nextMode);
  }

  return (
    <div className="theme-toggle" role="group" aria-label={label}>
      <button
        type="button"
        className={mode === 'light' ? 'is-active' : ''}
        onClick={() => selectMode('light')}
        aria-pressed={mode === 'light'}
      >
        <span className="theme-toggle__icon theme-toggle__icon--light" aria-hidden="true"></span>
        <span>{lightLabel}</span>
      </button>
      <button
        type="button"
        className={mode === 'dark' ? 'is-active' : ''}
        onClick={() => selectMode('dark')}
        aria-pressed={mode === 'dark'}
      >
        <span className="theme-toggle__icon theme-toggle__icon--dark" aria-hidden="true"></span>
        <span>{darkLabel}</span>
      </button>
    </div>
  );
}

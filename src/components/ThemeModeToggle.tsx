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
  const activeFavicon = document.querySelector<HTMLLinkElement>('link[data-theme-favicon-active]');
  if (activeFavicon) {
    activeFavicon.href = mode === 'dark' ? activeFavicon.dataset.darkHref ?? activeFavicon.href : activeFavicon.dataset.lightHref ?? activeFavicon.href;
  }

  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Theme switching should still work when storage is blocked.
  }
}

export default function ThemeModeToggle({ label, lightLabel, darkLabel }: Props) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [hydrated, setHydrated] = useState(false);

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
    const activeFavicon = document.querySelector<HTMLLinkElement>('link[data-theme-favicon-active]');
    if (activeFavicon) {
      activeFavicon.href = initialMode === 'dark' ? activeFavicon.dataset.darkHref ?? activeFavicon.href : activeFavicon.dataset.lightHref ?? activeFavicon.href;
    }
    setHydrated(true);
  }, []);

  function selectMode(nextMode: ThemeMode) {
    setMode(nextMode);
    applyThemeMode(nextMode);
  }

  function toggleMode() {
    selectMode(mode === 'light' ? 'dark' : 'light');
  }

  const isDark = mode === 'dark';
  const currentLabel = mode === 'light' ? lightLabel : darkLabel;

  return (
    <div className="theme-toggle" data-mode={mode} data-hydrated={hydrated ? 'true' : 'false'}>
      <button
        type="button"
        className="theme-toggle__button"
        role="switch"
        aria-checked={isDark}
        aria-label={`${label}: ${currentLabel}`}
        onClick={toggleMode}
      >
        <span className="theme-toggle__coin" aria-hidden="true">
          <span className="theme-toggle__coin-inner">
            <span className="theme-toggle__face theme-toggle__face--light">
              <span className="theme-toggle__sun"></span>
            </span>
            <span className="theme-toggle__face theme-toggle__face--dark">
              <span className="theme-toggle__moon"></span>
              <span className="theme-toggle__star theme-toggle__star--one"></span>
              <span className="theme-toggle__star theme-toggle__star--two"></span>
              <span className="theme-toggle__star theme-toggle__star--three"></span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

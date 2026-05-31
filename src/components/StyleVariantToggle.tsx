import { useEffect, useState } from 'react';
import type { EpochId, EpochOption } from '../data/styleMatrix';

interface Props {
  label: string;
  options: EpochOption[];
}

const STORAGE_KEY = 'radeq-style-variant';
const DEFAULT_STYLE: EpochId = 'variant-a';

function isEpochId(value: string | null): value is EpochId {
  return value === 'variant-a' || value === 'variant-b' || value === 'variant-c' || value === 'variant-d';
}

function getInitialStyle(): EpochId {
  if (typeof document === 'undefined') {
    return DEFAULT_STYLE;
  }

  const style = document.documentElement.dataset.style ?? null;
  return isEpochId(style) ? style : DEFAULT_STYLE;
}

function applyStyleVariant(styleId: EpochId) {
  document.documentElement.dataset.style = styleId;

  try {
    localStorage.setItem(STORAGE_KEY, styleId);
  } catch {
    // Style switching should still work when storage is blocked.
  }

  window.dispatchEvent(new CustomEvent('radeq:style-change', { detail: { styleId } }));
}

function getShortLabel(option: EpochOption) {
  return option.label.split('/')[0]?.trim() ?? option.label;
}

export default function StyleVariantToggle({ label, options }: Props) {
  const [styleId, setStyleId] = useState<EpochId>(DEFAULT_STYLE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let stored: string | null = null;

    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    const initialStyle = isEpochId(stored) ? stored : getInitialStyle();

    setStyleId(initialStyle);
    document.documentElement.dataset.style = initialStyle;
    setHydrated(true);
  }, []);

  function selectStyle(nextStyleId: EpochId) {
    setStyleId(nextStyleId);
    applyStyleVariant(nextStyleId);
  }

  return (
    <div className="style-toggle" role="group" aria-label={label} data-hydrated={hydrated ? 'true' : 'false'}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={styleId === option.id ? 'is-active' : ''}
          onClick={() => selectStyle(option.id)}
          aria-pressed={styleId === option.id}
          aria-label={`${option.label}: ${option.benefit}`}
          title={option.benefit}
        >
          {getShortLabel(option)}
        </button>
      ))}
    </div>
  );
}

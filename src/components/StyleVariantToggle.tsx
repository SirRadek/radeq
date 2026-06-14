import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
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

function getThemeName(option: EpochOption) {
  return option.label.split('/')[1]?.trim() ?? option.label;
}

export default function StyleVariantToggle({ label, options }: Props) {
  const [styleId, setStyleId] = useState<EpochId>(DEFAULT_STYLE);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const activeOption = options.find((option) => option.id === styleId) ?? options[0];

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

  useEffect(() => {
    if (!open) return;

    const activeIndex = Math.max(
      0,
      options.findIndex((option) => option.id === styleId),
    );
    optionRefs.current[activeIndex]?.focus();

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, options, styleId]);

  function selectStyle(nextStyleId: EpochId) {
    setStyleId(nextStyleId);
    applyStyleVariant(nextStyleId);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const currentIndex = optionRefs.current.findIndex((button) => button === document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length;
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = options.length - 1;

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      optionRefs.current[nextIndex]?.focus();
    }
  }

  return (
    <div
      className="style-toggle"
      ref={rootRef}
      data-open={open ? 'true' : 'false'}
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <button
        ref={triggerRef}
        type="button"
        className="style-toggle__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label}: ${activeOption ? getThemeName(activeOption) : ''}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="style-toggle__label">{label}</span>
        <span className="style-toggle__current">{activeOption ? getThemeName(activeOption) : ''}</span>
        <span className="style-toggle__chevron" aria-hidden="true"></span>
      </button>

      {open ? (
        <div
          className="style-toggle__menu"
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
        >
          {options.map((option, index) => (
            <button
              key={option.id}
              ref={(button) => {
                optionRefs.current[index] = button;
              }}
              type="button"
              role="menuitemradio"
              className={`style-toggle__option${styleId === option.id ? ' is-active' : ''}`}
              onClick={() => selectStyle(option.id)}
              aria-checked={styleId === option.id}
              aria-label={`${option.label}: ${option.benefit}`}
            >
              <span className="style-toggle__index">{option.label.split('/')[0]?.trim()}</span>
              <span className="style-toggle__copy">
                <strong>{getThemeName(option)}</strong>
                <small>{option.benefit}</small>
              </span>
              <span className="style-toggle__check" aria-hidden="true"></span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

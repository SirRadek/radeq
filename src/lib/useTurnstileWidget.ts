import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export type TurnstileWidgetId = string;

export interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileRenderOptions): TurnstileWidgetId;
  reset(widgetId?: TurnstileWidgetId): void;
  remove?(widgetId: TurnstileWidgetId): void;
}

export interface TurnstileRenderOptions {
  sitekey: string;
  appearance?: 'always' | 'execute' | 'interaction-only';
  callback(token: string): void;
  'expired-callback'(): void;
  'error-callback'(): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface UseTurnstileWidgetParams {
  enabled: boolean;
  siteKey: string;
  onToken: (token: string) => void;
  onExpire?: () => void;
  onUnavailable?: (unavailable: boolean) => void;
}

interface UseTurnstileWidgetResult {
  containerRef: RefObject<HTMLDivElement | null>;
  resetWidget: () => void;
}

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

let turnstileScriptPromise: Promise<void> | null = null;

export function useTurnstileWidget({
  enabled,
  siteKey,
  onToken,
  onExpire,
  onUnavailable,
}: UseTurnstileWidgetParams): UseTurnstileWidgetResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  const onUnavailableRef = useRef(onUnavailable);

  onTokenRef.current = onToken;
  onExpireRef.current = onExpire;
  onUnavailableRef.current = onUnavailable;

  useEffect(() => {
    if (!enabled) return undefined;

    let isActive = true;

    loadTurnstileScript()
      .then(() => {
        if (!isActive || widgetIdRef.current || !containerRef.current || !window.turnstile) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          appearance: 'interaction-only',
          callback: (token) => {
            onTokenRef.current(token);
            onUnavailableRef.current?.(false);
          },
          'expired-callback': () => {
            onTokenRef.current('');
            onExpireRef.current?.();
          },
          'error-callback': () => {
            onTokenRef.current('');
            onUnavailableRef.current?.(true);
          },
        });
      })
      .catch(() => {
        if (isActive) {
          onTokenRef.current('');
          onUnavailableRef.current?.(true);
        }
      });

    return () => {
      isActive = false;
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [enabled, siteKey]);

  const resetWidget = useCallback(() => {
    if (!enabled) return;

    onTokenRef.current('');

    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [enabled]);

  return { containerRef, resetWidget };
}

export function readSubmittedTurnstileToken(stateToken: string, container: HTMLElement | null): string {
  return (
    stateToken.trim() ||
    container?.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value.trim() ||
    ''
  );
}

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT_SRC}"]`);

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Turnstile failed to load.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener(
        'error',
        () => {
          turnstileScriptPromise = null;
          reject(new Error('Turnstile failed to load.'));
        },
        { once: true },
      );
      document.head.append(script);
    });
  }

  return turnstileScriptPromise;
}

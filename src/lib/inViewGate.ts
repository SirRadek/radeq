export type InViewGateOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  onEnter?: () => void;
  onExit?: () => void;
};

export type InViewGateHandle = {
  destroy: () => void;
};

export function inViewGate(
  el: Element,
  {
    rootMargin = '120px 0px',
    threshold = 0,
    onEnter = () => {},
    onExit = () => {},
  }: InViewGateOptions = {},
): InViewGateHandle {
  let observer: IntersectionObserver | null = null;
  let isIntersecting = false;
  let isActive = false;
  let destroyed = false;

  function enter() {
    if (destroyed || isActive) return;
    isActive = true;
    onEnter();
  }

  function exit() {
    if (destroyed || !isActive) return;
    isActive = false;
    onExit();
  }

  function sync() {
    if (document.hidden || !isIntersecting) {
      exit();
      return;
    }

    enter();
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      exit();
      return;
    }

    if (isIntersecting) enter();
  }

  function cleanup() {
    observer?.disconnect();
    observer = null;
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', handlePageHide);
  }

  function handlePageHide() {
    onExit();
    isActive = false;
    destroyed = true;
    cleanup();
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', handlePageHide, { once: true });

  if (!('IntersectionObserver' in window)) {
    isIntersecting = true;
    if (!document.hidden) enter();

    return {
      destroy() {
        destroyed = true;
        cleanup();
      },
    };
  }

  observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    isIntersecting = Boolean(entry && entry.isIntersecting);
    sync();
  }, { rootMargin, threshold });

  observer.observe(el);

  return {
    destroy() {
      destroyed = true;
      cleanup();
    },
  };
}

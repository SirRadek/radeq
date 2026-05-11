import { useEffect } from 'react';

type MotionScene = {
  element: HTMLElement;
  id: string;
};

export default function MotionOrchestrator() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      root.dataset.motionReady = 'reduced';
      root.dataset.motionScene = getSceneId(document.querySelector('main section'));
      return;
    }

    const scenes: MotionScene[] = Array.from(document.querySelectorAll<HTMLElement>('main section')).map(
      (element, index) => ({
        element,
        id: getSceneId(element, index),
      }),
    );
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    let activeScene = '';

    root.dataset.motionReady = 'true';

    const updateScene = () => {
      const viewportAnchor = window.innerHeight * 0.32;
      let nextScene = scenes[0]?.id ?? 'page';
      let nextDistance = Number.POSITIVE_INFINITY;

      for (const scene of scenes) {
        const rect = scene.element.getBoundingClientRect();
        if (rect.top <= viewportAnchor && rect.bottom >= viewportAnchor) {
          nextScene = scene.id;
          nextDistance = 0;
          break;
        }

        const distance = Math.abs(rect.top - viewportAnchor);
        if (distance < nextDistance) {
          nextDistance = distance;
          nextScene = scene.id;
        }
      }

      if (nextScene !== activeScene) {
        activeScene = nextScene;
        root.dataset.motionScene = activeScene;
        window.dispatchEvent(new CustomEvent('autopilot:motion-scene', { detail: { scene: activeScene } }));
      }

      const pageScrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      root.style.setProperty('--motion-progress', (window.scrollY / pageScrollable).toFixed(4));
      root.style.setProperty('--motion-scroll', `${window.scrollY.toFixed(1)}px`);
    };

    const writeMotionVars = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.095;
      currentY += (targetY - currentY) * 0.095;

      root.style.setProperty('--motion-x', currentX.toFixed(4));
      root.style.setProperty('--motion-y', currentY.toFixed(4));
      root.style.setProperty('--motion-soft-x', `${(currentX * 8).toFixed(2)}px`);
      root.style.setProperty('--motion-soft-y', `${(currentY * 8).toFixed(2)}px`);
      root.style.setProperty('--motion-mid-x', `${(currentX * 16).toFixed(2)}px`);
      root.style.setProperty('--motion-mid-y', `${(currentY * 16).toFixed(2)}px`);
      root.style.setProperty('--motion-deep-x', `${(currentX * 28).toFixed(2)}px`);
      root.style.setProperty('--motion-deep-y', `${(currentY * 28).toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
        scheduleFrame();
      }
    };

    const scheduleFrame = () => {
      if (!frame) frame = window.requestAnimationFrame(writeMotionVars);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      targetX = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      targetY = (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
      scheduleFrame();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      scheduleFrame();
    };

    const onScrollOrResize = () => {
      updateScene();
      scheduleFrame();
    };

    updateScene();
    scheduleFrame();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return null;
}

function getSceneId(element: Element | null, fallbackIndex = 0): string {
  if (!element) return 'page';
  if (element.id) return element.id;
  const className = typeof element.className === 'string' ? element.className.split(/\s+/)[0] : '';
  return className || `section-${fallbackIndex + 1}`;
}

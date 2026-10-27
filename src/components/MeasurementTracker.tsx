import { useEffect } from 'react';
import { dispatchMeasurementEvent, measurementEvents, type MeasurementEventName } from '../lib/measurement';

const trackedEvents = new Set<string>(measurementEvents);

export default function MeasurementTracker() {
  useEffect(() => {
    const root = document.documentElement;

    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track]') : null;
      const eventName = target?.dataset.track;

      if (!eventName || !trackedEvents.has(eventName)) return;

      dispatchMeasurementEvent(eventName as MeasurementEventName);
    }

    root.dataset.measurementReady = 'true';
    document.addEventListener('click', onClick, { capture: true });

    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      delete root.dataset.measurementReady;
    };
  }, []);

  return null;
}

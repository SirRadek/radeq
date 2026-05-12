import type { SiteContent } from '../data/siteContent';
import DemoPreviewRegistry from './DemoPreviewRegistry';

type DemoItem = SiteContent['demos']['items'][number];
type Viewport = 'desktop' | 'mobile';

interface Props {
  demo: DemoItem;
  viewport: Viewport;
  controls: SiteContent['demos']['controls'];
  panelId: string;
  onViewportChange: (viewport: Viewport) => void;
}

export default function DemoWorkbench({ demo, viewport, controls, panelId, onViewportChange }: Props) {
  return (
    <div
      id={panelId}
      className="demo-workbench"
      role="tabpanel"
      aria-labelledby={`demo-tab-${demo.id}`}
      data-demo-workbench
      data-active-demo={demo.id}
      data-viewport={viewport}
    >
      <div className="demo-browser-bar">
        <div className="demo-browser-bar__url" aria-live="polite">
          <span aria-hidden="true" />
          <strong>{demo.preview.urlLabel}</strong>
        </div>
        <div className="demo-browser-bar__actions">
          {demo.preview.features.includes('mobile-toggle') ? (
            <>
              <button
                type="button"
                className={viewport === 'desktop' ? 'is-active' : ''}
                aria-pressed={viewport === 'desktop'}
                onClick={() => onViewportChange('desktop')}
              >
                {controls.desktopLabel}
              </button>
              <button
                type="button"
                className={viewport === 'mobile' ? 'is-active' : ''}
                aria-pressed={viewport === 'mobile'}
                onClick={() => onViewportChange('mobile')}
              >
                {controls.mobileLabel}
              </button>
            </>
          ) : null}
          {demo.route ? <a href={demo.route}>{controls.openRouteLabel}</a> : null}
        </div>
      </div>

      <div className="demo-viewport-shell">
        <div className="demo-viewport">
          <DemoPreviewRegistry id={demo.preview.id} />
        </div>
      </div>

      <div className="demo-result-grid">
        <section>
          <h3>{controls.resultLabel}</h3>
          <p>{demo.result}</p>
        </section>
        <section>
          <h3>{controls.eventsLabel}</h3>
          <ol>
            {demo.events.map((event) => (
              <li key={event}>{event}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

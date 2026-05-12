import type { KeyboardEvent } from 'react';
import type { SiteContent } from '../data/siteContent';

type DemoItem = SiteContent['demos']['items'][number];

interface Props {
  demo: DemoItem;
  index: number;
  isActive: boolean;
  controls: SiteContent['demos']['controls'];
  panelId: string;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onActivate: (id: DemoItem['id']) => void;
  onMove: (direction: -1 | 1) => void;
}

export default function DemoCard({ demo, index, isActive, controls, panelId, buttonRef, onActivate, onMove }: Props) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      onMove(1);
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      onMove(-1);
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      id={`demo-tab-${demo.id}`}
      className={`demo-selector${isActive ? ' is-active' : ''}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      data-cat-platform={`demo-card-${index + 1}`}
      data-selected={isActive ? 'true' : 'false'}
      onClick={() => onActivate(demo.id)}
      onKeyDown={handleKeyDown}
    >
      <span className="demo-selector__meta">{demo.metric || `${index + 1}`}</span>
      <span className="demo-selector__title">{demo.name}</span>
      <span className="demo-selector__summary">{demo.summary}</span>
      <span className="demo-selector__state">{isActive ? controls.selectedLabel : controls.activatePrefix}</span>
    </button>
  );
}

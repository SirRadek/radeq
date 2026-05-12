import { useEffect, useMemo, useRef, useState } from 'react';
import type { SiteContent } from '../data/siteContent';
import DemoCard from './DemoCard';
import DemoWorkbench from './DemoWorkbench';

interface Props {
  content: SiteContent['demos'];
}

type DemoId = SiteContent['demos']['items'][number]['id'];
type Viewport = 'desktop' | 'mobile';

export default function DemoGallery({ content }: Props) {
  const firstDemo = content.items[0]!;
  const [activeDemoId, setActiveDemoId] = useState<DemoId>(firstDemo.id);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [hydrated, setHydrated] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = 'demo-workbench-panel';

  useEffect(() => {
    setHydrated(true);
  }, []);

  const activeIndex = Math.max(
    0,
    content.items.findIndex((item) => item.id === activeDemoId),
  );

  const activeDemo = useMemo(() => content.items[activeIndex] ?? firstDemo, [activeIndex, content.items, firstDemo]);

  function activateDemo(id: DemoId) {
    setActiveDemoId(id);
  }

  function moveSelection(direction: -1 | 1) {
    const nextIndex = (activeIndex + direction + content.items.length) % content.items.length;
    const nextDemo = content.items[nextIndex]!;
    setActiveDemoId(nextDemo.id);
    requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  }

  return (
    <section
      className="demo-section demo-section--interactive"
      id="demos"
      aria-labelledby="demo-title"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="section-heading">
        {content.sectionCode ? <p className="section-code">{content.sectionCode}</p> : null}
        <h2 id="demo-title">{content.title}</h2>
        <p>{content.lead}</p>
      </div>

      <div className="demo-gallery">
        <div className="demo-selector-list" role="tablist" aria-label={content.title}>
          {content.items.map((demo, index) => (
            <DemoCard
              key={demo.id}
              demo={demo}
              index={index}
              isActive={activeDemo.id === demo.id}
              controls={content.controls}
              panelId={panelId}
              buttonRef={(node) => {
                tabRefs.current[index] = node;
              }}
              onActivate={activateDemo}
              onMove={moveSelection}
            />
          ))}
        </div>

        <DemoWorkbench
          demo={activeDemo}
          viewport={viewport}
          controls={content.controls}
          panelId={panelId}
          onViewportChange={setViewport}
        />
      </div>
    </section>
  );
}

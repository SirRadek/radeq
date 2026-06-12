import { useMemo, useState } from 'react';
import type { ChatbotGuideData } from '../data/chatbotGuide';

interface Props {
  guide: ChatbotGuideData;
}

export default function RuleChatbotGuide({ guide }: Props) {
  const [path, setPath] = useState<string[]>([guide.rootId]);
  const [showHandoff, setShowHandoff] = useState(false);
  const nodesById = useMemo(() => new Map(guide.nodes.map((node) => [node.id, node])), [guide.nodes]);
  const currentNode = nodesById.get(path[path.length - 1]) ?? nodesById.get(guide.rootId);

  if (!currentNode) {
    return null;
  }

  const canGoBack = path.length > 1;

  function choose(nextId: string) {
    if (!nodesById.has(nextId)) return;
    setPath((current) => [...current, nextId]);
    setShowHandoff(false);
  }

  function goBack() {
    setPath((current) => (current.length > 1 ? current.slice(0, -1) : current));
    setShowHandoff(false);
  }

  function reset() {
    setPath([guide.rootId]);
    setShowHandoff(false);
  }

  return (
    <section className="rule-chatbot" aria-labelledby="rule-chatbot-title">
      <div className="rule-chatbot__intro">
        <p className="section-code">Statický průvodce</p>
        <h2 id="rule-chatbot-title">{guide.title}</h2>
        <p>{guide.subtitle}</p>
        <p className="rule-chatbot__disclaimer">{guide.disclaimer}</p>
      </div>

      <div className="rule-chatbot__panel">
        <div>
          <p className="section-code">Krok {path.length}</p>
          <h3>{currentNode.title}</h3>
          <p>{currentNode.body}</p>
        </div>

        {currentNode.choices.length > 0 ? (
          <div className="rule-chatbot__options" aria-label="Možnosti průvodce">
            {currentNode.choices.map((choice) => (
              <button key={choice.nextId} type="button" onClick={() => choose(choice.nextId)}>
                {choice.label}
              </button>
            ))}
          </div>
        ) : null}

        {currentNode.result ? (
          <div className="rule-chatbot__result">
            <p>{currentNode.result.summary}</p>
            <p>{currentNode.result.handoff}</p>
            <button type="button" onClick={() => setShowHandoff(true)}>
              {guide.handoffLabel}
            </button>
          </div>
        ) : null}

        {showHandoff ? (
          <div className="rule-chatbot__handoff" role="status" aria-live="polite">
            <p>Shrnutí se nikam neposílá automaticky.</p>
            <p>Další krok je vědomé otevření poptávky a ruční domluva rozsahu.</p>
            <a className="button-primary" href={guide.handoffHref}>
              {guide.handoffCta}
            </a>
          </div>
        ) : null}

        <div className="rule-chatbot__controls">
          <button type="button" onClick={goBack} disabled={!canGoBack}>
            {guide.backLabel}
          </button>
          <button type="button" onClick={reset}>
            {guide.resetLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

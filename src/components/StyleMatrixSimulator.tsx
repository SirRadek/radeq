import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { Locale } from '../data/locales';
import type { SiteContent } from '../data/siteContent';
import { getEpochOptions, getModuleOptions, type EpochId, type MatrixPreset, type ModuleId } from '../data/styleMatrix';
import { DEFAULT_MATRIX_SELECTION, getMatrixPreset, getRuntimeStyle } from '../lib/matrix';

interface Props {
  locale: Locale;
  content: SiteContent['matrix'];
}

export default function StyleMatrixSimulator({ locale, content }: Props) {
  const [moduleId, setModuleId] = useState<ModuleId>(DEFAULT_MATRIX_SELECTION.moduleId);
  const [epochId, setEpochId] = useState<EpochId>(DEFAULT_MATRIX_SELECTION.epochId);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const selection = useMemo(() => ({ moduleId, epochId }), [moduleId, epochId]);
  const preset = getMatrixPreset(selection, locale);
  const runtimeStyle = getRuntimeStyle(selection, locale) as CSSProperties;
  const moduleOptions = getModuleOptions(locale);
  const epochOptions = getEpochOptions(locale);

  return (
    <section
      className="matrix-section"
      id="matrix"
      aria-labelledby="matrix-title"
      style={runtimeStyle}
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className="section-heading" data-cat-platform="matrix-heading">
        {content.sectionCode ? <p className="section-code">{content.sectionCode}</p> : null}
        <h2 id="matrix-title">{content.title}</h2>
        <p>{content.lead}</p>
      </div>

      <div className="matrix-workbench" data-cat-platform="matrix-workbench">
        <div className="matrix-controls matrix-controls--combined">
          <div
            className="matrix-control-group matrix-control-group--modules"
            role="group"
            aria-label={content.moduleAria}
          >
            <h3>{content.moduleLabel}</h3>
            {moduleOptions.map((option) => {
              const isActiveModule = moduleId === option.id;
              const pickerId = `style-picker-${option.id}`;

              return (
                <div key={option.id} className={`module-choice${isActiveModule ? ' is-active' : ''}`}>
                  <button
                    type="button"
                    className={`module-card${isActiveModule ? ' is-active' : ''}`}
                    onClick={() => setModuleId(option.id)}
                    disabled={!hydrated}
                    aria-expanded={isActiveModule}
                    aria-controls={isActiveModule ? pickerId : undefined}
                  >
                    <span className="module-card__title">{option.label}</span>
                    <span className="module-card__benefit">{option.benefit}</span>
                  </button>

                  {isActiveModule ? (
                    <div
                      id={pickerId}
                      className="module-style-picker"
                      role="group"
                      aria-label={`${content.epochLabel}: ${option.label}`}
                    >
                      <span className="module-style-picker__label">{content.epochLabel}</span>
                      <div className="style-chip-grid">
                        {epochOptions.map((styleOption) => (
                          <button
                            key={styleOption.id}
                            type="button"
                            className={`style-chip${epochId === styleOption.id ? ' is-active' : ''}`}
                            onClick={() => setEpochId(styleOption.id)}
                            disabled={!hydrated}
                            title={styleOption.benefit}
                          >
                            <span>{styleOption.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <ProposalPreview key={preset.id} preset={preset} moduleId={moduleId} variantId={epochId} locale={locale} />
      </div>
    </section>
  );
}

function ProposalPreview({
  preset,
  moduleId,
  variantId,
  locale,
}: {
  preset: MatrixPreset;
  moduleId: ModuleId;
  variantId: EpochId;
  locale: Locale;
}) {
  if (variantId === 'variant-a') {
    return <TrustPreview preset={preset} moduleId={moduleId} />;
  }

  if (variantId === 'variant-d') {
    return <StudioPreview preset={preset} moduleId={moduleId} locale={locale} />;
  }

  if (variantId === 'variant-c') {
    return <ProofPreview preset={preset} moduleId={moduleId} />;
  }

  return <MotionPreview preset={preset} moduleId={moduleId} />;
}

function TrustPreview({ preset, moduleId }: { preset: MatrixPreset; moduleId: ModuleId }) {
  return (
    <article
      className="matrix-preview matrix-preview--trust"
      aria-live="polite"
      data-module={moduleId}
      data-style={preset.selection.epochId}
      data-layout={preset.design.layout}
    >
      <div className="preview-copy preview-copy--trust">
        <p className="preview-style-name">{preset.design.name}</p>
        <h3>{preset.headline}</h3>
        <p className="preview-lead">{preset.summary}</p>
        <a href="#terminal">{preset.cta}</a>
      </div>

      <div className="trust-page-sheet" aria-hidden="true">
        <div className="trust-sheet trust-sheet--primary">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="trust-sheet trust-sheet--secondary">
          <span></span>
          <span></span>
        </div>
      </div>

      <dl className="preview-proof preview-proof--trust">
        {preset.proofPoints.map((point) => (
          <div key={point.label}>
            <dt>{point.label}</dt>
            <dd>{point.value}</dd>
          </div>
        ))}
      </dl>

      <ul className="preview-detail-list preview-detail-list--trust">
        {preset.design.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </article>
  );
}

function MotionPreview({ preset, moduleId }: { preset: MatrixPreset; moduleId: ModuleId }) {
  return (
    <article
      className="matrix-preview matrix-preview--motion"
      aria-live="polite"
      data-module={moduleId}
      data-style={preset.selection.epochId}
      data-layout={preset.design.layout}
    >
      <div className="preview-copy preview-copy--motion">
        <p className="preview-style-name">{preset.design.name}</p>
        <h3>{preset.headline}</h3>
        <p className="preview-lead">{preset.lead}</p>
        <a href="#terminal">{preset.cta}</a>
      </div>

      <div className="motion-flow-field preview-mockup" aria-hidden="true">
        <span className="flow-thread flow-thread--one"></span>
        <span className="flow-thread flow-thread--two"></span>
        <span className="flow-thread flow-thread--three"></span>
        <span className="flow-cursor"></span>
        <span className="flow-node flow-node--visitor"></span>
        <span className="flow-node flow-node--intent"></span>
        <span className="flow-node flow-node--request"></span>
        <span className="flow-card flow-card--top"></span>
        <span className="flow-card flow-card--bottom"></span>
      </div>

      <ol className="motion-route">
        <li>návštěvník</li>
        <li>první jasná volba</li>
        <li>poptávka bez zmatku</li>
      </ol>

      <ul className="preview-detail-list preview-detail-list--motion">
        {preset.design.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </article>
  );
}

function ProofPreview({ preset, moduleId }: { preset: MatrixPreset; moduleId: ModuleId }) {
  return (
    <article
      className="matrix-preview matrix-preview--proof"
      aria-live="polite"
      data-module={moduleId}
      data-style={preset.selection.epochId}
      data-layout={preset.design.layout}
    >
      <div className="preview-copy preview-copy--proof">
        <p className="preview-style-name">{preset.design.name}</p>
        <h3>{preset.headline}</h3>
        <p className="preview-lead">{preset.lead}</p>
      </div>

      <dl className="proof-metrics">
        {preset.proofPoints.map((point, index) => (
          <div key={point.label}>
            <dt>{index === 0 ? '+34%' : index === 1 ? '-26%' : '99.9%'}</dt>
            <dd>{point.label}</dd>
          </div>
        ))}
      </dl>

      <ol className="proof-timeline" aria-label="Postup návrhu">
        <li>analýza</li>
        <li>návrh</li>
        <li>vývoj</li>
        <li>měření</li>
        <li>předání</li>
      </ol>

      <div className="proof-board preview-mockup" aria-hidden="true">
        <span className="proof-row proof-row--header"></span>
        <span className="proof-row"></span>
        <span className="proof-row"></span>
        <span className="proof-row"></span>
        <span className="proof-check"></span>
        <span className="proof-check"></span>
        <span className="proof-check"></span>
      </div>

      <ul className="preview-detail-list preview-detail-list--proof">
        {preset.design.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>

      <a href="#terminal">{preset.cta}</a>
    </article>
  );
}

function StudioPreview({ preset, moduleId, locale }: { preset: MatrixPreset; moduleId: ModuleId; locale: Locale }) {
  const copy =
    locale === 'cs'
      ? {
          need: 'Co potřebujete?',
          map: 'Výsledková mapa',
          center: 'Váš web',
          light: 'Světlý',
          dark: 'Tmavý',
          outputs: ['Více poptávek', 'Lepší srozumitelnost', 'Měřitelné výsledky', 'Úspora času'],
        }
      : {
          need: 'What do you need?',
          map: 'Outcome map',
          center: 'Your site',
          light: 'Light',
          dark: 'Dark',
          outputs: ['More requests', 'Clearer message', 'Measured results', 'Saved time'],
        };

  return (
    <article
      className="matrix-preview matrix-preview--studio"
      aria-live="polite"
      data-module={moduleId}
      data-style={preset.selection.epochId}
      data-layout={preset.design.layout}
    >
      <div className="preview-copy preview-copy--studio">
        <p className="preview-style-name">{preset.design.name}</p>
        <h3>{preset.headline}</h3>
        <p className="preview-lead">{preset.summary}</p>
        <a href="#terminal">{preset.cta}</a>
      </div>

      <div className="studio-configurator" aria-hidden="true">
        <div className="studio-mode-switch">
          <span>{copy.light}</span>
          <span>{copy.dark}</span>
        </div>
        <p>{copy.need}</p>
        <div className="studio-service-grid">
          {preset.proofPoints.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
          <span>{preset.proofTag}</span>
        </div>
      </div>

      <div className="studio-outcome-map" aria-hidden="true">
        <p>{copy.map}</p>
        <span className="studio-map-core">{copy.center}</span>
        {copy.outputs.map((output) => (
          <span key={output}>{output}</span>
        ))}
      </div>

      <ul className="preview-detail-list preview-detail-list--studio">
        {preset.design.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </article>
  );
}

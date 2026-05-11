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

        <div
          key={preset.id}
          className="matrix-preview"
          aria-live="polite"
          data-module={moduleId}
          data-style={epochId}
          data-layout={preset.design.layout}
        >
          <div className="preview-copy">
            <p className="preview-style-name">{preset.design.name}</p>
            <h3>{preset.headline}</h3>
            <p className="preview-lead">{preset.lead}</p>
          </div>
          <dl className="preview-proof">
            {preset.proofPoints.map((point) => (
              <div key={point.label}>
                <dt>{point.label}</dt>
                <dd>{point.value}</dd>
              </div>
            ))}
          </dl>
          <PreviewMockup preset={preset} moduleId={moduleId} />
          <ul className="preview-detail-list">
            {preset.design.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <a href="#terminal">{preset.cta}</a>
        </div>
      </div>
    </section>
  );
}

function PreviewMockup({ preset, moduleId }: { preset: MatrixPreset; moduleId: ModuleId }) {
  const className = `preview-mockup preview-mockup--${preset.design.layout} preview-mockup--${moduleId}`;

  if (moduleId === 'blog-docs') {
    return (
      <div className={className} aria-hidden="true">
        <span className="mockup-brand"></span>
        <span className="mockup-search"></span>
        <span className="mockup-topic"></span>
        <span className="mockup-topic"></span>
        <span className="mockup-feature"></span>
        <span className="mockup-toc"></span>
        <span className="mockup-article"></span>
        <span className="mockup-article"></span>
        <span className="mockup-article"></span>
        <span className="mockup-related"></span>
      </div>
    );
  }

  if (moduleId === 'service-landing') {
    return (
      <div className={className} aria-hidden="true">
        <span className="mockup-brand"></span>
        <span className="mockup-nav"></span>
        <span className="mockup-hero"></span>
        <span className="mockup-proof"></span>
        <span className="mockup-proof"></span>
        <span className="mockup-proof"></span>
        <span className="mockup-form"></span>
        <span className="mockup-cta"></span>
        <span className="mockup-trust"></span>
      </div>
    );
  }

  if (moduleId === 'admin-dashboard') {
    return (
      <div className={className} aria-hidden="true">
        <span className="mockup-sidebar"></span>
        <span className="mockup-metric"></span>
        <span className="mockup-metric"></span>
        <span className="mockup-metric"></span>
        <span className="mockup-chart"></span>
        <span className="mockup-queue"></span>
        <span className="mockup-table"></span>
        <span className="mockup-alert"></span>
      </div>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      <span className="mockup-brand"></span>
      <span className="mockup-filter"></span>
      <span className="mockup-product"></span>
      <span className="mockup-product"></span>
      <span className="mockup-product"></span>
      <span className="mockup-product"></span>
      <span className="mockup-compare"></span>
      <span className="mockup-cart"></span>
      <span className="mockup-badge"></span>
    </div>
  );
}

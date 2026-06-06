import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { Locale } from '../data/locales';
import type { SiteContent } from '../data/siteContent';
import { getModuleOptions, type EpochId, type MatrixPreset, type ModuleId } from '../data/styleMatrix';
import { DEFAULT_MATRIX_SELECTION, getMatrixPreset, getRuntimeStyle } from '../lib/matrix';

interface Props {
  locale: Locale;
  content: SiteContent['matrix'];
  initialModuleId?: ModuleId;
}

function isEpochId(value: string | null | undefined): value is EpochId {
  return value === 'variant-a' || value === 'variant-b' || value === 'variant-c' || value === 'variant-d';
}

function getDocumentStyle(): EpochId {
  if (typeof document === 'undefined') {
    return DEFAULT_MATRIX_SELECTION.epochId;
  }

  const style = document.documentElement.dataset.style;
  return isEpochId(style) ? style : DEFAULT_MATRIX_SELECTION.epochId;
}

type ShopCategory = 'all' | 'work' | 'creator' | 'upgrade';
type ShopTone = 'green' | 'cyan' | 'coral';

interface ShopProduct {
  id: string;
  category: Exclude<ShopCategory, 'all'>;
  tone: ShopTone;
  name: string;
  badge: string;
  description: string;
  price: number;
  specs: string[];
  delivery: string;
}

interface ShopCopy {
  sectionTitle: string;
  sectionLead: string;
  eyebrow: string;
  title: string;
  lead: string;
  inventory: string;
  filterLabel: string;
  categories: { id: ShopCategory; label: string }[];
  products: ShopProduct[];
  add: string;
  added: string;
  compare: string;
  comparing: string;
  compareTitle: string;
  compareLead: string;
  cartTitle: string;
  cartEmpty: string;
  cartLine: string;
  remove: string;
  cartCta: string;
  disclaimer: string;
}

const shopCopy: Record<Locale, ShopCopy> = {
  cs: {
    sectionTitle: 'Vyzkoušejte výběr, porovnání a demo košík.',
    sectionLead:
      'Tohle není jen obrázek obchodu. Filtry, porovnání a košík reagují, ale nic neobjednávají ani nezpracovávají platbu.',
    eyebrow: 'Modelový e-shop / PC sestavy',
    title: 'Vyberte sestavu bez luštění parametrů.',
    lead:
      'Tři jasné scénáře, srozumitelné ceny a porovnání, které pomůže rozhodnout bez nekonečného katalogu.',
    inventory: '3 sestavy k porovnání',
    filterLabel: 'Filtrovat modelové sestavy',
    categories: [
      { id: 'all', label: 'Vše' },
      { id: 'work', label: 'Práce' },
      { id: 'creator', label: 'Tvorba' },
      { id: 'upgrade', label: 'Upgrade' },
    ],
    products: [
      {
        id: 'focus-mini',
        category: 'work',
        tone: 'green',
        name: 'Focus Mini',
        badge: 'Tichá kancelář',
        description: 'Kompaktní počítač pro administrativu, videohovory a každodenní práci.',
        price: 19990,
        specs: ['Ryzen 5', '32 GB RAM', '1 TB SSD'],
        delivery: 'Modelový termín: 3 dny',
      },
      {
        id: 'creator-pro',
        category: 'creator',
        tone: 'cyan',
        name: 'Creator Pro',
        badge: 'Doporučujeme',
        description: 'Výkonnější sestava pro grafiku, střih, více aplikací a lokální AI nástroje.',
        price: 34990,
        specs: ['Ryzen 7', '64 GB RAM', '2 TB NVMe'],
        delivery: 'Modelový termín: 5 dnů',
      },
      {
        id: 'upgrade-kit',
        category: 'upgrade',
        tone: 'coral',
        name: 'Upgrade Kit',
        badge: 'Pro současný PC',
        description: 'Rychlejší disk, více paměti, montáž a kontrola bez nákupu celé nové sestavy.',
        price: 8490,
        specs: ['32 GB RAM', '1 TB NVMe', 'Montáž + test'],
        delivery: 'Termín po kontrole PC',
      },
    ],
    add: 'Přidat do košíku',
    added: 'V košíku',
    compare: 'Porovnat',
    comparing: 'Porovnává se',
    compareTitle: 'Rychlé porovnání',
    compareLead: 'Vyberte nejvýše dvě sestavy. Třetí volba nahradí nejstarší.',
    cartTitle: 'Demo košík',
    cartEmpty: 'Vyberte sestavu. Nic se neobjedná ani nezaplatí.',
    cartLine: 'Vybraná sestava',
    remove: 'Odebrat',
    cartCta: 'Nezávazně poptat sestavu',
    disclaimer: 'Ukázka neodesílá objednávku ani platbu.',
  },
  en: {
    sectionTitle: 'Try product selection, comparison, and a demo cart.',
    sectionLead:
      'This is more than a shop screenshot. Filters, comparison, and the cart respond without placing an order or processing payment.',
    eyebrow: 'Sample shop / PC builds',
    title: 'Choose a build without decoding specifications.',
    lead:
      'Three clear scenarios, readable prices, and a comparison that supports a decision without an endless catalogue.',
    inventory: '3 builds to compare',
    filterLabel: 'Filter sample PC builds',
    categories: [
      { id: 'all', label: 'All' },
      { id: 'work', label: 'Work' },
      { id: 'creator', label: 'Creative' },
      { id: 'upgrade', label: 'Upgrade' },
    ],
    products: [
      {
        id: 'focus-mini',
        category: 'work',
        tone: 'green',
        name: 'Focus Mini',
        badge: 'Quiet office',
        description: 'A compact computer for administration, video calls, and everyday work.',
        price: 19990,
        specs: ['Ryzen 5', '32 GB RAM', '1 TB SSD'],
        delivery: 'Sample lead time: 3 days',
      },
      {
        id: 'creator-pro',
        category: 'creator',
        tone: 'cyan',
        name: 'Creator Pro',
        badge: 'Recommended',
        description: 'A stronger build for graphics, editing, multitasking, and local AI tools.',
        price: 34990,
        specs: ['Ryzen 7', '64 GB RAM', '2 TB NVMe'],
        delivery: 'Sample lead time: 5 days',
      },
      {
        id: 'upgrade-kit',
        category: 'upgrade',
        tone: 'coral',
        name: 'Upgrade Kit',
        badge: 'For your current PC',
        description: 'A faster drive, more memory, fitting, and checks without replacing the whole computer.',
        price: 8490,
        specs: ['32 GB RAM', '1 TB NVMe', 'Fitting + test'],
        delivery: 'Timing after a PC check',
      },
    ],
    add: 'Add to cart',
    added: 'In cart',
    compare: 'Compare',
    comparing: 'Comparing',
    compareTitle: 'Quick comparison',
    compareLead: 'Choose up to two builds. A third choice replaces the oldest one.',
    cartTitle: 'Demo cart',
    cartEmpty: 'Choose a build. Nothing is ordered or charged.',
    cartLine: 'Selected build',
    remove: 'Remove',
    cartCta: 'Request this build',
    disclaimer: 'This preview does not place an order or process payment.',
  },
};

export default function StyleMatrixSimulator({ locale, content, initialModuleId }: Props) {
  const [moduleId, setModuleId] = useState<ModuleId>(initialModuleId ?? DEFAULT_MATRIX_SELECTION.moduleId);
  const [epochId, setEpochId] = useState<EpochId>(DEFAULT_MATRIX_SELECTION.epochId);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEpochId(getDocumentStyle());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handleStyleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ styleId?: EpochId }>).detail;
      if (isEpochId(detail?.styleId)) {
        setEpochId(detail.styleId);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'radeq-style-variant' && isEpochId(event.newValue)) {
        setEpochId(event.newValue);
      }
    };

    window.addEventListener('radeq:style-change', handleStyleChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('radeq:style-change', handleStyleChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const selection = useMemo(() => ({ moduleId, epochId }), [moduleId, epochId]);
  const preset = getMatrixPreset(selection, locale);
  const runtimeStyle = getRuntimeStyle(selection, locale) as CSSProperties;
  const moduleOptions = getModuleOptions(locale);
  const activeShopCopy = moduleId === 'eshop-offers' ? shopCopy[locale] : null;

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
        <h2 id="matrix-title">{activeShopCopy?.sectionTitle ?? content.title}</h2>
        <p>{activeShopCopy?.sectionLead ?? content.lead}</p>
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
              return (
                <div key={option.id} className={`module-choice${isActiveModule ? ' is-active' : ''}`}>
                  <button
                    type="button"
                    className={`module-card${isActiveModule ? ' is-active' : ''}`}
                    onClick={() => setModuleId(option.id)}
                    disabled={!hydrated}
                    aria-pressed={isActiveModule}
                  >
                    <span className="module-card__title">{option.label}</span>
                    <span className="module-card__benefit">{option.benefit}</span>
                  </button>
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
  if (moduleId === 'eshop-offers') {
    return <ShopPreview preset={preset} variantId={variantId} locale={locale} />;
  }

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

function ShopPreview({ preset, variantId, locale }: { preset: MatrixPreset; variantId: EpochId; locale: Locale }) {
  const copy = shopCopy[locale];
  const [category, setCategory] = useState<ShopCategory>('all');
  const [compareIds, setCompareIds] = useState<string[]>(copy.products.slice(0, 2).map((product) => product.id));
  const [cartProductId, setCartProductId] = useState<string | null>(null);
  const visibleProducts =
    category === 'all' ? copy.products : copy.products.filter((product) => product.category === category);
  const comparedProducts = compareIds
    .map((id) => copy.products.find((product) => product.id === id))
    .filter((product): product is ShopProduct => Boolean(product));
  const cartProduct = copy.products.find((product) => product.id === cartProductId);
  const priceFormatter = new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : 'en-GB', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  });

  const toggleCompare = (productId: string) => {
    setCompareIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      return current.length < 2 ? [...current, productId] : [current[1], productId];
    });
  };

  return (
    <article
      className="matrix-preview matrix-preview--shop"
      aria-live="polite"
      data-module="eshop-offers"
      data-style={variantId}
      data-layout={preset.design.layout}
      data-cart-state={cartProduct ? 'selected' : 'empty'}
    >
      <header className="shop-demo__intro">
        <div>
          <p className="shop-demo__eyebrow">{copy.eyebrow}</p>
          <h3>{copy.title}</h3>
          <p className="shop-demo__lead">{copy.lead}</p>
        </div>
        <span className="shop-demo__inventory">{copy.inventory}</span>
      </header>

      <div className="shop-demo__filters" role="group" aria-label={copy.filterLabel}>
        {copy.categories.map((item) => (
          <button
            key={item.id}
            type="button"
            className={category === item.id ? 'is-active' : undefined}
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="shop-products" aria-label={copy.inventory}>
        {visibleProducts.map((product) => {
          const isCompared = compareIds.includes(product.id);
          const isInCart = cartProductId === product.id;

          return (
            <section className="shop-product" data-product={product.id} key={product.id}>
              <div className={`shop-product__visual shop-product__visual--${product.tone}`} aria-hidden="true">
                <span className="shop-product__case"></span>
                <span className="shop-product__signal"></span>
              </div>
              <div className="shop-product__body">
                <p className="shop-product__badge">{product.badge}</p>
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <strong className="shop-product__price">{priceFormatter.format(product.price)}</strong>
                <ul>
                  {product.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
                <small>{product.delivery}</small>
              </div>
              <div className="shop-product__actions">
                <button
                  type="button"
                  className="shop-action shop-action--primary"
                  aria-pressed={isInCart}
                  onClick={() => setCartProductId(product.id)}
                >
                  {isInCart ? copy.added : copy.add}
                </button>
                <button
                  type="button"
                  className="shop-action"
                  aria-pressed={isCompared}
                  onClick={() => toggleCompare(product.id)}
                >
                  {isCompared ? copy.comparing : copy.compare}
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <section className="shop-compare" aria-labelledby="shop-compare-title">
        <div className="shop-compare__heading">
          <h4 id="shop-compare-title">{copy.compareTitle}</h4>
          <p>{copy.compareLead}</p>
        </div>
        <div className="shop-compare__items">
          {comparedProducts.map((product) => (
            <div key={product.id}>
              <span>{product.name}</span>
              <strong>{priceFormatter.format(product.price)}</strong>
              <small>{product.specs.join(' / ')}</small>
            </div>
          ))}
        </div>
      </section>

      <aside className="shop-cart" aria-live="polite">
        <p className="shop-cart__label">{copy.cartTitle}</p>
        {cartProduct ? (
          <>
            <span>{copy.cartLine}</span>
            <h4>{cartProduct.name}</h4>
            <strong>{priceFormatter.format(cartProduct.price)}</strong>
            <button type="button" className="shop-cart__remove" onClick={() => setCartProductId(null)}>
              {copy.remove}
            </button>
            <a href="#terminal">{copy.cartCta}</a>
          </>
        ) : (
          <p className="shop-cart__empty">{copy.cartEmpty}</p>
        )}
        <small>{copy.disclaimer}</small>
      </aside>
    </article>
  );
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

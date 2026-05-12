export default function SeoAuditPreview() {
  return (
    <div className="mini-site mini-site--seo" data-demo-preview="seo-audit">
      <header className="mini-site__header">
        <p>SEO_AUDIT_REPORT_V1</p>
        <h3>Metadata repair, structured data, and measurable checks.</h3>
      </header>
      <div className="mini-compare">
        <section>
          <strong>BASELINE</strong>
          <dl>
            <div>
              <dt>Title</dt>
              <dd>Generic home label</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>Missing</dd>
            </div>
            <div>
              <dt>H1</dt>
              <dd>Duplicated</dd>
            </div>
            <div>
              <dt>SEO score</dt>
              <dd>64/100</dd>
            </div>
          </dl>
        </section>
        <section>
          <strong>OPTIMIZED</strong>
          <dl>
            <div>
              <dt>Title</dt>
              <dd>Offer-led search title</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>155 chars</dd>
            </div>
            <div>
              <dt>Schema</dt>
              <dd>Service JSON-LD</dd>
            </div>
            <div>
              <dt>SEO score</dt>
              <dd>100/100</dd>
            </div>
          </dl>
        </section>
      </div>
      <ul className="mini-checks">
        <li>canonical.check: OK</li>
        <li>sitemap.xml: OK</li>
        <li>og:image: OK</li>
        <li>robots.txt: OK</li>
      </ul>
    </div>
  );
}

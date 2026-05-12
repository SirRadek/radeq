export default function DocumentConversionPreview() {
  return (
    <div className="mini-site mini-site--conversion" data-demo-preview="document-conversion">
      <header className="mini-site__header">
        <p>DOC_CONVERSION_V1</p>
        <h3>Messy source material turned into a clean publishable output.</h3>
      </header>
      <div className="mini-conversion">
        <section>
          <strong>Source</strong>
          <p>Mixed headings, repeated notes, and inconsistent fields.</p>
        </section>
        <section>
          <strong>Output</strong>
          <p>Structured page sections, table rows, and a final review checklist.</p>
        </section>
      </div>
      <ul className="mini-checks">
        <li>headings.normalized: OK</li>
        <li>fields.mapped: OK</li>
        <li>review.ready: OK</li>
      </ul>
    </div>
  );
}

export default function MaintenancePreview() {
  return (
    <div className="mini-site mini-site--maintenance" data-demo-preview="maintenance">
      <header className="mini-site__header">
        <p>CARE_QUEUE_V1</p>
        <h3>Small fixes, health checks, and a readable handoff note.</h3>
      </header>
      <div className="mini-status-grid">
        <article>
          <strong>Patch queue</strong>
          <p>3 small fixes grouped into one verified release.</p>
        </article>
        <article>
          <strong>Health check</strong>
          <p>Forms, speed, backups, and basic security reviewed.</p>
        </article>
      </div>
      <ul className="mini-checks">
        <li>content.update: shipped</li>
        <li>form.submit: verified</li>
        <li>backup.snapshot: fresh</li>
      </ul>
    </div>
  );
}

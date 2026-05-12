export default function WorkflowPrototypePreview() {
  return (
    <div className="mini-site mini-site--workflow" data-demo-preview="workflow-prototype">
      <header className="mini-site__header">
        <p>WORKFLOW_PIPELINE_V1</p>
        <h3>Private brief converted into a safe execution packet.</h3>
      </header>
      <ol className="mini-pipeline">
        <li>
          <span>01</span>
          <strong>Brief intake</strong>
          <small>Scope, risk, and public-safe material separated.</small>
        </li>
        <li>
          <span>02</span>
          <strong>Plan build</strong>
          <small>Tasks, acceptance checks, and owner boundaries defined.</small>
        </li>
        <li>
          <span>03</span>
          <strong>Verification</strong>
          <small>Tests and screenshots attached to the handoff.</small>
        </li>
        <li>
          <span>04</span>
          <strong>Delivery</strong>
          <small>Readable output without private source exposure.</small>
        </li>
      </ol>
      <div className="mini-log" aria-label="Workflow log">
        <p>[09:12] brief.sanitized = true</p>
        <p>[09:14] prompt_pack.generated = true</p>
        <p>[09:19] checks.passed = 8</p>
      </div>
    </div>
  );
}

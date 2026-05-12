export default function AiAssistantPreview() {
  return (
    <div className="mini-site mini-site--assistant" data-demo-preview="ai-assistant">
      <header className="mini-site__header">
        <p>STATIC_ASSISTANT_V1</p>
        <h3>Canned request triage with visible guardrails and no live model call.</h3>
      </header>
      <div className="mini-chat" aria-label="Assistant conversation">
        <p>
          <span>Visitor</span>
          Need a site that explains services and collects qualified requests.
        </p>
        <p>
          <span>Assistant</span>
          I can classify that as a service landing page with a short intake flow.
        </p>
        <p>
          <span>Guardrail</span>
          No private documents are requested in the public chat.
        </p>
      </div>
      <div className="mini-log">
        <p>intent = lead_qualification</p>
        <p>handoff.ready = true</p>
      </div>
    </div>
  );
}

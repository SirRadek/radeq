import { describe, expect, it } from 'vitest';
import { chatbotGuide } from '../src/data/chatbotGuide';

describe('chatbot guide', () => {
  it('is a local rule tree with one root and valid choice targets', () => {
    expect(chatbotGuide.rootId).toBe('start');
    expect(chatbotGuide.disclaimer.toLowerCase()).toContain('statický');

    const nodeIds = new Set(chatbotGuide.nodes.map((node) => node.id));
    expect(nodeIds.has(chatbotGuide.rootId)).toBe(true);

    for (const node of chatbotGuide.nodes) {
      expect(node.title.length).toBeGreaterThan(10);
      expect(node.body.length).toBeGreaterThan(50);
      for (const choice of node.choices) {
        expect(nodeIds.has(choice.nextId)).toBe(true);
      }
    }
  });

  it('has terminal recommendations with explicit human handoff', () => {
    const terminalNodes = chatbotGuide.nodes.filter((node) => node.result);

    expect(terminalNodes.length).toBeGreaterThanOrEqual(3);
    for (const node of terminalNodes) {
      expect(node.choices).toHaveLength(0);
      expect(node.result?.summary).toContain('Doporučený další krok');
      expect(node.result?.handoff).toContain('člověkem');
    }
  });

  it('does not introduce model, network, storage, or sensitive-data claims', () => {
    const text = JSON.stringify(chatbotGuide).toLowerCase();

    for (const forbidden of ['llm', 'rag', 'model api', 'fetch', 'localstorage', 'websocket', 'api klíč']) {
      expect(text).not.toContain(forbidden);
    }

    expect(text).toContain('připraven');
    expect(text).toContain('bez klientských dat');
    expect(text).toContain('ochrana dat');
  });
});

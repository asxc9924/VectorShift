// llmNode.js
import { useState } from 'react';
import { BaseNode, NodeField, NodeSelect, NodeInfo, NodeBadge } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');

  return (
    <BaseNode
      id={id}
      title="LLM"
      icon="✦"
      color="purple"
      inputs={[
        { id: 'system', label: 'system' },
        { id: 'prompt', label: 'prompt' },
      ]}
      outputs={[{ id: 'response', label: 'response' }]}
    >
      <NodeField label="Model">
        <NodeSelect value={model} onChange={e => setModel(e.target.value)}>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="claude-sonnet-4-6">Claude Sonnet</option>
          <option value="claude-haiku">Claude Haiku</option>
          <option value="gemini-pro">Gemini Pro</option>
        </NodeSelect>
      </NodeField>
      <NodeInfo>Accepts a system prompt and user prompt, returns a completion.</NodeInfo>
    </BaseNode>
  );
};

// inputNode.js
import { useState } from 'react';
import { BaseNode, NodeField, NodeInput, NodeSelect } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  return (
    <BaseNode
      id={id}
      title="Input"
      icon="⬤"
      color="green"
      outputs={[{ id: 'value', label: 'value' }]}
    >
      <NodeField label="Name">
        <NodeInput value={name} onChange={e => setName(e.target.value)} />
      </NodeField>
      <NodeField label="Type">
        <NodeSelect value={inputType} onChange={e => setInputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </NodeSelect>
      </NodeField>
    </BaseNode>
  );
};

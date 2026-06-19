// outputNode.js
import { useState } from 'react';
import { BaseNode, NodeField, NodeInput, NodeSelect } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode
      id={id}
      title="Output"
      icon="◉"
      color="rose"
      inputs={[{ id: 'value', label: 'value' }]}
    >
      <NodeField label="Name">
        <NodeInput value={name} onChange={e => setName(e.target.value)} />
      </NodeField>
      <NodeField label="Type">
        <NodeSelect value={outputType} onChange={e => setOutputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </NodeSelect>
      </NodeField>
    </BaseNode>
  );
};

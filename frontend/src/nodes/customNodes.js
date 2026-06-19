// customNodes.js
// Five new nodes built with the BaseNode abstraction.
// Each is defined in ~10-20 lines of meaningful logic — no boilerplate.

import { useState } from 'react';
import { BaseNode, NodeField, NodeInput, NodeSelect, NodeTextarea, NodeInfo, NodeBadge } from './BaseNode';

// ─── 1. API Request Node ────────────────────────────────────────────────────
export const ApiNode = ({ id, data }) => {
  const [url, setUrl]       = useState(data?.url    || 'https://api.example.com/v1');
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode id={id} title="API Request" icon="⇌" color="teal"
      inputs={[{ id: 'body', label: 'body' }, { id: 'headers', label: 'headers' }]}
      outputs={[{ id: 'response', label: 'response' }, { id: 'status', label: 'status' }]}
    >
      <NodeField label="Method">
        <NodeSelect value={method} onChange={e => setMethod(e.target.value)}>
          {['GET','POST','PUT','PATCH','DELETE'].map(m => <option key={m}>{m}</option>)}
        </NodeSelect>
      </NodeField>
      <NodeField label="URL">
        <NodeInput value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
      </NodeField>
    </BaseNode>
  );
};

// ─── 2. Conditional / If-Else Node ──────────────────────────────────────────
export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'value > 0');

  return (
    <BaseNode id={id} title="Condition" icon="⑂" color="indigo"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'true', label: 'true' }, { id: 'false', label: 'false' }]}
    >
      <NodeField label="If Expression">
        <NodeInput
          value={condition}
          onChange={e => setCondition(e.target.value)}
          placeholder="e.g. value.length > 0"
          style={{ fontFamily: 'monospace' }}
        />
      </NodeField>
      <NodeInfo>Routes to <b style={{color:'#a5b4fc'}}>true</b> or <b style={{color:'#a5b4fc'}}>false</b> based on expression.</NodeInfo>
    </BaseNode>
  );
};

// ─── 3. Data Transform / Map Node ───────────────────────────────────────────
export const TransformNode = ({ id, data }) => {
  const [script, setScript] = useState(data?.script || 'return input.map(x => x.trim())');

  return (
    <BaseNode id={id} title="Transform" icon="⇉" color="blue"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
    >
      <NodeField label="JS Expression">
        <NodeTextarea
          value={script}
          onChange={e => setScript(e.target.value)}
          rows={3}
          placeholder="return input.map(x => ...)"
          style={{ fontFamily: "'Fira Code', monospace" }}
        />
      </NodeField>
    </BaseNode>
  );
};

// ─── 4. Merge / Combine Node ─────────────────────────────────────────────────
export const MergeNode = ({ id, data }) => {
  const [strategy, setStrategy] = useState(data?.strategy || 'concat');

  return (
    <BaseNode id={id} title="Merge" icon="⊕" color="orange"
      inputs={[
        { id: 'a', label: 'stream A' },
        { id: 'b', label: 'stream B' },
        { id: 'c', label: 'stream C' },
      ]}
      outputs={[{ id: 'merged', label: 'merged' }]}
    >
      <NodeField label="Strategy">
        <NodeSelect value={strategy} onChange={e => setStrategy(e.target.value)}>
          <option value="concat">Concatenate</option>
          <option value="zip">Zip (pair-wise)</option>
          <option value="merge">Merge (async)</option>
          <option value="race">Race (first wins)</option>
        </NodeSelect>
      </NodeField>
      <NodeInfo>Combines up to three input streams into one.</NodeInfo>
    </BaseNode>
  );
};

// ─── 5. Note / Comment Node ──────────────────────────────────────────────────
export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || 'Add a note about this pipeline section...');
  const [tag, setTag]   = useState(data?.tag   || 'info');

  const tagColors = { info: 'blue', warn: 'amber', error: 'rose', ok: 'green' };

  return (
    <BaseNode id={id} title="Note" icon="✎" color={tagColors[tag] || 'gray'}
      inputs={[]} outputs={[]}
    >
      <NodeField label="Tag">
        <NodeSelect value={tag} onChange={e => setTag(e.target.value)}>
          <option value="info">ℹ Info</option>
          <option value="warn">⚠ Warning</option>
          <option value="error">✕ Error</option>
          <option value="ok">✓ OK</option>
        </NodeSelect>
      </NodeField>
      <NodeField>
        <NodeTextarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          placeholder="Describe this section..."
        />
      </NodeField>
    </BaseNode>
  );
};

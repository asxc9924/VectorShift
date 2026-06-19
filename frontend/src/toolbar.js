// toolbar.js
import { DraggableNode } from './draggableNode';

const nodeGroups = [
  {
    label: 'Core',
    nodes: [
      { type: 'customInput',  label: 'Input',     icon: '⬤',  color: '#22c55e' },
      { type: 'customOutput', label: 'Output',    icon: '◉',  color: '#f43f5e' },
      { type: 'llm',          label: 'LLM',       icon: '✦',  color: '#8b5cf6' },
      { type: 'text',         label: 'Text',      icon: '✎',  color: '#f59e0b' },
    ],
  },
  {
    label: 'Logic',
    nodes: [
      { type: 'conditional',  label: 'Condition', icon: '⑂',  color: '#6366f1' },
      { type: 'merge',        label: 'Merge',     icon: '⊕',  color: '#f97316' },
      { type: 'transform',    label: 'Transform', icon: '⇉',  color: '#3b82f6' },
    ],
  },
  {
    label: 'I/O',
    nodes: [
      { type: 'api',          label: 'API',       icon: '⇌',  color: '#14b8a6' },
    ],
  },
  {
    label: 'Util',
    nodes: [
      { type: 'note',         label: 'Note',      icon: '✎',  color: '#64748b' },
    ],
  },
];

export const PipelineToolbar = () => (
  <div style={{
    background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
    borderBottom: '1px solid #1e293b',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    boxShadow: '0 2px 16px #00000044',
  }}>
    {/* Brand */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 12, flexShrink: 0 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, boxShadow: '0 0 12px #3b82f644',
      }}>⬡</div>
      <div>
        <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 14, letterSpacing: '0.02em', fontFamily: 'Inter, sans-serif' }}>
          VectorShift
        </div>
        <div style={{ color: '#475569', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Pipeline Builder
        </div>
      </div>
    </div>

    <div style={{ width: 1, height: 40, background: '#1e293b' }} />

    {/* Node groups */}
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flex: 1, flexWrap: 'wrap' }}>
      {nodeGroups.map(group => (
        <div key={group.label}>
          <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
            {group.label}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {group.nodes.map(n => (
              <DraggableNode key={n.type} type={n.type} label={n.label} icon={n.icon} color={n.color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

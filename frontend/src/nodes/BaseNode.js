// BaseNode.js
// Core abstraction for all pipeline nodes.
// Usage: pass title, icon, color, inputs[], outputs[], and children for body content.

import { Handle, Position } from 'reactflow';

const NODE_COLORS = {
  blue:   { bg: '#1e3a5f', border: '#3b82f6', accent: '#60a5fa', tag: '#1d4ed8' },
  purple: { bg: '#2e1b4e', border: '#8b5cf6', accent: '#a78bfa', tag: '#6d28d9' },
  green:  { bg: '#14332a', border: '#22c55e', accent: '#4ade80', tag: '#15803d' },
  orange: { bg: '#3b1f0a', border: '#f97316', accent: '#fb923c', tag: '#c2410c' },
  rose:   { bg: '#3b0f1e', border: '#f43f5e', accent: '#fb7185', tag: '#be123c' },
  teal:   { bg: '#0d2f30', border: '#14b8a6', accent: '#2dd4bf', tag: '#0f766e' },
  amber:  { bg: '#2d1f00', border: '#f59e0b', accent: '#fbbf24', tag: '#b45309' },
  indigo: { bg: '#1e1b4b', border: '#6366f1', accent: '#818cf8', tag: '#4338ca' },
  gray:   { bg: '#1c2231', border: '#64748b', accent: '#94a3b8', tag: '#475569' },
};

const styles = {
  node: (color) => ({
    minWidth: 220,
    background: `linear-gradient(145deg, ${color.bg} 0%, #0f172a 100%)`,
    border: `1.5px solid ${color.border}`,
    borderRadius: 12,
    boxShadow: `0 0 0 1px ${color.border}22, 0 8px 32px #00000066`,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    overflow: 'visible',
    position: 'relative',
  }),
  header: (color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px 8px',
    borderBottom: `1px solid ${color.border}33`,
  }),
  iconWrap: (color) => ({
    width: 28,
    height: 28,
    borderRadius: 6,
    background: color.tag,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0,
  }),
  title: {
    fontSize: 12,
    fontWeight: 700,
    color: '#e2e8f0',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  body: {
    padding: '10px 14px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  input: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 6,
    color: '#e2e8f0',
    fontSize: 12,
    padding: '5px 8px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  select: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 6,
    color: '#e2e8f0',
    fontSize: 12,
    padding: '5px 8px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  textarea: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 6,
    color: '#e2e8f0',
    fontSize: 12,
    padding: '5px 8px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    fontFamily: "'Fira Code', monospace",
    transition: 'border-color 0.15s',
  },
  infoText: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 1.5,
  },
  badge: (color) => ({
    display: 'inline-block',
    background: color.tag + '33',
    border: `1px solid ${color.border}66`,
    borderRadius: 4,
    color: color.accent,
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 6px',
    letterSpacing: '0.04em',
  }),
};

// Handle label overlay
const HandleLabel = ({ label, position }) => (
  <span style={{
    position: 'absolute',
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    ...(position === Position.Left
      ? { left: 12, transform: 'translateY(-50%)' }
      : { right: 12, transform: 'translateY(-50%)' }),
  }}>
    {label}
  </span>
);

// Evenly distribute handles along the node height
const distributeHandles = (count, totalHeight = 100) => {
  if (count === 1) return ['50%'];
  return Array.from({ length: count }, (_, i) =>
    `${((i + 1) / (count + 1)) * 100}%`
  );
};

/**
 * BaseNode — universal node shell.
 *
 * @param {string}   id           – ReactFlow node id
 * @param {string}   title        – Node title shown in header
 * @param {string}   icon         – Emoji or symbol for the header icon
 * @param {string}   color        – One of the NODE_COLORS keys
 * @param {Array}    inputs       – [{ id, label }] for left-side target handles
 * @param {Array}    outputs      – [{ id, label }] for right-side source handles
 * @param {ReactNode} children    – Body content (fields, text, etc.)
 */
export const BaseNode = ({ id, title, icon = '⬡', color = 'gray', inputs = [], outputs = [], children }) => {
  const c = NODE_COLORS[color] || NODE_COLORS.gray;
  const inputPositions  = distributeHandles(inputs.length);
  const outputPositions = distributeHandles(outputs.length);

  return (
    <div style={styles.node(c)} className="base-node">
      {/* Input handles */}
      {inputs.map((input, i) => (
        <div key={input.id} style={{ position: 'absolute', left: 0, top: inputPositions[i], transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${input.id}`}
            style={{ position: 'relative', left: 0, top: 0, transform: 'none', background: c.accent, border: `2px solid ${c.border}`, width: 10, height: 10, borderRadius: '50%', flexShrink: 0 }}
          />
          {input.label && (
            <span style={{ marginLeft: 6, fontSize: 9, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', userSelect: 'none' }}>
              {input.label}
            </span>
          )}
        </div>
      ))}

      {/* Output handles */}
      {outputs.map((output, i) => (
        <div key={output.id} style={{ position: 'absolute', right: 0, top: outputPositions[i], transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            style={{ position: 'relative', right: 0, top: 0, transform: 'none', background: c.accent, border: `2px solid ${c.border}`, width: 10, height: 10, borderRadius: '50%', flexShrink: 0 }}
          />
          {output.label && (
            <span style={{ marginRight: 6, fontSize: 9, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', userSelect: 'none' }}>
              {output.label}
            </span>
          )}
        </div>
      ))}

      {/* Header */}
      <div style={styles.header(c)}>
        <div style={styles.iconWrap(c)}>{icon}</div>
        <span style={styles.title}>{title}</span>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {children}
      </div>
    </div>
  );
};

// ─── Field helpers so node authors don't have to write inline styles ───────────

export const NodeField = ({ label, children }) => (
  <div style={styles.fieldRow}>
    {label && <span style={styles.label}>{label}</span>}
    {children}
  </div>
);

export const NodeInput = (props) => (
  <input {...props} style={{ ...styles.input, ...(props.style || {}) }} />
);

export const NodeSelect = ({ children, ...props }) => (
  <select {...props} style={{ ...styles.select, ...(props.style || {}) }}>
    {children}
  </select>
);

export const NodeTextarea = (props) => (
  <textarea {...props} style={{ ...styles.textarea, ...(props.style || {}) }} />
);

export const NodeInfo = ({ children }) => (
  <span style={styles.infoText}>{children}</span>
);

export const NodeBadge = ({ color = 'gray', children }) => {
  const c = NODE_COLORS[color] || NODE_COLORS.gray;
  return <span style={styles.badge(c)}>{children}</span>;
};

export { NODE_COLORS };

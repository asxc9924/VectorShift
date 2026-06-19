// textNode.js
// Part 3: Dynamic resizing + variable handle detection from {{var}} syntax
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { NODE_COLORS } from './BaseNode';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const vars = new Set();
  let match;
  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((match = re.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return [...vars];
};

const c = NODE_COLORS.amber;

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const [dims, setDims] = useState({ width: 240, height: 'auto' });

  // Extract {{variables}} whenever text changes
  useEffect(() => {
    setVariables(extractVariables(text));
  }, [text]);

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollH + 'px';
      // Width: grow for long lines (max 420, min 240)
      const lines = text.split('\n');
      const longestLine = Math.max(...lines.map(l => l.length));
      const newWidth = Math.min(420, Math.max(240, longestLine * 7.5 + 60));
      setDims({ width: newWidth });
    }
  }, [text]);

  const varPositions = variables.map((_, i) =>
    variables.length === 1 ? 50 : ((i + 1) / (variables.length + 1)) * 100
  );

  return (
    <div style={{
      minWidth: dims.width,
      background: `linear-gradient(145deg, ${c.bg} 0%, #0f172a 100%)`,
      border: `1.5px solid ${c.border}`,
      borderRadius: 12,
      boxShadow: `0 0 0 1px ${c.border}22, 0 8px 32px #00000066`,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative',
      transition: 'min-width 0.15s ease',
    }}>
      {/* Dynamic input handles for each {{variable}} */}
      {variables.map((varName, i) => (
        <div key={varName} style={{
          position: 'absolute',
          left: 0,
          top: `${varPositions[i]}%`,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{
              position: 'relative',
              left: 0, top: 0,
              transform: 'none',
              background: c.accent,
              border: `2px solid ${c.border}`,
              width: 10, height: 10,
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <span style={{
            marginLeft: 6,
            fontSize: 9,
            color: '#fbbf24',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}>
            {varName}
          </span>
        </div>
      ))}

      {/* Output handle */}
      <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}>
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-output`}
          style={{
            position: 'relative', right: 0, top: 0, transform: 'none',
            background: c.accent, border: `2px solid ${c.border}`,
            width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
          }}
        />
        <span style={{ marginRight: 6, fontSize: 9, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', userSelect: 'none' }}>
          output
        </span>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px 8px',
        borderBottom: `1px solid ${c.border}33`,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: c.tag,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>✎</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Text
        </span>
        {variables.length > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 9,
            color: c.accent,
            fontWeight: 600,
            background: c.tag + '44',
            border: `1px solid ${c.border}66`,
            borderRadius: 4,
            padding: '2px 6px',
          }}>
            {variables.length} var{variables.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 14px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Content
        </span>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={1}
          style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: 6,
            color: '#e2e8f0',
            fontSize: 12,
            padding: '6px 8px',
            width: '100%',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'none',
            fontFamily: "'Fira Code', 'Courier New', monospace",
            lineHeight: 1.6,
            overflow: 'hidden',
            transition: 'height 0.1s ease, border-color 0.15s',
          }}
          placeholder="Enter text… use {{variable}} to create inputs"
          onFocus={e => e.target.style.borderColor = c.border}
          onBlur={e => e.target.style.borderColor = '#334155'}
        />
        {variables.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
            {variables.map(v => (
              <span key={v} style={{
                fontSize: 9, fontWeight: 700, color: c.accent,
                background: c.tag + '33',
                border: `1px solid ${c.border}55`,
                borderRadius: 4, padding: '1px 5px',
                fontFamily: 'monospace',
              }}>
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

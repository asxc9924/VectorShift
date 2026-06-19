// submit.js  – Part 4: sends nodes/edges to /pipelines/parse and shows result alert
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (s) => ({ nodes: s.nodes, edges: s.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://your-backend.railway.app/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      const dagMsg = data.is_dag
        ? '✅ This pipeline is a valid DAG.'
        : '⚠️ This pipeline contains cycles — it is NOT a DAG.';
      alert(
        `Pipeline Analysis\n\n` +
        `Nodes: ${data.num_nodes}\n` +
        `Edges: ${data.num_edges}\n\n` +
        dagMsg
      );
    } catch (err) {
      alert(`Error connecting to backend:\n${err.message}\n\nMake sure the FastAPI server is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)',
      borderTop: '1px solid #1e293b',
    }}>
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: loading
            ? '#1e293b'
            : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          color: loading ? '#64748b' : '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 32px',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
          boxShadow: loading ? 'none' : '0 0 20px #3b82f666',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 30px #6366f188'; }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 20px #3b82f666'; }}
      >
        {loading ? '⟳ Analyzing…' : '⬡ Run Pipeline'}
      </button>
      <span style={{
        marginLeft: 16, fontSize: 11, color: '#334155',
        fontFamily: 'Inter, sans-serif',
      }}>
        {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

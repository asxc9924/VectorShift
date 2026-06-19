// ui.js
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode }       from './nodes/inputNode';
import { LLMNode }         from './nodes/llmNode';
import { OutputNode }      from './nodes/outputNode';
import { TextNode }        from './nodes/textNode';
import { ApiNode, ConditionalNode, TransformNode, MergeNode, NoteNode } from './nodes/customNodes';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  api:          ApiNode,
  conditional:  ConditionalNode,
  transform:    TransformNode,
  merge:        MergeNode,
  note:         NoteNode,
};

const selector = (state) => ({
  nodes:         state.nodes,
  edges:         state.edges,
  getNodeID:     state.getNodeID,
  addNode:       state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect:     state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const raw = event?.dataTransfer?.getData('application/reactflow');
    if (!raw) return;
    const { nodeType: type } = JSON.parse(raw);
    if (!type) return;

    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
    const nodeID  = getNodeID(type);
    addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
  }, [reactFlowInstance]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100vw', height: 'calc(100vh - 128px)', background: '#080e1a' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 3' }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 1.5 },
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#1e293b" gap={gridSize} variant="dots" size={1.5} />
        <Controls
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 10,
            boxShadow: '0 4px 16px #00000044',
          }}
        />
        <MiniMap
          style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10 }}
          nodeColor={() => '#3b82f6'}
          maskColor="#0f172a99"
        />
      </ReactFlow>
    </div>
  );
};

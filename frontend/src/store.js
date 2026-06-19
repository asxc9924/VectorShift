// store.js
import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  getNodeID: (type) => {
    const ids = { ...get().nodeIDs };
    ids[type] = (ids[type] || 0) + 1;
    set({ nodeIDs: ids });
    return `${type}-${ids[type]}`;
  },

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => set({
    edges: addEdge({
      ...connection,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', height: 16, width: 16 },
    }, get().edges),
  }),

  updateNodeField: (nodeId, fieldName, fieldValue) => set({
    nodes: get().nodes.map(node =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
        : node
    ),
  }),
}));

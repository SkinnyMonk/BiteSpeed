import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TextNode from "./nodes/TextNode";
import NodesPanel from "./NodesPanel";
import SettingsPanel from "./SettingsPanel";

const initialNodes = [];

const initialEdges = [];

// Main NodeEditor component - handles the flow builder functionality
function NodeEditor({ onFlowChange, reactFlowRef, onReactFlowInstanceChange }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null); // Track selected node for settings panel
  const [selectedEdges, setSelectedEdges] = useState([]); // Track selected edges
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const idRef = useRef(1); // Start from 1 since we have no initial nodes
  const getId = useCallback(() => `node_${idRef.current++}`, []);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nodesSnapshot) => {
        const newNodes = applyNodeChanges(changes, nodesSnapshot);

        // Handle node selection changes - process all selection changes
        changes.forEach((change) => {
          if (change.type === "select") {
            if (change.selected) {
              const node = newNodes.find((n) => n.id === change.id);
              if (node) {
                setSelectedNode(node);
              }
            } else {
              // Only clear selection if this was the currently selected node
              setSelectedNode((currentSelected) =>
                currentSelected && currentSelected.id === change.id
                  ? null
                  : currentSelected
              );
            }
          }
        });

        // Notify parent of flow changes
        if (onFlowChange) {
          onFlowChange({ nodes: newNodes, edges });
        }
        return newNodes;
      });
    },
    [edges, onFlowChange]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((edgesSnapshot) => {
        const newEdges = applyEdgeChanges(changes, edgesSnapshot);

        // Handle edge selection changes
        changes.forEach((change) => {
          if (change.type === "select") {
            if (change.selected) {
              setSelectedEdges((prev) => [...prev, change.id]);
            } else {
              setSelectedEdges((prev) => prev.filter((id) => id !== change.id));
            }
          }
        });

        // Notify parent of flow changes
        if (onFlowChange) {
          onFlowChange({ nodes, edges: newEdges });
        }
        return newEdges;
      });
    },
    [nodes, onFlowChange]
  );

  const onConnect = useCallback(
    (params) => {
      // BiteSpeed requirement: Source handle can only have one edge originating from it
      const existingEdge = edges.find((edge) => edge.source === params.source);

      if (existingEdge) {
        toast.error("A node can only have one outgoing connection");
        return;
      }

      // Create new edge with default (Bézier) type and arrow marker
      setEdges((edgesSnapshot) => {
        const newEdges = addEdge(
          {
            ...params,
            type: "default",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: "#9ca3af",
            },
            style: {
              strokeWidth: 1,
              stroke: "#9ca3af",
            },
          },
          edgesSnapshot
        );
        // Notify parent of flow changes
        if (onFlowChange) {
          onFlowChange({ nodes, edges: newEdges });
        }
        return newEdges;
      });
    },
    [edges, nodes, onFlowChange]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { message: "" }, // Start with empty message
        selected: true, // Auto-select the new node
      };

      setNodes((nds) => {
        // Deselect all existing nodes and add the new selected node
        const newNodes = nds
          .map((node) => ({ ...node, selected: false }))
          .concat(newNode);

        // Notify parent of flow changes
        if (onFlowChange) {
          onFlowChange({ nodes: newNodes, edges });
        }
        return newNodes;
      });

      // Auto-select the new node in the settings panel
      setSelectedNode(newNode);
    },
    [reactFlowInstance, getId, edges, onFlowChange]
  );

  // Handle node updates from settings panel
  const onUpdateNode = useCallback(
    (nodeId, newData) => {
      setNodes((nds) => {
        const newNodes = nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        );

        // Update selected node if it's the one being updated
        setSelectedNode((currentSelected) => {
          if (currentSelected && currentSelected.id === nodeId) {
            return newNodes.find((node) => node.id === nodeId);
          }
          return currentSelected;
        });

        // Notify parent of flow changes
        if (onFlowChange) {
          onFlowChange({ nodes: newNodes, edges });
        }
        return newNodes;
      });
    },
    [edges, onFlowChange]
  );

  // Handle keyboard shortcuts for deletion
  const onKeyDown = useCallback(
    (event) => {
      // Don't trigger deletion if user is typing in an input/textarea
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        // Delete selected edges
        if (selectedEdges.length > 0) {
          setEdges((edgesSnapshot) => {
            const newEdges = edgesSnapshot.filter(
              (edge) => !selectedEdges.includes(edge.id)
            );
            if (onFlowChange) {
              onFlowChange({ nodes, edges: newEdges });
            }
            return newEdges;
          });
          setSelectedEdges([]);
        }
        // Delete selected node (if no edges are selected)
        else if (selectedNode) {
          const nodeMessage = selectedNode.data.message?.trim();
          const displayName = nodeMessage
            ? `"${nodeMessage}"`
            : "(empty message)";

          const confirmDelete = window.confirm(
            `Delete node ${displayName}? This will also remove all connected edges.`
          );

          if (confirmDelete) {
            const nodeIdToDelete = selectedNode.id;

            // Clear selection first to avoid state issues
            setSelectedNode(null);

            // Remove the node and all connected edges in a single operation
            setNodes((nodesSnapshot) => {
              const newNodes = nodesSnapshot.filter(
                (node) => node.id !== nodeIdToDelete
              );

              setEdges((edgesSnapshot) => {
                const newEdges = edgesSnapshot.filter(
                  (edge) =>
                    edge.source !== nodeIdToDelete &&
                    edge.target !== nodeIdToDelete
                );

                // Notify parent of flow changes with both updates
                if (onFlowChange) {
                  onFlowChange({ nodes: newNodes, edges: newEdges });
                }

                return newEdges;
              });

              return newNodes;
            });
          }
        }
      }
    },
    [selectedEdges, selectedNode, nodes, onFlowChange]
  );

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Handle node deletion from settings panel
  const onDeleteNode = useCallback(
    (nodeId) => {
      // Clear selection first to avoid state issues
      setSelectedNode(null);

      // Remove the node and all connected edges
      setNodes((nodesSnapshot) => {
        const newNodes = nodesSnapshot.filter((node) => node.id !== nodeId);

        setEdges((edgesSnapshot) => {
          const newEdges = edgesSnapshot.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          );

          // Notify parent of flow changes with both updates
          if (onFlowChange) {
            onFlowChange({ nodes: newNodes, edges: newEdges });
          }

          return newEdges;
        });

        return newNodes;
      });
    },
    [onFlowChange]
  );

  // Define custom node types
  const nodeTypes = {
    textNode: TextNode,
  };

  // Default edge style for all edges
  const defaultEdgeOptions = {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 12,
      height: 12,
      color: "#9ca3af",
    },
    style: {
      strokeWidth: 1,
      stroke: "#9ca3af",
    },
  };

  return (
    <div className="flex h-full relative bg-gray-100 flex-col sm:flex-row">
      {/* Status Bar for edge deletion hints */}
      {selectedEdges.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-xs sm:text-sm flex items-center gap-2">
          <span>🗑️</span>
          <span className="hidden sm:inline">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs font-mono">
              Delete
            </kbd>{" "}
            to remove selected edge(s)
          </span>
          <span className="sm:hidden">Delete to remove edge</span>
        </div>
      )}

      <div ref={reactFlowWrapper} className="flex-1 min-w-0">
        <ReactFlow
          ref={reactFlowRef}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={(instance) => {
            setReactFlowInstance(instance);
            if (onReactFlowInstanceChange) {
              onReactFlowInstanceChange(instance);
            }
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={() => setSelectedNode(null)}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          className="bg-gray-100"
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          panOnDrag={true}
          panOnScroll={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          selectNodesOnDrag={false}
        >
          <Background color="#d1d5db" gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Conditionally render either Settings Panel or Nodes Panel */}
      <div className="order-first sm:order-last w-full sm:w-64 flex-shrink-0">
        {selectedNode ? (
          <SettingsPanel
            selectedNode={selectedNode}
            onUpdateNode={onUpdateNode}
            setSelectedNode={setSelectedNode}
            onDeleteNode={onDeleteNode}
          />
        ) : (
          <NodesPanel />
        )}
      </div>
    </div>
  );
}

export default NodeEditor;

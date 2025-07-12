import React from "react";

const SaveButton = ({ nodes, edges, onSave }) => {
  const validateFlow = () => {
    // Check if there are more than one nodes
    if (nodes.length <= 1) {
      return { isValid: true, error: null };
    }

    // BiteSpeed requirement: Check that there's exactly one start node (no incoming edges)
    // All other nodes should have at least one incoming edge to be reachable
    const nodesWithIncomingEdges = new Set(edges.map((edge) => edge.target));
    const startNodes = nodes.filter(
      (node) => !nodesWithIncomingEdges.has(node.id)
    );

    // There should be exactly one start node
    if (startNodes.length === 0) {
      return {
        isValid: false,
        error:
          "Cannot save flow: No start node found (all nodes have incoming connections)",
      };
    }

    if (startNodes.length > 1) {
      return {
        isValid: false,
        error:
          "Cannot save flow: More than one start node found (nodes without incoming connections)",
      };
    }

    return { isValid: true, error: null };
  };

  const handleSave = () => {
    const validation = validateFlow();

    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    // If validation passes, save the flow
    onSave({ nodes, edges });
    alert("Flow saved successfully!");
  };

  return (
    <button
      onClick={handleSave}
      className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
    >
      Save Changes
    </button>
  );
};

export default SaveButton;

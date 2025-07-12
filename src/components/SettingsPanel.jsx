import React, { useState, useEffect } from "react";

const SettingsPanel = ({
  selectedNode,
  onUpdateNode,
  setSelectedNode,
  onDeleteNode,
}) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedNode) {
      setMessage(selectedNode.data.message || "");
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { message });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
      setSelectedNode(null); // Only clear selection on Enter
    }
  };

  if (!selectedNode) return null;

  return (
    <div className="w-64 bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">Message</h3>
        <button
          onClick={() => {
            const nodeMessage = selectedNode.data.message?.trim();
            const displayName = nodeMessage
              ? `"${nodeMessage}"`
              : "(empty message)";

            if (window.confirm(`Delete node ${displayName}?`)) {
              // Call a delete function that will be passed from parent
              if (onDeleteNode) {
                onDeleteNode(selectedNode.id);
              }
            }
          }}
          className="p-1 hover:bg-red-50 rounded transition-colors group"
          title="Delete node"
        >
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Text
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your message..."
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to save and close
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

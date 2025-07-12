import React from "react";

// Node types configuration - easily extensible for future node types
const nodeTypes = [
  {
    id: "textNode",
    label: "Message",
    icon: "💬",
    description: "Send a text message",
    iconBg: "bg-blue-500",
    borderColor: "border-blue-300",
    hoverBorderColor: "hover:border-blue-400",
    textColor: "text-blue-600",
  },
  // Future node types can be added here:
  // {
  //   id: 'inputNode',
  //   label: 'Input',
  //   icon: '⌨️',
  //   description: 'Collect user input',
  //   iconBg: 'bg-green-500',
  //   borderColor: 'border-green-300',
  //   hoverBorderColor: 'hover:border-green-400',
  //   textColor: 'text-green-600'
  // },
  // {
  //   id: 'conditionNode',
  //   label: 'Condition',
  //   icon: '🔀',
  //   description: 'Add conditional logic',
  //   iconBg: 'bg-purple-500',
  //   borderColor: 'border-purple-300',
  //   hoverBorderColor: 'hover:border-purple-400',
  //   textColor: 'text-purple-600'
  // }
];

const NodesPanel = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Nodes Panel</h3>
        <p className="text-sm text-gray-600 mt-1">Drag nodes to the canvas</p>
      </div>

      {/* Node Types */}
      <div className="p-4 space-y-3">
        {nodeTypes.map((nodeType) => (
          <NodeTypeItem
            key={nodeType.id}
            nodeType={nodeType}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      {/* Instructions Section */}
      <div className="p-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          💡 Quick Tips
        </h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Click any node to edit in settings panel</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            <span>Use 🗑️ icon in settings to delete nodes</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <span>
              Click edge +{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                Delete
              </kbd>{" "}
              to remove
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 font-bold">•</span>
            <span>Drag from node handles to connect</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500 font-bold">•</span>
            <span>One outgoing connection per node</span>
          </div>
        </div>
      </div>

      {/* Future sections can be added here */}
      {/* 
      <div className="p-4 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-700 mb-3">Advanced</h4>
        // Advanced node types
      </div>
      */}
    </div>
  );
};

// Reusable component for individual node types
const NodeTypeItem = ({ nodeType, onDragStart }) => {
  const {
    id,
    label,
    icon,
    description,
    iconBg,
    borderColor,
    hoverBorderColor,
    textColor,
  } = nodeType;

  return (
    <div
      className={`flex flex-col items-center p-4 border-2 ${borderColor} rounded-lg cursor-grab ${hoverBorderColor} transition-colors bg-white shadow-sm hover:shadow-md`}
      draggable
      onDragStart={(event) => onDragStart(event, id)}
      title={description}
    >
      <div
        className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-2 shadow-sm`}
      >
        <span className="text-white text-lg">{icon}</span>
      </div>
      <span className={`text-sm font-medium ${textColor}`}>{label}</span>
    </div>
  );
};

export default NodesPanel;

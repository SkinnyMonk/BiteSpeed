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
];

const NodesPanel = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-full lg:w-64 bg-white border-t lg:border-t-0 lg:border-l h-screen border-gray-200 overflow-y-auto">
      {/* Panel Header */}
      <div className="p-3 lg:p-4 border-b border-gray-200">
        <h3 className="text-base lg:text-lg font-semibold text-gray-800">
          Nodes Panel
        </h3>
        <p className="text-xs lg:text-sm text-gray-600 mt-1">
          Drag nodes to the canvas
        </p>
      </div>

      {/* Node Types */}
      <div className="p-3 lg:p-4 space-y-2 lg:space-y-3 flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
        {nodeTypes.map((nodeType) => (
          <NodeTypeItem
            key={nodeType.id}
            nodeType={nodeType}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      {/* Instructions Section */}
      <div className="p-3 lg:p-4 border-t border-gray-200 hidden lg:block">
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
      className={`flex flex-col items-center p-3 lg:p-4 border-2 ${borderColor} rounded-lg cursor-grab ${hoverBorderColor} transition-colors bg-white shadow-sm hover:shadow-md min-w-[120px] lg:min-w-0`}
      draggable
      onDragStart={(event) => onDragStart(event, id)}
      title={description}
    >
      <div
        className={`w-10 h-10 lg:w-12 lg:h-12 ${iconBg} rounded-lg flex items-center justify-center mb-2 shadow-sm`}
      >
        <span className="text-white text-base lg:text-lg">{icon}</span>
      </div>
      <span className={`text-xs lg:text-sm font-medium ${textColor}`}>
        {label}
      </span>
    </div>
  );
};

export default NodesPanel;

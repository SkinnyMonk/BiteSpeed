import { Handle, Position } from "@xyflow/react";

function TextNode({ data, selected }) {
  return (
    <div className="relative">
      <div
        className={`rounded-lg min-w-[200px] max-w-[250px] shadow-lg border-2 overflow-hidden ${
          selected ? "border-blue-500" : "border-gray-300"
        }`}
      >
        {/* Header with icon and title */}
        <div className="bg-[#B2F0E7] px-4 py-2 flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">💬</div>
          <span className="text-sm font-medium text-gray-700">
            Send Message
          </span>
        </div>

        {/* Message content */}
        <div className="bg-white px-4 py-3">
          <div className="text-sm text-gray-800 break-words leading-relaxed">
            {data.message}
          </div>
        </div>
      </div>

      {/* Target Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-500 !border-2 !border-white !rounded-full"
        style={{ left: -6 }}
      />

      {/* Source Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-500 !border-2 !border-white !rounded-full"
        style={{ right: -6 }}
      />
    </div>
  );
}

export default TextNode;

import { Handle, Position } from "@xyflow/react";

function TextNode({ data, selected }) {
  return (
    <div className="relative">
      <div
        className={`rounded-lg min-w-[180px] sm:min-w-[200px] max-w-[220px] sm:max-w-[250px] shadow-lg border-2 overflow-hidden ${
          selected ? "border-blue-500" : "border-gray-300"
        }`}
      >
        {/* Header with icon and title */}
        <div className="bg-[#B2F0E7] px-3 sm:px-4 py-2 sm:py-2 flex items-center gap-2 sm:gap-2">
          <div className="w-4 h-4 sm:w-4 sm:h-4 flex items-center justify-center">
            💬
          </div>
          <span className="text-sm sm:text-sm font-medium text-gray-700">
            Send Message
          </span>
        </div>

        {/* Message content */}
        <div className="bg-white px-3 sm:px-4 py-3 sm:py-3">
          <div className="text-sm sm:text-sm text-gray-800 break-words leading-relaxed min-h-[1.5rem]">
            {data.message || "Enter your message..."}
          </div>
        </div>
      </div>

      {/* Target Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 sm:w-3 sm:h-3 !bg-gray-500 !border-2 !border-white !rounded-full"
        style={{ left: -8 }}
      />

      {/* Source Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 sm:w-3 sm:h-3 !bg-gray-500 !border-2 !border-white !rounded-full"
        style={{ right: -8 }}
      />
    </div>
  );
}

export default TextNode;

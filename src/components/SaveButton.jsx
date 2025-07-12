import toast from "react-hot-toast";
import { toPng, toJpeg } from "html-to-image";
import { useState } from "react";

const SaveButton = ({
  nodes,
  edges,
  onSave,
  reactFlowRef,
  reactFlowInstance,
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const exportAsImage = async (format = "png") => {
    if (!reactFlowRef?.current || !reactFlowInstance) {
      toast.error("Canvas not ready for export");
      return;
    }

    if (!nodes || nodes.length === 0) {
      toast.error("No nodes to export");
      return;
    }

    let currentViewport = null;

    try {
      toast.loading("Preparing complete flow for export...");

      // Store current viewport
      currentViewport = reactFlowInstance.getViewport();

      // Fit view to show all nodes
      reactFlowInstance.fitView({ padding: 50, duration: 0 });

      // Wait for the view to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      toast.dismiss();
      toast.loading(`Generating ${format.toUpperCase()} image...`);

      // Capture the viewport area
      const viewportElement = reactFlowRef.current.querySelector(
        ".react-flow__viewport"
      );
      const targetElement = viewportElement || reactFlowRef.current;

      const dataUrl =
        format === "png"
          ? await toPng(targetElement, {
              backgroundColor: "#f3f4f6",
              pixelRatio: 2,
              filter: (node) => {
                // Exclude controls and panels from export
                return (
                  !node.classList?.contains("react-flow__controls") &&
                  !node.classList?.contains("react-flow__panel") &&
                  !node.classList?.contains("react-flow__attribution")
                );
              },
            })
          : await toJpeg(targetElement, {
              backgroundColor: "#f3f4f6",
              quality: 0.9,
              pixelRatio: 2,
              filter: (node) => {
                // Exclude controls and panels from export
                return (
                  !node.classList?.contains("react-flow__controls") &&
                  !node.classList?.contains("react-flow__panel") &&
                  !node.classList?.contains("react-flow__attribution")
                );
              },
            });

      // Restore original viewport
      reactFlowInstance.setViewport(currentViewport, { duration: 0 });

      const link = document.createElement("a");
      link.download = `chatbot-flow-complete-${new Date()
        .toISOString()
        .slice(0, 10)}.${format}`;
      link.href = dataUrl;
      link.click();

      toast.dismiss();
      toast.success(`Complete flow exported as ${format.toUpperCase()}`);
      setShowExportOptions(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.dismiss();
      toast.error(`Failed to export ${format.toUpperCase()}: ${error.message}`);

      // Restore viewport in case of error
      if (reactFlowInstance && currentViewport) {
        try {
          reactFlowInstance.setViewport(currentViewport, { duration: 0 });
        } catch (restoreError) {
          console.error("Failed to restore viewport:", restoreError);
        }
      }
    }
  };

  const exportAsJSON = () => {
    try {
      const flowData = {
        id: Date.now().toString(),
        name: `Flow Export ${new Date().toLocaleDateString()}`,
        nodes,
        edges,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };

      const dataStr = JSON.stringify(flowData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chatbot-flow-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Flow exported as JSON");
      setShowExportOptions(false);
    } catch (error) {
      console.error("JSON export error:", error);
      toast.error("Failed to export JSON");
    }
  };

  const validateFlow = () => {
    // Check if there are more than one nodes
    if (nodes.length <= 1) {
      return { isValid: true, error: null };
    }

    const nodesWithIncomingEdges = new Set(edges.map((edge) => edge.target));
    const nodesWithEmptyTargetHandles = nodes.filter(
      (node) => !nodesWithIncomingEdges.has(node.id)
    );

    // If there are more than one nodes with empty target handles, show error
    if (nodesWithEmptyTargetHandles.length > 1) {
      return {
        isValid: false,
        error:
          "Cannot save flow: More than one node has empty target handles. Only one start node is allowed.",
      };
    }

    return { isValid: true, error: null };
  };

  const handleSave = () => {
    const validation = validateFlow();

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    // If validation passes, save the flow
    onSave({ nodes, edges });
    toast.success("Flow saved successfully!");

    // Show export options after successful save
    setShowExportOptions(true);
  };

  return (
    <div className="relative">
      <button
        onClick={handleSave}
        className="px-3 lg:px-4 py-2 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm text-sm lg:text-base whitespace-nowrap"
      >
        <span className="hidden sm:inline">Save Changes</span>
        <span className="sm:hidden">Save</span>
      </button>

      {/* Export Options Modal */}
      {showExportOptions && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowExportOptions(false)}
          />

          {/* Modal */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                🎉 Flow Saved Successfully!
              </h3>
              <button
                onClick={() => setShowExportOptions(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Would you like to download your flow for sharing or backup?
            </p>

            <div className="space-y-3">
              {/* Image Export Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  📸 Export as Image
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportAsImage("png")}
                    className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors flex items-center justify-center gap-1"
                  >
                    🖼️ PNG
                  </button>
                  <button
                    onClick={() => exportAsImage("jpeg")}
                    className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors flex items-center justify-center gap-1"
                  >
                    📷 JPEG
                  </button>
                </div>
              </div>

              {/* JSON Export */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  💾 Export as Data
                </h4>
                <button
                  onClick={exportAsJSON}
                  className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded transition-colors flex items-center justify-center gap-1"
                >
                  📄 JSON File
                </button>
              </div>

              {/* Skip Option */}
              <button
                onClick={() => setShowExportOptions(false)}
                className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors mt-3"
              >
                Skip for now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SaveButton;

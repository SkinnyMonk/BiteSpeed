import { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import NodeEditor from "./components/NodeEditor";
import Header from "./components/Header";

function App() {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });

  const handleFlowChange = useCallback((newFlowData) => {
    setFlowData(newFlowData);
  }, []);

  const handleSave = useCallback(() => {
    // Here you would typically send the data to your backend
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header
        nodes={flowData.nodes}
        edges={flowData.edges}
        onSave={handleSave}
      />

      <div className="flex-1">
        <NodeEditor onFlowChange={handleFlowChange} />
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            minWidth: "320px",
            maxWidth: "90vw",
            width: "auto",
            padding: "16px 20px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default App;

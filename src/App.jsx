import { useState, useCallback } from "react";
import NodeEditor from "./components/NodeEditor";
import Header from "./components/Header";

function App() {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });

  const handleFlowChange = useCallback((newFlowData) => {
    setFlowData(newFlowData);
  }, []);

  const handleSave = useCallback((flowDataToSave) => {
    console.log("Saving flow:", flowDataToSave);
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
    </div>
  );
}

export default App;

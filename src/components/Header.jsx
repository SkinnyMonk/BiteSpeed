import SaveButton from "./SaveButton";

const Header = ({ nodes, edges, onSave, reactFlowRef }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-3 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
      <h1 className="text-lg lg:text-xl font-semibold text-gray-800 truncate mr-4">
        <span className="hidden sm:inline">Bitespeed</span>
        <span className="sm:hidden">Flow Builder</span>
      </h1>
      <SaveButton
        nodes={nodes}
        edges={edges}
        onSave={onSave}
        reactFlowRef={reactFlowRef}
      />
    </div>
  );
};

export default Header;

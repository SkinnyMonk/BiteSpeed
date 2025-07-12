import React from "react";
import SaveButton from "./SaveButton";

const Header = ({ nodes, edges, onSave }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">
        BiteSpeed Chatbot Flow Builder
      </h1>
      <SaveButton nodes={nodes} edges={edges} onSave={onSave} />
    </div>
  );
};

export default Header;

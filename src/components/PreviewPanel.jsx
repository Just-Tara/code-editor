import React from 'react';

function PreviewPanel({ activeMobileView, files, outputCode, fontSize}) {
  return (
    <div
      className={`flex-1 md:flex flex-col ${
        activeMobileView !== 'preview' ? 'hidden md:flex' : 'flex'
      }`}
    >
      <div className="bg-gray-800 border-b border-gray-700 px-4 md:py-[9px] py-2 flex items-center justify-between">
        <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
           Live Preview
        </span>
        <div className="hidden md:flex items-center gap-2">
        {/** <select className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
            <option>Desktop</option>
            <option>Tablet</option>
            <option>Mobile</option>
          </select> */} 
  
        </div>
      </div>

      <div className="flex-1 bg-white overflow-auto p-6">
       <iframe 
        srcDoc={outputCode} 
        title="Live Preview" 
        className="w-full h-full border-0" 
        sandbox="allow-scripts"
        fontSize={fontSize}
        >
        
       </iframe>
      </div>
    </div>
  );
}

export default PreviewPanel;

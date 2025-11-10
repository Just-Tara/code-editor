import React from 'react';
import EditorTabs from './EditorTabs';
import CodeEditor from './CodeEditor';
import StatusBar from './StatusBar';

function EditorPanel({ activeTab, onTabChange, activeMobileView, files, onCodeChange, isDark, fontSize}) {
  return (

    <div
      className={`flex-1 md:flex flex-col border-r border-gray-700 ${
        activeMobileView === 'preview' ? 'hidden' : 'flex'
      }`}
    >
      <EditorTabs activeTab={activeTab} onTabChange={onTabChange} />
      

      
      <div className='flex-1 overflow-hidden'>
        <CodeEditor
        value={files[activeTab]}
        onChange={onCodeChange}
        language={activeTab === "js" ? "javascript" : activeTab}
        theme={isDark ? "dark" : "light"}
        fontSize={fontSize}
        />
      </div>
      <StatusBar />
    </div>
  );
}

export default EditorPanel;

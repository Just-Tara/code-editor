import React from 'react';
import EditorTabs from './EditorTabs';
import CodeEditor from './CodeEditor';
import StatusBar from './StatusBar';

function EditorPanel({ 
    activeTab, 
    onTabChange, 
    activeMobileView, 
    files, 
    onCodeChange, 
    isDark, 
    fontSize,
    isAutoSaveEnabled,
    onEditorReady,
    onAddFile,
    onDeleteFile,
    onToggleSidebar,
    isSidebarOpen,
    onCloseTab ,
    openTabs
  }) {
  
  
  if (!Array.isArray(files) || files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>No files available</p>
      </div>
    );
  }
  
 
  const activeFile = files.find(f => f.id === activeTab) || files[0];
  
  return (
    <div
      className={`flex-1 md:flex flex-col border-r border-gray-700 ${
        activeMobileView === 'preview' ? 'hidden' : 'flex'
      }`}
    >
      <EditorTabs 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        onAddFile={onAddFile}
        files={files}
        onDeleteFile={onDeleteFile}
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen = {isSidebarOpen}
        onCloseTab={onCloseTab}
        openTabs={openTabs}
      />
      
      <div className='flex-1 overflow-hidden'>
        <CodeEditor
          value={activeFile.content}
          onChange={onCodeChange}
          language={activeFile.language}
          theme={isDark ? "dark" : "light"}
          fontSize={fontSize}
          onEditorMount={onEditorReady}
        />
      </div>
      <StatusBar isAutoSaveEnabled={isAutoSaveEnabled} />
    </div>
  );
}

export default EditorPanel;
import React from 'react';
import { Plus, X, Folder, FolderOpen } from 'lucide-react';

function EditorTabs({ 
  activeTab, 
  onTabChange, 
  onAddFile, 
  files, 
  onToggleSidebar, 
  isSidebarOpen,
  openTabs,      
  onCloseTab 
}) {
  return (
    <div className="hidden md:flex bg-gray-800 border-b border-gray-700">
      
      <button
        className='flex items-center cursor-pointer text-gray-400 hover:text-gray-200 transition bg-gray-700 pl-3 pr-3 border-r border-gray-600' 
        aria-label="Toggle file explorer"
        title='File Explorer'
        onClick={onToggleSidebar}
      >
        {isSidebarOpen ? <FolderOpen size={20}/> : <Folder size={20} />}
      </button>

   
      <div className="flex-1 flex overflow-x-auto custom-scrollbar">
        {openTabs.map(fileId => { 
          const file = files.find(f => f.id === fileId);  
          if (!file) return null;  
          
          return (
            <div 
              key={file.id}
              className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer group whitespace-nowrap border-r border-gray-700 ${
                activeTab === file.id
                  ? 'text-gray-200 bg-gray-900 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-750'
              }`}
            >
              <span onClick={() => onTabChange(file.id)} className="cursor-pointer">
                {file.name}
              </span>
              
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(file.id);
                }}
                className="opacity-50 hover:opacity-100 hover:text-red-400 transition"
                title="Close tab"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      
     
      <button 
        onClick={onAddFile} 
        className="px-3 py-2 text-green-500 hover:text-green-400 cursor-pointer transition border-l border-gray-700"
        title="Add new file"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

export default EditorTabs;
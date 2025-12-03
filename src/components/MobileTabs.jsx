import React from 'react';
import { X, Folder, FolderOpen } from 'lucide-react';

function MobileTabs({ 
  activeView,       
  onViewChange,     
  files,            
  onToggleSidebar,  
  isSidebarOpen,   
  openTabs,         
  onCloseTab        
}) {
  return (
    <div className="md:hidden bg-gray-800 border-b border-gray-700 flex">
      
     
      <button
        className='flex items-center cursor-pointer text-gray-400 hover:text-gray-200 transition bg-gray-700 pl-2 pr-2 border-r border-gray-600' 
        aria-label="Toggle file explorer"
        title='File Explorer'
        onClick={onToggleSidebar}
      >
        {isSidebarOpen ? <FolderOpen size={18}/> : <Folder size={18} />}
      </button>

      
      <div className="flex overflow-x-auto flex-1 custom-scrollbar">
        {openTabs.map(fileId => {
  
          const file = files.find(f => f.id === fileId);
          
      
          if (!file) return null;
          
          return (
            <div 
              key={file.id} 
              className={`flex items-center justify-center gap-1 px-3 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
                activeView === file.id
                  ? 'text-gray-200 border-blue-500 bg-gray-900'
                  : 'text-gray-500 border-transparent'
              }`}
            >
             
              <span 
                onClick={() => onViewChange(file.id)}
                className="cursor-pointer"
              >
                {file.name}
              </span>
              
              
              <button
                onClick={(e) => {
                  e.stopPropagation();  
                  onCloseTab(file.id);
                }}
                className="hover:text-red-400 transition ml-1"
                title="Close tab"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
      
      
      <button
        onClick={() => onViewChange('preview')}
        className={`px-4 py-3 text-xs font-medium border-b-2 transition uppercase whitespace-nowrap border-l border-gray-700 ${
          activeView === 'preview'
            ? 'text-gray-200 border-blue-500 bg-gray-900'
            : 'text-gray-500 border-transparent'
        }`}
      >
        Preview
      </button>
    </div>
  );
}

export default MobileTabs;
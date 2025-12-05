import React, { useState } from 'react';
import { 
  FolderPlus, 
  FilePlus, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Trash2
} from 'lucide-react';


function FileExplorer({ 
  projects, 
  onProjectCreate, 
  onProjectDelete,
  onFolderCreate,
  onFolderDelete,
  onFileCreate,
  onFileDelete,
  onFileSelect,
  activeFileId,
  isDark
}) {
 
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id);

  return (
    <div className={`w-64 h-full flex flex-col border-r ${
      isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>

      <div className={`shrink-0 p-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-sm font-semibold uppercase ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Projects
          </h2>
        </div>
        
       
        <div className="flex items-center gap-2">
         
          <button
            onClick={onProjectCreate}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
            }`}
            title="New Project"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Project</span>
          </button>

         
          <button
            onClick={() => {
              if (!selectedProjectId) {
                alert("Please select a project first!");
                return;
              }
              onFolderCreate(selectedProjectId);
            }}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
            }`}
            title="New Folder in Selected Project"
          >
            <FolderPlus size={14} />
            <span className="hidden sm:inline">Folder</span>
          </button>

         
          <button
            onClick={() => {
              if (!selectedProjectId) {
                alert("Please select a project first!");
                return;
              }
              onFileCreate(selectedProjectId, null);
            }}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
            }`}
            title="New File in Selected Project"
          >
            <FilePlus size={14} />
            <span className="hidden sm:inline">File</span>
          </button>
        </div>
      </div>

     
      <div className="overflow-y-auto h-[calc(100%-100px)]">
        {projects.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            <p className="mb-2">No projects yet</p>
            <button
              onClick={onProjectCreate}
              className="text-blue-500 hover:text-blue-400 text-xs"
            >
              Create your first project
            </button>
          </div>
        ) : (
          projects.map(project => (
            <ProjectItem
              key={project.id}
              project={project}
              onFolderCreate={onFolderCreate}
              onFileCreate={onFileCreate}
              onProjectDelete={onProjectDelete}
              onFolderDelete={onFolderDelete}
              onFileDelete={onFileDelete}
              onFileSelect={onFileSelect}
              activeFileId={activeFileId}
              isDark={isDark}
              onProjectClick={() => setSelectedProjectId(project.id)}
              isSelected={selectedProjectId === project.id}
            />
          ))
        )}
      </div>
    </div>
  );
}


function ProjectItem({ 
  project, 
  onFolderCreate, 
  onFileCreate,
  onProjectDelete,
  onFolderDelete,
  onFileDelete,
  onFileSelect,
  activeFileId,
  isDark,
  onProjectClick,
  isSelected
}) {
  const [isExpanded, setIsExpanded] = useState(project.expanded);

  return (
    <div className="select-none">
      
      <div 
        className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer group ${
          isSelected 
            ? (isDark ? 'bg-gray-800' : 'bg-gray-200')
            : (isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200')
        }`}
        onClick={() => {
          onProjectClick();
          setIsExpanded(!isExpanded);
        }}
      >
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }} 
          className="p-0.5"
        >
          {isExpanded ? (
            <ChevronDown size={14} className="text-gray-400" />
          ) : (
            <ChevronRight size={14} className="text-gray-400" />
          )}
        </button>
        
        
        {isExpanded ? (
          <FolderOpen size={16} className="text-blue-400" />
        ) : (
          <Folder size={16} className="text-blue-400" />
        )}
        
        
        <span className={`flex-1 text-sm truncate ${
          isDark ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {project.name}
        </span>
        
        
        <div className="hidden group-hover:flex items-center gap-1">
         
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFolderCreate(project.id);
            }}
            className={`p-1 rounded transition ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
            }`}
            title="New Folder"
          >
            <FolderPlus size={12} className="text-gray-400" />
          </button>
          
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileCreate(project.id, null);
            }}
            className={`p-1 rounded transition ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
            }`}
            title="New File"
          >
            <FilePlus size={12} className="text-gray-400" />
          </button>
          
         
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProjectDelete(project.id);
            }}
            className="p-1 hover:bg-red-600 rounded transition"
            title="Delete Project"
          >
            <Trash2 size={12} className="text-gray-400" />
          </button>
        </div>
      </div>

     
      {isExpanded && (
        <div className="ml-4">
        
          {project.folders?.map(folder => (
            <FolderItem
              key={folder.id}
              folder={folder}
              projectId={project.id}
              onFileCreate={onFileCreate}
              onFolderDelete={onFolderDelete}
              onFileDelete={onFileDelete}
              onFileSelect={onFileSelect}
              activeFileId={activeFileId}
              isDark={isDark}
            />
          ))}

          
          {project.files?.map(file => (
            <FileItem
              key={file.id}
              file={file}
              projectId={project.id}
              folderId={null}
              onFileSelect={onFileSelect}
              onFileDelete={onFileDelete}
              activeFileId={activeFileId}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
}


function FolderItem({ 
  folder, 
  projectId,
  onFileCreate,
  onFolderDelete,
  onFileDelete,
  onFileSelect,
  activeFileId,
  isDark
}) {
  const [isExpanded, setIsExpanded] = useState(folder.expanded);

  return (
    <div>
     
      <div 
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer group ${
          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }} 
          className="p-0.5"
        >
          {isExpanded ? (
            <ChevronDown size={14} className="text-gray-400" />
          ) : (
            <ChevronRight size={14} className="text-gray-400" />
          )}
        </button>
        
        
        {isExpanded ? (
          <FolderOpen size={14} className="text-yellow-400" />
        ) : (
          <Folder size={14} className="text-yellow-400" />
        )}
        
        
        <span className={`flex-1 text-sm truncate ${
          isDark ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {folder.name}
        </span>
        
       
        <div className="hidden group-hover:flex items-center gap-1">
         
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileCreate(projectId, folder.id);
            }}
            className={`p-1 rounded transition ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
            }`}
            title="New File"
          >
            <FilePlus size={12} className="text-gray-400" />
          </button>
          
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFolderDelete(projectId, folder.id);
            }}
            className="p-1 hover:bg-red-600 rounded transition"
            title="Delete Folder"
          >
            <Trash2 size={12} className="text-gray-400" />
          </button>
        </div>
      </div>

     
      {isExpanded && folder.files && (
        <div className="ml-4">
          {folder.files.length === 0 ? (
            <div className="px-2 py-1 text-xs text-gray-500 italic">
              Empty folder
            </div>
          ) : (
            folder.files.map(file => (
              <FileItem
                key={file.id}
                file={file}
                projectId={projectId}
                folderId={folder.id}
                onFileSelect={onFileSelect}
                onFileDelete={onFileDelete}
                activeFileId={activeFileId}
                isDark={isDark}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function FileItem({ 
  file, 
  projectId, 
  folderId = null, 
  onFileSelect, 
  onFileDelete, 
  activeFileId, 
  isDark 
}) {
  const isActive = file.id === activeFileId;

 
  const getFileIcon = (language) => {
    const colors = {
      html: 'text-orange-400',
      css: 'text-blue-400',
      scss: 'text-pink-400',
      javascript: 'text-yellow-400',
      typescript: 'text-blue-500',
      python: 'text-green-400',
      java: 'text-red-400',
      php: 'text-purple-400',
      ruby: 'text-red-500',
      go: 'text-cyan-400',
      c: 'text-gray-400',
      cpp: 'text-gray-400',
      json: 'text-yellow-300',
      xml: 'text-orange-300',
      yaml: 'text-red-300',
      sql: 'text-orange-500',
      shell: 'text-green-500',
      markdown: 'text-blue-300'
    };
    return colors[language] || 'text-gray-400';
  };

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 cursor-pointer group ${
        isActive 
          ? (isDark ? 'bg-gray-800 border-l-2 border-blue-500' : 'bg-gray-300 border-l-2 border-blue-500')
          : (isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200')
      }`}
      onClick={() => onFileSelect(file.id)}
    >
      
      <File size={14} className={getFileIcon(file.language)} />
      
      
      <span className={`flex-1 text-sm truncate ${
        isDark ? 'text-gray-200' : 'text-gray-800'
      }`}>
        {file.name}
      </span>
      
    
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFileDelete(projectId, folderId, file.id);
        }}
        className="hidden group-hover:block p-1 hover:bg-red-600 rounded transition"
        title="Delete File"
      >
        <Trash2 size={10} className="text-gray-400" />
      </button>
    </div>
  );
}

export default FileExplorer;
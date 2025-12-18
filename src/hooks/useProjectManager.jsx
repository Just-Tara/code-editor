import { useState, useEffect } from "react";
import { getAllFiles, getActiveFile } from "../utils/fileHelpers"; 
import { getDefaultContent } from "../constants/Languages";
import { getProjectFromCloud } from "../config/superbaseClient";

export const useProjectManager = () => {
  const [projects, setProjects] = useState([
    {
      id: "project-1",
      name: "My First Project",
      expanded: false,
      folders: [],
      files: [
        {
            id: "file-1",
            name: "index.html",
            language: "html",
            content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>"
          },
          {
            id: "file-2",
            name: "style.css",
            language: "css",
            content: "body {\n  font-family: Arial;\n  padding: 20px;\n}\n\nh1 {\n  color: #007acc;\n}"
          },
          {
            id: "file-3",
            name: "script.js",
            language: "javascript",
            content: "console.log('Hello');"
          }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState('file-1');
  const [activeProjectId, setActiveProjectId] = useState("project-1");
  const [openTabs, setOpenTabs] = useState(["file-1"]);
  const [targetProjectId, setTargetProjectId] = useState(null);
  const [targetFolderId, setTargetFolderId] = useState(null);
  const [isAddNewFileOpen, setIsAddNewFileOpen] = useState(false);

useEffect(() => {
  const loadShareProject = async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (id) {
      console.log("Found share ID:", id);
      const sharedData = await getProjectFromCloud(id);
      
    
      if (sharedData && sharedData.length > 0) {
        setProjects(sharedData);
        
        const loadedProject = sharedData[0];
        setActiveProjectId(loadedProject.id);
      
        if (loadedProject.files && loadedProject.files.length > 0) {
          setActiveTab(loadedProject.files[0].id);
          setOpenTabs([loadedProject.files[0].id]);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };
  loadShareProject();
}, []);
  
 useEffect(() => {
   const params = new URLSearchParams(window.location.search);
   const sharedId = params.get("id");

   if (sharedId) return; 
      try {
        const savedProjects = localStorage.getItem("code-projects");
        if (savedProjects) {
          const loadedProjects = JSON.parse(savedProjects);
          setProjects(loadedProjects);
          
          if (loadedProjects.length > 0) {
            setActiveProjectId(loadedProjects[0].id);
          
        
            try {
              const savedOpenTabs = localStorage.getItem("open-tabs");
              if (savedOpenTabs) {
                const loadedTabs = JSON.parse(savedOpenTabs);
                
              
                const allFileIds = [];
                loadedProjects.forEach(project => {
                  project.files?.forEach(file => allFileIds.push(file.id));
                  project.folders?.forEach(folder => {
                    folder.files?.forEach(file => allFileIds.push(file.id));
                  });
                });
                
                
                const validTabs = loadedTabs.filter(tabId => allFileIds.includes(tabId));
                
                if (validTabs.length > 0) {
                  setOpenTabs(validTabs);
                  setActiveTab(validTabs[0]);
                } else {
                
                  if (allFileIds.length > 0) {
                    setOpenTabs([allFileIds[0]]);
                    setActiveTab(allFileIds[0]);
                  }
                }
              }
            } catch (error) {
              console.error("Failed to load open tabs:", error);
            }
          }
          
        } else {
          console.log("No saved projects found");
        }
      } catch(error) {
        console.error("Failed to load projects:", error);
      }
    }, []);

 

  useEffect(() => {
        try {
          localStorage.setItem("open-tabs", JSON.stringify(openTabs));
        } catch (error) {
        }
      }, [openTabs]);
  

  // project Handlers
  const handleProjectCreate = () => {
    const projectName = prompt("Enter Project Name:") || `Project ${projects.length + 1}`;
    const newProject = {
      id: `project-${Date.now()}`,
      name: projectName,
      expanded: false,
      folders: [],
      files: []
    };
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
  };

  const handleProjectDelete = (projectId) => {
    if (projects.length === 1) {
      alert("Can't delete the last project!");
      return;
    }
    if (!confirm("Delete this project and all its files?")) return;
    setProjects(projects.filter(p => p.id !== projectId));
    
    const activeFile = getActiveFile(projects, activeTab);
    if (activeFile?.projectId === projectId) {
        const remainingFiles = getAllFiles(projects).filter(f => f.projectId !== projectId);
        if (remainingFiles.length > 0) setActiveTab(remainingFiles[0].id);
    }
  };

  // Folder Handlers
  const handleFolderCreate = (projectId) => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          folders: [...(project.folders || []), {
            id: `folder-${Date.now()}`,
            name: folderName,
            expanded: true,
            files: []
          }]
        };
      }
      return project;
    }));
  };

  const handleFolderDelete = (projectId, folderId) => {
    if (!confirm("Delete this folder and all it's files?")) return;
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          folders: project.folders.filter(f => f.id !== folderId)
        };
      }
      return project;
    }));
  };

  // File Handlers
  const handleFileCreateInLocation = (projectId, folderId) => {
    setTargetProjectId(projectId);
    setTargetFolderId(folderId);
    setIsAddNewFileOpen(true);
  };

  const handleFIleCreation = ({ name, language }) => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: name,
      language: language.id,
      content: getDefaultContent(language.id)
    };
  
    const projectId = targetProjectId || projects[0]?.id;
    const folderId = targetFolderId;
  
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        if (folderId) {
          return {
            ...project,
            folders: project.folders.map(folder => {
              if (folder.id === folderId) {
                return { ...folder, files: [...folder.files, newFile] };
              }
              return folder;
            })
          };
        }
        return { ...project, files: [...project.files, newFile] };
      }
      return project;
    }));
    
    setTargetProjectId(null);
    setTargetFolderId(null);
    setOpenTabs([...openTabs, newFile.id]);
    setActiveTab(newFile.id);
    setIsAddNewFileOpen(false);
  };

   const handleFileDelete = (projectId, folderId, fileId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        if (folderId) {
          return {
            ...project,
            folders: project.folders.map(folder => {
              if (folder.id === folderId) {
                return{
                  ...folder,
                  files: folder.files.filter(f => f.id !== fileId)
                };
              }
              return folder;
             })
          };
        } else{
          return {
            ...project,
            files: project.files.filter(f => f.id !== fileId)
          };
        }
      }
      return project;
    }));

    if (activeTab === fileId) {
      const remainingFiles = getAllFiles(projects).filter(f => f.id !== fileId);
      if (remainingFiles.length > 0) {
        setActiveTab(remainingFiles[0].id)
      }
    }
 };


  const deleteFiles = (fileId) => {
    const allFiles = getAllFiles(projects);
    
    if (allFiles.length === 1) {
      alert("Can't delete the last file");
      return;
    }
  
    const fileToDelete = allFiles.find(f => f.id === fileId);
    if (!fileToDelete) return;
    
   
    handleFileDelete(fileToDelete.projectId, fileToDelete.folderId, fileId);
  };
  

  const handleCodeChange = (newCode) => {
    setProjects(projects.map(project => ({
      ...project,
      files: project.files?.map(file =>
        file.id === activeTab ? {...file, content: newCode} : file
      ),
      folders: project.folders?.map(folder => ({
        ...folder,
        files: folder.files?.map(file =>
          file.id === activeTab ? {...file, content:newCode} : file
        )
      }))
    })));
  };

  const handleCloseTab = (fileId) => {
    if (openTabs.length === 1) return;
    const newOpenTabs = openTabs.filter(id => id !== fileId);
    setOpenTabs(newOpenTabs);
    if (activeTab === fileId) setActiveTab(newOpenTabs[newOpenTabs.length - 1]);
   };

  const handleFileSelect = (fileId) => {
    setActiveTab(fileId);
    if (!openTabs.includes(fileId)) setOpenTabs([...openTabs, fileId]);
    const allFiles = getAllFiles(projects);
    const selectedFile = allFiles.find(f => f.id === fileId);
    if (selectedFile) setActiveProjectId(selectedFile.projectId);
  };

  return {
    projects, setProjects,
    activeTab, setActiveTab,
    activeProjectId, setActiveProjectId,
    openTabs, setOpenTabs,
    isAddNewFileOpen, setIsAddNewFileOpen,
    handleProjectCreate,
    handleProjectDelete,
    handleFolderCreate,
    handleFolderDelete,
    handleFileCreateInLocation,
    handleFIleCreation,
    deleteFiles,
    handleFileDelete,
    handleCodeChange,
    handleCloseTab,
    handleFileSelect
  };
};

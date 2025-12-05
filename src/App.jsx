import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import AddNewFIle from "./components/AddNewFIle.jsx";
import MobileTabs from "./components/MobileTabs";
import EditorPanel from "./components/EditorPanel.jsx";
import PreviewPanel from "./components/PreviewPanel";
import MobileMenu from "./components/MobileMenu";
import Split from "@uiw/react-split";
import { getDefaultContent } from "./constants/Languages.jsx";
import { excutePistonCode } from "./utils/PistonApi.jsx";
import Console from "./components/Console.jsx";
import FileExplorer from "./components/FIleExplorer.jsx";

function App() {
  const [isDark, setIsDark] = useState(true);
  const [pistonOutput, setPistonOutput] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('file-1');
  const [activeMobileView, setActiveMobileView] = useState("html");
  const [outputCode, setOutputCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [fontSize, setFontSize] = useState(14);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [editorInstance, setEditorInstance] = useState(null); 
  const [shareCode, setShareCode] = useState(false);
  const [isAddNewFileOpen, setIsAddNewFileOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false)
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

const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
const [targetProjectId, setTargetProjectId] = useState(null);
const [targetFolderId, setTargetFolderId] = useState(null);
const [activeProjectId, setActiveProjectId] = useState("project-1");
const [openTabs, setOpenTabs] = useState(["file-1"]);

 

const PISTON_LANGUAGES = [
    'python', 
    'java', 
    'php', 
    'ruby', 
    'go', 
    'c', 
    'cpp', 
    'shell',
    'javascript',
    'typescript'];

  
 
 
  const compileScss = (scssCode) => scssCode.replace(/\$primary-color:\s*(.*?);[\s\S]*?color:\s*\$primary-color;/g, 'color: $1;');
  const transpileTs = (tsCode) => tsCode.replace(/const\s+(\w+):\s*string\s*=\s*(.*?);/g, 'const $1 = $2;');
   
  // useEffect to HANDLE MOBILE VIEW DETECTION
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // useEffect to AUTO-SAVE projects to localStorage when they change
  useEffect(() => {
    if (!isAutoSaveEnabled) return;
    
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('code-projects', JSON.stringify(projects));
        console.log("Projects auto-saved");
      } catch (error) {
        console.error("Failed to save projects:", error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [projects, isAutoSaveEnabled]);

  // useEffect to SAVE auto-save preference to localStorage
  useEffect(() => {
    localStorage.setItem('auto-save-enabled', JSON.stringify(isAutoSaveEnabled));
    console.log('Auto-save preference saved:', isAutoSaveEnabled);
  }, [isAutoSaveEnabled]);



  // useEffect to LOAD code from URL parameter on initial render
    useEffect(() => {
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

    // useEffect to Save open tabs whenever they change
    useEffect(() => {
      try {
        localStorage.setItem("open-tabs", JSON.stringify(openTabs));
      } catch (error) {
      }
    }, [openTabs]);



  // useEffect to RESET shareCode after 3 seconds
  useEffect(() => {
    if (!shareCode) return;

    const timer = setTimeout(() => {
      setShareCode(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [shareCode]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const toggleAutoSave = () => {
    setIsAutoSaveEnabled(prev => !prev);
  };


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

  const getFilesFromProject = (projectId) => {
  const project = projects.find(p => p.id === projectId);
  if (!project) {
    console.log(" project not found", projectId);
    return [];
  }
  
  console.log("Found project:", project);  
  console.log("Project files:", project.files);  
  console.log("Project folders:", project.folders); 

  const files = [];

  project.files?.forEach(file => {
    files.push({
      ...file,
      projectId: project.id,
      folderId: null
    });
  });

  project.folders?.forEach(folder => {
    folder.files?.forEach(file => {
      files.push({
        ...file,
        projectId: project.id,
        folderId: folder.id
      });
    });
  });
  
  console.log("Returning files:", files); 
  return files;
}
  const handleProjectDelete = (projectId) => {
    if (projects.length === 1) {
      alert("Can't delete the last project!");
      return;
    }

    if (!confirm("Delete this project and all its files?")) return;

    setProjects(projects.filter(p => p.id!== projectId));


    const activeFile = getActiveFile();
      if (activeFile?.projectId === projectId) {
        const remainingFiles = getAllFiles().filter(f => f.projectId !== projectId);
        if (remainingFiles.length > 0) {
            setActiveTab(remainingFiles[0].id);
        }
      }
  };

  const handleFolderCreate = (projectId) => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return{
          ...project,
          folders: [
            ...(project.folders || []),
            {
              id: `folder-${Date.now()}`,
              name: folderName,
              expanded: true,
              files: []
            }
          ]
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

  const handleFileCreateInLocation = (projectId, folderId) => {
    setTargetProjectId(projectId);
    setTargetFolderId(folderId);

    setIsAddNewFileOpen(true);
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
      const remainingFiles = getAllFiles().filter(f => f.id !== fileId);
      if (remainingFiles.length > 0) {
        setActiveTab(remainingFiles[0].id)
      }
    }
 };

 const handleCloseTab = (fileId) => {
  if (openTabs.length === 1) {
    return;
  }
  const newOpenTabs = openTabs.filter(id => id !== fileId);
  setOpenTabs(newOpenTabs);

  if (activeTab === fileId) {
    setActiveTab(newOpenTabs[newOpenTabs.length - 1]);
  }
 };
 const handleFileSelect = (fileId) => {
  setActiveTab(fileId);


  if (!openTabs.includes(fileId)) {
    setOpenTabs([...openTabs, fileId]);
  }
  const allFiles = getAllFiles();
  const selectedFile = allFiles.find(f => f.id === fileId);

  if (selectedFile) {
    setActiveProjectId(selectedFile.projectId);
    console.log("Selected file: ", selectedFile.name);
    console.log("Active project set to:", selectedFile.projectId);
  }
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

  const handleSaveCode = () => {
    try {
      localStorage.setItem('code-files', JSON.stringify(projects));
      console.log("code saved successfully!");
    } catch (error) {
      console.log("failed to save:", error);
    }
  };
  
  const handleShareCode = async () => {
    try {
      const jsonString = JSON.stringify(projects);
      const base64Encoded = btoa(jsonString);
      const shareableURL = `${window.location.origin}${window.location.pathname}?code=${base64Encoded}`;
      await navigator.clipboard.writeText(shareableURL);
      console.log("Shareable URL copied to clipboard:", shareableURL);
      setShareCode(true);
    } catch (error) {
      console.log("Failed to generate shareable URL:", error);
      alert("Error generating shareable link. Please try again.");
    }
  };

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);
  };

  const handleFormatCode = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument').run();
    } else {
      console.log("Editor instance not ready yet.");
    }
  };

   const executeFontendCode = (code, language) => {
    setConsoleLogs([]);
    setIsConsoleOpen(true);

    const addLog = (message, type = 'log') => {
      const timestamp = new Date().toLocaleTimeString();
      setConsoleLogs(prev => [...prev, {message, type, timestamp}]);
    };

    try{
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      const customConsole ={
        log: (...args) => {
          addLog(args.join (''), 'log');
          originalConsole.log(...args);
        },
        error: (...args) => {
          addLog(args.join(''), 'error');
          originalConsole.error(...args);
        },
         warn: (...args) => {
          addLog(args.join(''), 'warn');
          originalConsole.error(...args);
        },
         info: (...args) => {
          addLog(args.join(''), 'info');
          originalConsole.error(...args);
        },
      };

      let excutableCode = code;

      if (language === 'typescript') {
        excutableCode = code
        .replace(/:\s*\w+(\[\])?/g, '') 
        .replace(/interface\s+\w+\s*{[^}]*}/g, '') 
        .replace(/type\s+\w+\s*=\s*[^;]+;/g, ''); 
      }

      const func = new Function('console', excutableCode);
      func(customConsole);

      addLog('Execution completed successfully', 'info');    
    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
    }
    };

    const getAllFiles = () => {
      const allFiles = [];

      projects.forEach(project => {
        project.files?.forEach(file => {
          allFiles.push({
            ...file,
            projectId: project.id,
            folderId: null
          });
        });

        project.folders?.forEach(folder => {
          folder.files?.forEach(file => {
            allFiles.push({
              ...file,
              projectId: project.id,
              folderId: folder.id
            });
          });
        });
      });

      return allFiles;
    };
    const getActiveFile = () => {
      return getAllFiles().find(f => f.id === activeTab) || getAllFiles()[0];
    };

    

 

    const handleRunCode = async () => {
  console.log(" Running code...");
  setPistonOutput(null);

  const currentActiveFile = getActiveFile();
  console.log(" Current file:", currentActiveFile);
  console.log(" File language:", currentActiveFile.language); 
  
  
  if (currentActiveFile.language === 'javascript' || currentActiveFile.language === 'typescript') {
    console.log("Running JS/TS code");
    setOutputCode("");
    executeFontendCode(currentActiveFile.content, currentActiveFile.language);

    if (isMobile) {
      setActiveMobileView("preview");
    }
    return;
  }
 
  
  const projectFiles = getFilesFromProject(activeProjectId);
  console.log(" Project files:", projectFiles);
  console.log(" Active project ID:", activeProjectId);

  const hasWebFiles = projectFiles.some(f => 
    f.language === 'html' || 
    f.language === 'css' || 
    f.language === 'scss' || 
    ((f.language === 'javascript' || f.language === 'typescript') && projectFiles.some(file => file.language === 'html'))
  );
  
  console.log(" Has web files?", hasWebFiles);
  console.log(" Current file language:", currentActiveFile.language);

  if (hasWebFiles && (currentActiveFile.language === 'html' || 
      currentActiveFile.language === 'css' || 
      currentActiveFile.language === 'scss')) {
    console.log(" Calling handleGeneratePreview()");
    handleGeneratePreview();

    if (isMobile) {
      setActiveMobileView("preview");
    }
    return;
  }
  
  console.log(" Did not match HTML/CSS/SCSS condition");
  
  // Piston API execution for other languages

  if (PISTON_LANGUAGES.includes(currentActiveFile.language)) {
    console.log("🔧 Running via Piston API");
    setOutputCode("");

    try {
      console.log(`Executing ${currentActiveFile.language} code via Piston API...`);
      const result = await excutePistonCode(currentActiveFile.language, currentActiveFile.content);

      const runResult = result.run;
      const output = (runResult.stdout || runResult.output || "") + (runResult.stderr || "");
 
      if (runResult.code === 0 && !runResult.stderr) {
        setPistonOutput({
          type: 'success',
          content: output.trim() || `Execution finished successfully.`,
          language: currentActiveFile.language
        });
      } else {
        setPistonOutput({
          type: 'error',
          content: output.trim() || `Error during execution.`,
          language: currentActiveFile.language
        });
      }
      if (isMobile) {
        setActiveMobileView("preview");
      }
    } catch (error) {
      console.log("Piston API execution failed:", error);
      setPistonOutput({
        type: 'error',
        content: `Failed to connect or execute via API: ${error.message}`,
        language: currentActiveFile.language
      });
    } 
    return;
  }

  console.log(" No conditions matched!");
  setPistonOutput(null);
}

  const handleClearConsole = () => {
    setConsoleLogs([]);
  }

// FUNCTION TO GENERATE PREVIEW FOR HTML/CSS/JS PROJECTS

  const handleGeneratePreview = () => {
    const allFiles = getFilesFromProject(activeProjectId);

    const htmlFiles = allFiles.filter(f => f.language === 'html');
    const cssFiles = allFiles.filter(f => f.language === 'css' || f.language === 'scss');
    const jsFiles = allFiles.filter(f => f.language === 'javascript' || f.language === 'typescript');
    
    let mainHtmlFile = htmlFiles.find(f => f.name.toLowerCase().includes('index'));
    if (!mainHtmlFile) {
      mainHtmlFile = htmlFiles[0];
    }
    
    if (!mainHtmlFile) {
      console.log("No HTML files found");
      return;
    }
    
   
    const virtualHtmlFiles = {};
    const virtualCssFiles = {};
    const virtualJsFiles = {};

    const getFilePath = (file) => {
      if (file.folderId) {
        const project = projects.find( p => p.id === file.projectId);
        const folder = project?.folders.find(f => f.id === file.folderId);
        if (folder) {
          return `${folder.name}/${file.name}`;
        }
      }
      return file.name;
    }
    
    htmlFiles.forEach(file => {
      const path = getFilePath(file);
      virtualHtmlFiles[path] = file.content;
      virtualHtmlFiles[file.name] = file.content;
    });
    
    cssFiles.forEach(file => {
      let cssContent = file.content;
      if (file.language === 'scss') {
        cssContent = compileScss(file.content);
      }

      const path = getFilePath(file);
      virtualCssFiles[path] = cssContent;
      virtualCssFiles[file.name] = cssContent;

      const nameWithoutExt = file.name.replace(/\.(css)$/, '');
      virtualCssFiles[nameWithoutExt] = cssContent;

      if (file.language === 'scss') {
        const cssFileName = file.name.replace('.scss', '.css');
        const cssPath = path.replace('.scss', '.css');
        virtualCssFiles[cssFileName] = cssContent;
        virtualCssFiles[cssPath] = cssContent;
      }
    });
    
    jsFiles.forEach(file => {
      let jsContent = file.content;
      if (file.language === 'typescript') {
        jsContent = transpileTs(file.content);
      }
      const path = getFilePath(file)
      virtualJsFiles[path] = jsContent;
      virtualJsFiles[file.name] = jsContent;

      const nameWithoutExt = file.name.replace(/\.(js|ts)$/, '');
      virtualJsFiles[nameWithoutExt] = jsContent;

      if (file.language === "typescript") {
        const jsFileName = file.name.replace('.ts', '.js');
        const jsPath = path.replace('.ts', '.js');
        virtualJsFiles[jsFileName] = jsContent;
        virtualJsFiles[jsPath] = jsContent;
      }
    });

  
    const rawScriptContent = `
      window.__virtualHtmlFiles__ = ${JSON.stringify(virtualHtmlFiles)};
      window.__virtualCssFiles__ = ${JSON.stringify(virtualCssFiles)};
      window.__virtualJsFiles__ = ${JSON.stringify(virtualJsFiles)};
      window.__currentPage__ = "${mainHtmlFile.name}";
      window.__loadedResources__ = { css: [], js: [] };
      window.__modules__ = {};
      
      function loadVirtualCSS(filename) {
        let content = window.__virtualCssFiles__[filename];
        if (!content) {
          const nameWithoutExt = filename.replace(/\\.(css|scss)$/, '');
          content = window.__virtualCssFiles__[nameWithoutExt];
        }
        if (!content) {
          console.warn('CSS file not found:', filename);
          return;
        }
        if (window.__loadedResources__.css.includes(filename)) {
          return;
        }
        window.__loadedResources__.css.push(filename);
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-virtual-css', filename);
        styleElement.textContent = content; 
        document.head.appendChild(styleElement);
        console.log('CSS:', filename);
      }
      
     
      
      function loadVirtualJS(filename) {
        let content = window.__virtualJsFiles__[filename];
        if (!content) {
          const nameWithoutExt = filename.replace(/\\.(js|ts)$/, '');
          content = window.__virtualJsFiles__[nameWithoutExt];
        }
        if (!content) {
          console.warn('JS file not found:', filename);
          return;
        }
        if (window.__loadedResources__.js.includes(filename)) {
          return;
        }
        window.__loadedResources__.js.push(filename);

        try{
            const scriptElement = document.createElement('script');
            scriptElement.setAttribute('data-virtual-js', filename);
            scriptElement.textContent = content;
            document.body.appendChild(scriptElement);
            console.log(' JS:', filename);
        } catch(error) {
          console.error("Error loading JS:", filename, error);
        }  
       
      }
      
          function loadExternalResources(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
          const href = link.getAttribute('href');
          if (href && (href.endsWith('.css') || href.endsWith('.scss'))) {  //  FIX: Added href.endsWith
            loadVirtualCSS(href);
          }
        });
        doc.querySelectorAll('script[src]').forEach(script => {
          const src = script.getAttribute('src');
          if (src && (src.endsWith('.js') || src.endsWith('.ts'))) {
            loadVirtualJS(src);
          }
        });
      } 
      
      function loadVirtualPage(filename) {
        const content = window.__virtualHtmlFiles__[filename];
        if (!content) {
          console.error(' HTML not found:', filename);
          return;
        }
        window.__currentPage__ = filename;
        console.log(' Loading:', filename);
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        
        document.body.innerHTML = doc.body.innerHTML; 
        
        loadExternalResources(content);
    
        attachLinkListeners();
      }
      
      function attachLinkListeners() {
        document.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.endsWith('.html')) {
              e.preventDefault();
              loadVirtualPage(href);
            }
          });
        });
      }
      
      console.log("Virtual page system initialized.");
      loadVirtualPage(window.__currentPage__);
    `;


    const encodedScript = btoa(unescape(encodeURIComponent(rawScriptContent)));

    const resourceLoadingScript = `
      (function() {
        try {
          const encoded = '${encodedScript}';
          const decoded = decodeURIComponent(escape(atob(encoded)));
          eval(decoded);
        } catch(e) {
          console.error('Failed to decode and run virtual script:', e);
        }
      })();
    `;
    
    const mainHtml = mainHtmlFile.content;
    const hasFullHtml = mainHtml.includes('<!DOCTYPE') || mainHtml.includes('<html');
    
    let combinedCode;
    
    if (hasFullHtml) {
      const bodyCloseIndex = mainHtml.lastIndexOf('</body>');
      
      if (bodyCloseIndex !== -1) {
        const parts = [
          mainHtml.slice(0, bodyCloseIndex),
          '<script>',
          resourceLoadingScript, 
          '</script>',
          mainHtml.slice(bodyCloseIndex)
        ];
        combinedCode = parts.join('');
      } else {
        combinedCode = [mainHtml, '<script>', resourceLoadingScript, '</script>'].join('');
      }
    } else {
      const parts = [
        '<!DOCTYPE html>\n',
        '<html lang="en">\n',
        '<head>\n',
        '  <meta charset="UTF-8">\n',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n',
        '  <title>Preview</title>\n',
        '</head>\n',
        '<body>\n',
        mainHtml,
        '\n<script>\n',
        resourceLoadingScript, 
        '\n</script>\n',
        '</body>\n',
        '</html>'
      ];
      combinedCode = parts.join('');
    }
    
    setOutputCode(combinedCode);
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

  if (!projectId) {
    alert("No project available!");
    return;
  }
  
  setProjects(projects.map(project => {
    if (project.id === projectId) {
      if (folderId) {
        return {
          ...project,
          folders: project.folders.map(folder => {
            if (folder.id === folderId) {
              return {
                ...folder,
                files: [...folder.files, newFile]
              };
            }
            return folder;
          })
        };
      }
      
      return {
        ...project,
        files: [...project.files, newFile]
      };
    }
    return project;
  }));
  
  setTargetProjectId(null);
  setTargetFolderId(null);
  
  // ✅ ADD: Add new file to open tabs
  setOpenTabs([...openTabs, newFile.id]);
  setActiveTab(newFile.id);
  console.log('New file created:', newFile);
};

  const deleteFiles = (fileId) => {
  const allFiles = getAllFiles();
  
  if (allFiles.length === 1) {
    alert("Can't delete the last file");
    return;
  }

  const fileToDelete = allFiles.find(f => f.id === fileId);
  if (!fileToDelete) return;
  
 
  handleFileDelete(fileToDelete.projectId, fileToDelete.folderId, fileId);
};

    
return (
  <div className={`${isDark ? "dark" : ""} h-screen flex flex-col`}>
    <Header
      isDark={isDark}
      onToggleTheme={() => setIsDark(!isDark)}
      onMenuOpen={() => setIsMobileMenuOpen(true)}
      onRunCode={handleRunCode}
      onIncreaseFontSize={increaseFontSize}
      onDecreaseFontSize={decreaseFontSize}
      onSaveCode={handleSaveCode}
      onFormatCode={handleFormatCode}
      isAutoSaveEnabled={isAutoSaveEnabled}
      onToggleAutoSave={toggleAutoSave}
      onShareCode={handleShareCode}
    />
    
    {shareCode && (
      <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
        <span className="font-semibold">✓</span>
        <span>Shareable URL copied to clipboard!</span>
      </div>
    )}

    <MobileTabs
      activeView={activeTab}  
      onViewChange={(view) => {
        if (view === 'preview') {
          setActiveMobileView('preview');
        } else {
          setActiveMobileView('editor');
          setActiveTab(view);
        }
      }}
      files={getAllFiles()}
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      isSidebarOpen={isSidebarOpen}
      openTabs={openTabs}
      onCloseTab={handleCloseTab}
    />

    {isMobile ? (
     
      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setIsSidebarOpen(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-64 mt-[104px] md:mt-[60px]" onClick={(e) => e.stopPropagation()}>
              <FileExplorer
                projects={projects}
                onProjectCreate={handleProjectCreate}
                onProjectDelete={handleProjectDelete}
                onFolderCreate={handleFolderCreate}
                onFolderDelete={handleFolderDelete}
                onFileCreate={handleFileCreateInLocation}
                onFileDelete={handleFileDelete}
                onFileSelect={handleFileSelect}
                activeFileId={activeTab}
                isDark={isDark}
              />
            </div>
          </div>
        )}
        
        <EditorPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeMobileView={activeMobileView}
          files={getAllFiles()}
          onCodeChange={handleCodeChange}
          isDark={isDark}
          fontSize={fontSize}
          isAutoSaveEnabled={isAutoSaveEnabled}
          onEditorReady={handleEditorReady}
          onAddFile={() => setIsAddNewFileOpen(true)}
          onDeleteFile={deleteFiles}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen = {isSidebarOpen}
          openTabs={openTabs}
          onCloseTab={handleCloseTab}
        />
        
        <PreviewPanel 
          activeMobileView={activeMobileView}
          files={getAllFiles()}
          outputCode={outputCode}
          fontSize={fontSize}
          pistonOutput={pistonOutput}
        />
      </div>
    ) : (
  
      <div className="flex-1 flex overflow-hidden">
       {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setIsSidebarOpen(false)}>
            <div className="absolute left-0 top-24 bottom-8.5 w-64" onClick={(e) => e.stopPropagation()}>
              <FileExplorer
                projects={projects}
                onProjectCreate={handleProjectCreate}
                onProjectDelete={handleProjectDelete}
                onFolderCreate={handleFolderCreate}
                onFolderDelete={handleFolderDelete}
                onFileCreate={handleFileCreateInLocation}
                onFileDelete={handleFileDelete}
                onFileSelect={handleFileSelect}
                activeFileId={activeTab}
                isDark={isDark}
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <Split
            style={{ height: '100%', width: '100%' }}
            mode="horizontal"
            lineBar
            renderBar={({ onMouseDown, ...props }) => (
              <div
                {...props}
                style={{
                  width: '1px',
                  background: isDark ? '#3a3a3a' : '#d0d0d0',
                  cursor: 'col-resize',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3b82f6';
                  e.currentTarget.style.width = '3px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? '#3a3a3a' : '#d0d0d0';
                  e.currentTarget.style.width = '1px';
                }} 
              >
                <div 
                  onMouseDown={onMouseDown}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            )}
          >
            {/* Editor Panel */}
            <div style={{   
              minWidth: 300, 
              width: '50%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <EditorPanel
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeMobileView={activeMobileView}
                files={getAllFiles()}
                onCodeChange={handleCodeChange}
                isDark={isDark}
                fontSize={fontSize}
                isAutoSaveEnabled={isAutoSaveEnabled}
                onEditorReady={handleEditorReady}
                onAddFile={() => setIsAddNewFileOpen(true)}
                onDeleteFile={deleteFiles}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen = {isSidebarOpen}
                openTabs={openTabs}
                onCloseTab={handleCloseTab}
              />
            </div>

            {/* Preview Panel */}
            <div style={{ 
              minWidth: 300, 
              flex: 1, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <PreviewPanel 
                activeMobileView={activeMobileView}
                files={getAllFiles()}
                outputCode={outputCode}
                fontSize={fontSize}
                pistonOutput={pistonOutput}
              />
            </div>
          </Split>
        </div>
      </div>
    )}

    <MobileMenu
      isDark={isDark}
      onToggleTheme={() => setIsDark(!isDark)}
      isOpen={isMobileMenuOpen}
      onSaveCode={handleSaveCode}
      onFormatCode={handleFormatCode}
      onClose={() => setIsMobileMenuOpen(false)}
      onIncreaseFontSize={increaseFontSize}
      onDecreaseFontSize={decreaseFontSize}
      isAutoSaveEnabled={isAutoSaveEnabled}
      onToggleAutoSave={toggleAutoSave}
      onShareCode={handleShareCode}
    />

    <AddNewFIle
      isOpen={isAddNewFileOpen}
      onClose={() => setIsAddNewFileOpen(false)}
      onCreateFIle={handleFIleCreation}
    />

    <Console
      isConsoleOpen={isConsoleOpen}
      onToggle={() => setIsConsoleOpen(!isConsoleOpen)}
      logs={consoleLogs}
      onClear={handleClearConsole}
    />
  </div>
);
}

export default App;
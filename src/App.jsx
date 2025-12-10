This is my app.jsx code
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import AddNewFIle from "./components/AddNewFIle.jsx";
import MobileTabs from "./components/MobileTabs";
import EditorPanel from "./components/EditorPanel.jsx";
import PreviewPanel from "./components/PreviewPanel";
import MobileMenu from "./components/MobileMenu";
import Split from "@uiw/react-split";
import Console from "./components/Console.jsx";
import FileExplorer from "./components/FIleExplorer.jsx";
import { Terminal } from "lucide-react";
import { getAllFiles} from "./utils/fileHelpers.jsx";
import { useProjectManager } from "./hooks/useProjectManager.jsx";
import { useCodeRunner } from "./hooks/useCodeRunner.jsx";



function App() {
   const {
    projects, setProjects, activeTab, setActiveTab, activeProjectId, 
    openTabs, setOpenTabs, isAddNewFileOpen, setIsAddNewFileOpen,
    handleProjectCreate, handleProjectDelete, handleFolderCreate, handleFolderDelete,
    handleFileCreateInLocation, handleFIleCreation, deleteFiles, handleFileDelete,
    handleCodeChange, handleCloseTab, handleFileSelect
  } = useProjectManager();

  const {
    outputCode, pistonOutput, isRunning, consoleLogs, isConsoleOpen, activeMobileView, setIsMobile,
    setIsConsoleOpen, setConsoleLogs, handleRunCode, handleClearConsole, isMobile, setActiveMobileView
  } = useCodeRunner(projects, activeProjectId, activeTab);



  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [fontSize, setFontSize] = useState(14);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [activeMobileView, setActiveMobileView] = useState("editor"); // Default to editor
  const [editorInstance, setEditorInstance] = useState(null); 
  const [shareCode, setShareCode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 



   const onRunCodeWrapper = async () => {
      const result = await handleRunCode();
      if (result === "preview" && isMobile) {
          setActiveMobileView("preview");
      }
   }
   
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


    // useEffect to catch logs coming from the iframe

    useEffect ( () => {
      const handleIframeMessage = (event) => {
        if (event.data && event.data.source  === 'iframe-console') {
          const { type, message } = event.data;

          setConsoleLogs(prev => [...prev, {
            message: message,
            type: type,
            timestamp: new Date().toLocaleTimeString()
          }]);

          if (type === 'error') setIsConsoleOpen(true);
        }
      };

      window.addEventListener('message', handleIframeMessage);
      return () => window.removeEventListener('message', handleIframeMessage);
    }, []); 


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
  
    
return (
  <div className={`${isDark ? "dark" : ""} h-screen flex flex-col`}>
    <Header
      isDark={isDark}
      onToggleTheme={() => setIsDark(!isDark)}
      onMenuOpen={() => setIsMobileMenuOpen(true)}
      onRunCode={onRunCodeWrapper}
      isRunning={isRunning}
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
      files={getAllFiles(projects)}
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
          files={getAllFiles(projects)}
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
          files={getAllFiles(projects)}
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
                files={getAllFiles(projects)}
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

            
            <div style={{ 
              minWidth: 300, 
              flex: 1, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <PreviewPanel 
                activeMobileView={activeMobileView}
                files={getAllFiles(projects)}
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
      fontSize={fontSize}
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

    {!isConsoleOpen && (
      <button 
      onClick={() => setIsConsoleOpen(!isConsoleOpen)}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-50 transition-all ${
        isDark
          ? 'bg-gray-800 hover:bg-gray-700 text-white'
          : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
      }`}
      title="Toggle Console"
    >
      <Terminal size={20}/>
      {consoleLogs.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {consoleLogs.length}
        </span>
      )}
    </button>
    )}
  </div>
);
}

export default

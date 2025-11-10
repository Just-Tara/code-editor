
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import MobileTabs from "./components/MobileTabs";
import EditorPanel from "./components/EditorPanel.jsx";
import PreviewPanel from "./components/PreviewPanel";
import MobileMenu from "./components/MobileMenu";

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("html");
  const [activeMobileView, setActiveMobileView] = useState("html");
  const [outputCode, setOutputCode] = useState("");

  const [files, setFiles] = useState({
    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>',
    css: 'body {\n  font-family: Arial;\n  padding: 20px;\n}\n\nh1 {\n  color: #007acc;\n}',
    js: 'console.log("Hello from JavaScript!");\n\ndocument.addEventListener("DOMContentLoaded", () => {\n  console.log("Page loaded!");\n});'
  });
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    try{
      const savedFiles = localStorage.getItem("code-files");
        if (savedFiles) {
          const parsedFiles = JSON.parse(savedFiles);
          setFiles(parsedFiles);
          console.log("successfully loade the saved files");
        } else{
          console.log("No saved files found");
        }
    }catch(error) {
      console.log("Failed to load saved files", error)
    }

  }, [])

  const increaseFontSize = () => {
   setFontSize(prev => Math.min(prev + 2, 24));
  }

  const decreaseFontSize = () => {
   setFontSize(prev => Math.max(prev - 2, 10));
  }

  
  const handleCodeChange = (newCode) => {
    setFiles(prev => ({
      ...prev,
      [activeTab]: newCode
    }));
  };

  const handleSaveCode = () => {
    try{
      localStorage.setItem('code-files', JSON.stringify(files));
        console.log("code saved successfully!");
    } catch (error){
        console.log("failed to save:", error)
    }
  }

  const handleRunCode = () => {
   console.log("Running code...");
   console.log(files);
      const combinedCode = `
   <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          ${files.css}
        </style>
      </head>
      <body>
        ${files.html}
        <script>
          ${files.js}
        </script>
      </body>
    </html>
  `;
      setOutputCode(combinedCode);
  }

  return (
    <div className={`${isDark ? "dark" : ""} h-screen flex flex-col`}>
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onMenuOpen={() => setIsMobileMenuOpen(true)}
        onRunCode={handleRunCode}
        onIncreaseFontSize = {increaseFontSize}
        onDecreaseFontSize = {decreaseFontSize}
        onSaveCode = {handleSaveCode}
      />

       <MobileTabs
         activeView={activeMobileView}
         onViewChange={(view) => {
            setActiveMobileView(view);
            if (view !== "preview") setActiveTab(view); 
         }}
         />

      <div className="flex-1 flex overflow-hidden">
        <EditorPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeMobileView={activeMobileView}
          files={files}
          onCodeChange={handleCodeChange}
          isDark={isDark}
          fontSize={fontSize}
        />
        <PreviewPanel 
          activeMobileView={activeMobileView}
          files={files}
          outputCode={outputCode}
          fontSize={fontSize}
        />
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onIncreaseFontSize = {increaseFontSize}
        onDecreaseFontSize = {decreaseFontSize}
      />
    </div>
  );
}

export default App;
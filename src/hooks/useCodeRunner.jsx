import { useState } from "react";
import { excutePistonCode } from "../utils/PistonApi";
import { getFilesFromProject, getActiveFile } from "../utils/fileHelpers";
import { PISTON_LANGUAGES } from "../constants/pistonConfig";
import { generatePreview } from "../utils/previewGenerator";
import { useConsole } from "./useConsole"; 

export const useCodeRunner = (projects, activeProjectId, activeTab) => {
  const [outputCode, setOutputCode] = useState("");
  const [pistonOutput, setPistonOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  

  const { consoleLogs, isConsoleOpen, setIsConsoleOpen, clearConsole, executeJavaScript } = useConsole();

  const handleRunCode = async () => {
    setIsRunning(true);
    setPistonOutput(null);

    const currentActiveFile = getActiveFile(projects, activeTab);
    
    if (['javascript', 'typescript'].includes(currentActiveFile.language)) {
      setOutputCode("");
      await new Promise(r => setTimeout(r, 500));
      executeJavaScript(currentActiveFile.content, currentActiveFile.language);
      setIsRunning(false);
      return; 
    }

    const projectFiles = getFilesFromProject(projects, activeProjectId);
    const hasWebFiles = projectFiles.some(f => ['html', 'css'].includes(f.language));

    if (hasWebFiles && ['html', 'css'].includes(currentActiveFile.language)) {
      await new Promise(r => setTimeout(r, 500));
      
      const html = generatePreview(projects, activeProjectId);
      setOutputCode(html);
      
      clearConsole();
      setIsRunning(false);
      return "preview"; 
    }

    
    if (PISTON_LANGUAGES.includes(currentActiveFile.language)) {
      setOutputCode("");
      try {
        const result = await excutePistonCode(currentActiveFile.language, currentActiveFile.content);
        const { run: { stdout, output, stderr, code } } = result;
        const combinedOutput = (stdout || output || "") + (stderr || "");

        setPistonOutput({
          type: code === 0 && !stderr ? 'success' : 'error',
          content: combinedOutput.trim() || `Execution finished.`,
          language: currentActiveFile.language
        });
      } catch (error) {
        setPistonOutput({
          type: 'error',
          content: `API Error: ${error.message}`,
          language: currentActiveFile.language
        });
      }
      setIsRunning(false);
      return "preview";
    }

    setIsRunning(false);
  };

  return {
    outputCode,
    pistonOutput,
    isRunning,
    consoleLogs,
    isConsoleOpen,
    setIsConsoleOpen,
    handleRunCode,
    handleClearConsole: clearConsole
  };
};
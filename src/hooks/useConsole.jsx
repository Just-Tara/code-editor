import { useState, useEffect } from "react";

export const useConsole = () => {
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const clearConsole = () => setConsoleLogs([]);

  const addLog = (message, type = 'log') => {
    setConsoleLogs(prev => [...prev, {
      message, type, timestamp: new Date().toLocaleTimeString()
    }]);
  };

  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data && event.data.source === 'iframe-console') {
        const { type, message } = event.data;
        addLog(message, type);
        if (type === 'error') setIsConsoleOpen(true);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  const executeJavaScript = (code, language) => {
    clearConsole();
    setIsConsoleOpen(true);

    try {
      const customConsole = {
        log: (...args) => addLog(args.join(' '), 'log'),
        error: (...args) => addLog(args.join(' '), 'error'),
        warn: (...args) => addLog(args.join(' '), 'warn'),
        info: (...args) => addLog(args.join(' '), 'info'),
      };

      let executableCode = code;
      if (language === 'typescript') {
        executableCode = code
          .replace(/:\s*\w+(\[\])?/g, '')
          .replace(/interface\s+\w+\s*{[^}]*}/g, '')
          .replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
      }

      const func = new Function('console', executableCode);
      func(customConsole);
      addLog('Execution completed', 'info');
    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
    }
  };

  return { consoleLogs, isConsoleOpen, setIsConsoleOpen, clearConsole, executeJavaScript };
};
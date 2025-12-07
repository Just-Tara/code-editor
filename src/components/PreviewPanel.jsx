import React, { useState } from 'react';
import { FileCode, Monitor, Tablet, Smartphone, Terminal } from 'lucide-react';

function PreviewPanel({ activeMobileView, files, outputCode, fontSize, pistonOutput  }) {
  const [deviceMode, setDeviceMode] = useState('desktop');
  
  const hasHtmlFiles = files.some(f => f.language === 'html');
  
  
  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };
  
  const isPistonResult = !!pistonOutput;

  return (
    <div
      className={`flex-1 md:flex flex-col ${
        activeMobileView !== 'preview' ? 'hidden md:flex' : 'flex'
      }`}
    >
      <div className="bg-gray-800 border-b border-gray-700 px-4 md:py-[9px] py-2 flex items-center justify-between">
        <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
          {isPistonResult ? (
            <>
              <Terminal size={16} /> Api OutPut
            </>
          ) : (
            <>
              <FileCode size={16}/> Live Preview
            </>
          )}
        </span>
        {!isPistonResult && (
          <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded transition ${
              deviceMode === 'desktop'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded transition ${
              deviceMode === 'tablet'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
            title="Tablet View (768x1024)"
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded transition ${
              deviceMode === 'mobile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
            title="Mobile View (375x667)"
          >
            <Smartphone size={16} />
          </button>
        </div>
        )}
      </div>

      <div className={`flex-1 bg-gray-100 overflow-auto flex items-start justify-center ${
        deviceMode === 'desktop' && !isPistonResult ? '' : 'p-4'
      }`}>
        {isPistonResult ? (
                    <div className="w-full h-full p-4">
                        <h2 className="text-xl font-bold mb-2">
                    
                            {pistonOutput.type === 'error' ? '❌ Execution Error' : 'Output'} 
                            <span className="text-sm font-normal ml-2 opacity-70 text-gray-500">
                               
                                ({pistonOutput.language.toUpperCase()}) 
                            </span>
                        </h2>
                        <pre 
                            className={`p-4 rounded-lg whitespace-pre-wrap font-mono text-sm overflow-auto max-h-full ${
                                pistonOutput.type === 'error' 
                                    ? 'bg-red-00  dark:bg-red-900/30 text-red-700 border border-red-800'
                                    : 'bg-white text-gray-200 dark:bg-zinc-800  border border-gray-700'
                            }`}
                        >
                            {pistonOutput.content} 
                        </pre>
                    </div>
                ) : (
                    
                   !outputCode || !hasHtmlFiles ? (
          <div className="h-full w-full flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400 p-8">
              <FileCode size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Preview Available</p>
              <p className="text-sm">
                {!hasHtmlFiles 
                  ? 'Add an HTML file to see the live preview'
                  : 'Click "Run Code" to see the preview'
                }
              </p>
            </div>
          </div>
        ) : (
          <div 
            className="bg-white transition-all duration-300 shadow-lg"
            style={{
              width: deviceSizes[deviceMode].width,
              height: deviceSizes[deviceMode].height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <iframe 
              srcDoc={outputCode} 
              title="Live Preview" 
              className="w-full h-full border-0" 
              sandbox="allow-scripts allow-forms allow-modals allow-popups"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>
        )                

      )}
 
      </div>
    </div>
  );
}

export default PreviewPanel;
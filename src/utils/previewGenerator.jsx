import { getFilesFromProject } from "./fileHelpers";

const transpileTs = (tsCode) => tsCode.replace(/const\s+(\w+):\s*string\s*=\s*(.*?);/g, 'const $1 = $2;');

export const generatePreview = (projects, activeProjectId) => {
  const allFiles = getFilesFromProject(projects, activeProjectId);

  const htmlFiles = allFiles.filter(f => f.language === 'html');
  const cssFiles = allFiles.filter(f => f.language === 'css'); 
  const jsFiles = allFiles.filter(f => f.language === 'javascript' || f.language === 'typescript');

  let mainHtmlFile = htmlFiles.find(f => f.name.toLowerCase().includes('index')) || htmlFiles[0];

  if (!mainHtmlFile) return "<h1>No HTML file found</h1>";

  const virtualHtmlFiles = {};
  const virtualCssFiles = {};
  const virtualJsFiles = {};

  const getFilePath = (file) => {
    if (file.folderId) {
      const project = projects.find(p => p.id === file.projectId);
      const folder = project?.folders.find(f => f.id === file.folderId);
      if (folder) return `${folder.name}/${file.name}`;
    }
    return file.name;
  };

  htmlFiles.forEach(file => {
    const path = getFilePath(file);
    virtualHtmlFiles[path] = file.content;
    virtualHtmlFiles[file.name] = file.content;
  });

  cssFiles.forEach(file => {
    const path = getFilePath(file);
    virtualCssFiles[path] = file.content;
    virtualCssFiles[file.name] = file.content;
    virtualCssFiles[file.name.replace(/\.css$/, '')] = file.content;
  });

  jsFiles.forEach(file => {
    let jsContent = file.language === 'typescript' ? transpileTs(file.content) : file.content;
    const path = getFilePath(file);
    virtualJsFiles[path] = jsContent;
    virtualJsFiles[file.name] = jsContent;
    virtualJsFiles[file.name.replace(/\.(js|ts)$/, '')] = jsContent;
  });

  const consoleInterceptorScript = `
    <script>
      (function() {
        const oldLog = console.log;
        const oldError = console.error;
        const oldWarn = console.warn;
        const oldInfo = console.info;
        function sendToParent(type, args) {
          try {
            const message = args.map(arg => {
              if (typeof arg === 'object') {
                try { return JSON.stringify(arg); } catch(e) { return '[Object]'; }
              }
              return String(arg);
            }).join(' ');
            window.parent.postMessage({ source: 'iframe-console', type, message }, '*');
          } catch (e) {}
        }
        console.log = function(...args) { sendToParent('log', args); oldLog.apply(console, args); };
        console.error = function(...args) { sendToParent('error', args); oldError.apply(console, args); };
        console.warn = function(...args) { sendToParent('warn', args); oldWarn.apply(console, args); };
        console.info = function(...args) { sendToParent('info', args); oldInfo.apply(console, args); };
      })();
    </script>
  `;

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
          // 3. Simplified Regex: Only strip .css
          const nameWithoutExt = filename.replace(/\\.css$/, '');
          content = window.__virtualCssFiles__[nameWithoutExt];
        }
        if (!content || window.__loadedResources__.css.includes(filename)) return;
        window.__loadedResources__.css.push(filename);
        const style = document.createElement('style');
        style.setAttribute('data-virtual-css', filename);
        style.textContent = content;
        document.head.appendChild(style);
      }
      
      function loadVirtualJS(filename) {
        let content = window.__virtualJsFiles__[filename];
        if (!content) {
           const nameWithoutExt = filename.replace(/\\.(js|ts)$/, '');
           content = window.__virtualJsFiles__[nameWithoutExt];
        }
        if (!content || window.__loadedResources__.js.includes(filename)) return;
        window.__loadedResources__.js.push(filename);
        try {
           const script = document.createElement('script');
           script.setAttribute('data-virtual-js', filename);
           script.textContent = content;
           document.body.appendChild(script);
        } catch(e) { console.error("Error loading JS", e); }
      }

      function loadExternalResources(html) {
         const parser = new DOMParser();
         const doc = parser.parseFromString(html, 'text/html');
         doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
            const href = l.getAttribute('href');
            // 4. Simplified Check: Only check for .css
            if(href && href.endsWith('.css')) loadVirtualCSS(href);
         });
         doc.querySelectorAll('script[src]').forEach(s => {
            const src = s.getAttribute('src');
            if(src && (src.endsWith('.js') || src.endsWith('.ts'))) loadVirtualJS(src);
         });
      }

      function loadVirtualPage(filename) {
         const content = window.__virtualHtmlFiles__[filename];
         if(!content) return;
         window.__currentPage__ = filename;
         const parser = new DOMParser();
         const doc = parser.parseFromString(content, 'text/html');
         document.body.innerHTML = doc.body.innerHTML;
         loadExternalResources(content);
         document.querySelectorAll('a').forEach(l => {
            l.addEventListener('click', function(e) {
               const href = this.getAttribute('href');
               if(href && href.endsWith('.html')) {
                  e.preventDefault();
                  loadVirtualPage(href);
               }
            });
         });
      }
      loadVirtualPage(window.__currentPage__);
  `;

  const encodedScript = btoa(unescape(encodeURIComponent(rawScriptContent)));
  const resourceLoadingScript = `
    (function() {
      try {
        const encoded = '${encodedScript}';
        const decoded = decodeURIComponent(escape(atob(encoded)));
        eval(decoded);
      } catch(e) { console.error('Virtual script error:', e); }
    })();
  `;

  const mainHtml = mainHtmlFile.content;
  if (mainHtml.includes('<!DOCTYPE') || mainHtml.includes('<html')) {
    const bodyCloseIndex = mainHtml.lastIndexOf('</body>');
    if (bodyCloseIndex !== -1) {
        return mainHtml.slice(0, bodyCloseIndex) + consoleInterceptorScript + '<script>' + resourceLoadingScript + '</script>' + mainHtml.slice(bodyCloseIndex);
    }
    return mainHtml + consoleInterceptorScript + '<script>' + resourceLoadingScript + '</script>';
  } else {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview</title></head>
      <body>
        ${mainHtml}
        ${consoleInterceptorScript}
        <script>${resourceLoadingScript}</script>
      </body>
      </html>
    `;
  }
};
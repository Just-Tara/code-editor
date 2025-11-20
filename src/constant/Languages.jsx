
import { 
  FileCode, Palette, Zap, FileType, Code2, Braces, FileText,
  Database, Terminal, Coffee, Hash, FileJson, Settings, Box, Code, Binary
} from 'lucide-react';

export const LANGUAGES = [

  {
    id: 'html',
    name: 'HTML',
    icon: FileCode,
    extension: '.html',
    monacoLanguage: 'html',
    color: '#e34c26',
    category: 'Web'
  },
  {
    id: 'css',
    name: 'CSS',
    icon: Palette,
    extension: '.css',
    monacoLanguage: 'css',
    color: '#264de4',
    category: 'Web'
  },
  {
    id: 'scss',
    name: 'SCSS',
    icon: Palette,
    extension: '.scss',
    monacoLanguage: 'scss',
    color: '#c6538c',
    category: 'Web'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: Zap,
    extension: '.js',
    monacoLanguage: 'javascript',
    color: '#f7df1e',
    category: 'Web'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: FileType,
    extension: '.ts',
    monacoLanguage: 'typescript',
    color: '#3178c6',
    category: 'Web'
  },


  {
    id: 'python',
    name: 'Python',
    icon: Hash,
    extension: '.py',
    monacoLanguage: 'python',
    color: '#3776ab',
    category: 'Backend'
  },
  {
    id: 'java',
    name: 'Java',
    icon: Coffee,
    extension: '.java',
    monacoLanguage: 'java',
    color: '#007396',
    category: 'Backend'
  },
  {
    id: 'php',
    name: 'PHP',
    icon: Code2,
    extension: '.php',
    monacoLanguage: 'php',
    color: '#777bb4',
    category: 'Backend'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: Hash,
    extension: '.rb',
    monacoLanguage: 'ruby',
    color: '#cc342d',
    category: 'Backend'
  },
  {
    id: 'go',
    name: 'Go',
    icon: Code2,
    extension: '.go',
    monacoLanguage: 'go',
    color: '#00add8',
    category: 'Backend'
  },

  {
    id: 'c',
    name: 'C',
    icon: Binary,
    extension: '.c',
    monacoLanguage: 'c',
    color: '#555555',
    category: 'Systems'
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: Binary,
    extension: '.cpp',
    monacoLanguage: 'cpp',
    color: '#00599c',
    category: 'Systems'
  },

  {
    id: 'json',
    name: 'JSON',
    icon: Braces,
    extension: '.json',
    monacoLanguage: 'json',
    color: '#292929',
    category: 'Data'
  },
  {
    id: 'xml',
    name: 'XML',
    icon: FileCode,
    extension: '.xml',
    monacoLanguage: 'xml',
    color: '#0060ac',
    category: 'Data'
  },
  {
    id: 'yaml',
    name: 'YAML',
    icon: Box,
    extension: '.yaml',
    monacoLanguage: 'yaml',
    color: '#cb171e',
    category: 'Data'
  },


  {
    id: 'sql',
    name: 'SQL',
    icon: Database,
    extension: '.sql',
    monacoLanguage: 'sql',
    color: '#e38c00',
    category: 'Database'
  },

 
  {
    id: 'shell',
    name: 'Shell Script',
    icon: Terminal,
    extension: '.sh',
    monacoLanguage: 'shell',
    color: '#89e051',
    category: 'Shell'
  },

 
  {
    id: 'markdown',
    name: 'Markdown',
    icon: FileText,
    extension: '.md',
    monacoLanguage: 'markdown',
    color: '#083fa1',
    category: 'Markup'
  }
];

export const getDefaultContent = (languageId) => {
  const templates = {
    html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>',
    
    css: '/* New CSS File */\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}',
    
    scss: '// SCSS File\n$primary-color: #007acc;\n\nbody {\n  color: $primary-color;\n}',
    
    javascript: '// JavaScript File\nconsole.log("Hello from JavaScript!");',
    
    typescript: '// TypeScript File\nconst message: string = "Hello TypeScript!";\nconsole.log(message);',
    
    python: '# Python File\nprint("Hello from Python!")',
    
    java: '// Java File\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}',
    
    php: '<?php\n// PHP File\necho "Hello World!";\n?>',
    
    ruby: '# Ruby File\nputs "Hello World!"',
    
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello World!")\n}',
    
    c: '#include <stdio.h>\n\nint main() {\n  printf("Hello World!\\n");\n  return 0;\n}',
    
    cpp: '#include <iostream>\n\nint main() {\n  std::cout << "Hello World!" << std::endl;\n  return 0;\n}',
    
    json: '{\n  "name": "My Project",\n  "version": "1.0.0",\n  "description": "New JSON file"\n}',
    
    xml: '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <message>Hello World</message>\n</root>',
    
    yaml: '# YAML File\nname: My Project\nversion: 1.0.0\ndescription: New YAML file',
    
    sql: '-- SQL Query\nSELECT * FROM users\nWHERE active = true\nORDER BY created_at DESC;',
    
    shell: '#!/bin/bash\n# Shell Script\necho "Hello World!"',
    
    markdown: '# New Markdown File\n\n## Introduction\n\nStart writing your documentation here...\n\n### Features\n\n- Feature 1\n- Feature 2\n- Feature 3'
  };
  
  return templates[languageId] || '// New File\n';
};


export const getLanguageById = (id) => {
  return LANGUAGES.find(lang => lang.id === id);
};
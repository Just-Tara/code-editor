
const PISTON_LANGUAGE_MAP = {
    'python': { language: 'python', version: '3.10.0' },
    'java': { language: 'java', version: 'openjdk-19.0.1' },
    'php': { language: 'php', version: '8.2.3' },
    'c': { language: 'c', version: '10.2.0' },
    'cpp': { language: 'cpp', version: '10.2.0' },
    'go': { language: 'go', version: '1.20.1' },
    'ruby': { language: 'ruby', version: '3.0.0' },
    'shell': { language: 'bash', version: '5.1.16' }, 
    'javascript': { language: 'javascript', version: '18.15.0' },
    'typescript': { language: 'typescript', version: '5.0.3' }
};


export const excutePistonCode = async (languageId, code) => {
    const langConfig = PISTON_LANGUAGE_MAP[languageId];
    if (!langConfig) {
        throw new Error(`Unsupported language: ${languageId}`);
    }
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  
            language: langConfig.language,
            version: langConfig.version,
            files: [{
                name: `main.${languageId}`,
                content: code
            }],
        })
    });

   
    if (!response.ok) {
        throw new Error(`Piston API error: ${response.statusText}`);
    }

    
    return await response.json();
};

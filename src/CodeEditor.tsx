import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor: React.FC = () => {
    const editorRef = useRef<any>(null);
    const [language, setLanguage] = useState<string>('javascript');
    const [output, setOutput] = useState<string>(''); // For displaying the output

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
        editor.setValue('// Start coding here...');
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    const handleRunClick = async () => {
        const code = editorRef.current.getValue(); // Get code from editor
    
        try {
            // Send code and language to backend for execution
            const response = await fetch('http://localhost:5000/api/run-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }), // Send language with code
            });
    
            const data = await response.json();
            setOutput(data.output || data.error || 'No output.');
        } catch (error) {
            console.error('Error running code:', error);
            setOutput('Error: Could not reach the server.');
        }
    };
    

    return (
        <div className="code-editor">
            <div className="editor-header">
                <label htmlFor="language-select">Select Language:</label>
                <select
                    id="language-select"
                    value={language}
                    onChange={handleLanguageChange}
                >
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="csharp">C#</option>
                </select>
            </div>

            <Editor
                height="400px"
                language={language}
                theme="vs-dark"
                onMount={handleEditorDidMount}
            />

            <button className="run-button" onClick={handleRunClick}>
                Run
            </button>

            <div className="terminal-output">
                <h3>Terminal</h3>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;

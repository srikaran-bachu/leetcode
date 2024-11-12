// src/CodeEditor.tsx
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor: React.FC = () => {
    const editorRef = useRef<any>(null);
    const [language, setLanguage] = useState<string>('javascript');

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
        editor.setValue('// Start coding here...');
    };

    const handleEditorChange = (value: string | undefined) => {
        console.log(value);
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    const handleRunClick = () => {
        console.log('Run button clicked');
        // Placeholder: This function does nothing for now
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
                height="100%"
                language={language}
                theme="vs-dark"
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
            />

            <button className="run-button" onClick={handleRunClick}>
                Run
            </button>
        </div>
    );
};

export default CodeEditor;

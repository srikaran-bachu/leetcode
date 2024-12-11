// src/App.tsx
import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import Chatbot from './Chatbot';
import './App.css';

const App: React.FC = () => {
    const [editorCode, setEditorCode] = useState<string>(''); // Track the code in the editor

    return (
        <div className="app-container">
            <div className="chatbot-container">
                {/* Pass editorCode to Chatbot */}
                <Chatbot editorCode={editorCode} />
            </div>
            <div className="code-editor-container">
                {/* Update the editor code via the onCodeChange prop */}
                <CodeEditor onCodeChange={setEditorCode} />
            </div>
        </div>
    );
};

export default App;

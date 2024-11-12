// src/App.tsx
import React from 'react';
import CodeEditor from './CodeEditor';
import Chatbot from './Chatbot';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <div className="chatbot-container">
                <Chatbot />
            </div>
            <div className="code-editor-container">
                <CodeEditor />
            </div>
        </div>
    );
};

export default App;

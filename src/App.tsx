// src/App.tsx
import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Chatbot from './Chatbot';
import './App.css';

const App: React.FC = () => {
    const [editorCode, setEditorCode] = useState<string>(''); // Track the code in the editor
    const [question, setQuestion] = useState<{ id: number; title: string; description: string } | null>(null); // Track the current question
    
    // Fetch the question from the backend (or use a static example for now)
    useEffect(() => {
        // Replace with your actual API call to fetch a question
        fetch('http://localhost:5000/api/question/1') // Replace '1' with the desired question ID
            .then((response) => response.json())
            .then((data) => setQuestion(data)) // Set the fetched question
            .catch((error) => console.error('Error fetching question:', error));
    }, []);
    const handleQuestionChange = (selectedQuestion: { id: number; title: string; description: string }) => {
        setQuestion(selectedQuestion);
    };
    // Show a loading state until the question is loaded
    if (!question) {
        return <div>Loading question...</div>;
    }

    return (
        <div className="app-container">
            <div className="chatbot-container">
                {/* Pass editorCode and question to Chatbot */}
                <Chatbot editorCode={editorCode} question={question} />
            </div>
            <div className="code-editor-container">
                {/* Update the editor code via the onCodeChange prop */}
                <CodeEditor onCodeChange={setEditorCode} onQuestionChange={handleQuestionChange} />
            </div>
        </div>
    );
};

export default App;

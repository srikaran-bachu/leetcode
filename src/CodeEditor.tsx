// src/CodeEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

interface CodeEditorProps {
    onCodeChange: (code: string) => void; // Prop to notify changes in code
    onQuestionChange: (question: { id: number; title: string; description: string }) => void; // Notify parent when question changes
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onCodeChange, onQuestionChange }) => {
    const editorRef = useRef<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const [language, setLanguage] = useState<string>('python'); // Default to Python
    const [output, setOutput] = useState<string>('Welcome to the terminal.\n'); // Default terminal output

    // Fetch questions from the backend on page load
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/questions');
                if (!response.ok) throw new Error(`Failed to fetch questions: ${response.statusText}`);
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, []);

    const handleQuestionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const questionId = parseInt(event.target.value, 10);
        const selected = questions.find((q) => q.id === questionId);
        setSelectedQuestion(selected || null);

        // Notify the parent component about the selected question
        if (selected) {
            onQuestionChange(selected);
            setOutput((prevOutput) => `${prevOutput}\nQuestion selected: ${selected.title}\n`);
        }

        // Pre-fill the editor with starter code
        if (editorRef.current && selected && selected.starterCode) {
            editorRef.current.setValue(selected.starterCode);
        }
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
        if (event.target.value !== 'python') {
            setOutput((prevOutput) => `${prevOutput}\nWarning: Test cases only work for Python.`);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            onCodeChange(value); // Notify parent about the code change
        }
    };

    const handleRunClick = async () => {
        const code = editorRef.current.getValue();
        if (!selectedQuestion) {
            setOutput((prevOutput) => `${prevOutput}\nPlease select a question first.`);
            return;
        }
        if (language !== 'python') {
            setOutput((prevOutput) => `${prevOutput}\nTest cases are only available for Python at the moment.`);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/test-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    test_cases: selectedQuestion.test_cases,
                }),
            });

            const results = await response.json();
            const resultOutput = results
                .map(
                    (r: any, i: number) =>
                        `Test Case ${i + 1}: ${r.passed ? '✅ Passed' : '❌ Failed'}
                        Input: ${r.input}
                        Expected: ${r.expected_output}
                        Actual: ${r.actual_output}\n`
                )
                .join('\n');
            setOutput((prevOutput) => `${prevOutput}\n${resultOutput}`);
        } catch (error) {
            console.error('Error running code:', error);
            setOutput((prevOutput) => `${prevOutput}\nError: Could not reach the server.`);
        }
    };

    return (
        <div className="code-editor">
            {/* Dropdown for selecting a question */}
            <div className="dropdown">
                <label htmlFor="question-select">Select Question:</label>
                <select id="question-select" onChange={handleQuestionSelect} defaultValue="">
                    <option value="" disabled>
                        -- Select a Question --
                    </option>
                    {questions.map((q) => (
                        <option key={q.id} value={q.id}>
                            {q.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display selected question details */}
            {selectedQuestion && (
                <div className="question">
                    <h2 style={{ color: 'white' }}>{selectedQuestion.title}</h2>
                    <p style={{ color: 'white' }}>{selectedQuestion.description}</p>
                </div>
            )}

            {/* Dropdown for selecting a language */}
            <div className="dropdown">
                <label htmlFor="language-select">Select Language:</label>
                <select id="language-select" value={language} onChange={handleLanguageChange}>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                </select>
            </div>

            {/* Code editor */}
            <Editor
                height="300px"
                language={language}
                theme="vs-dark"
                onMount={(editor) => (editorRef.current = editor)}
                onChange={handleEditorChange}
            />

            {/* Run button */}
            <button className="run-button" onClick={handleRunClick}>
                Run
            </button>

            {/* Terminal output */}
            <div className="terminal-container">
               <div className="terminal-output">
                    <pre>{output}</pre>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;

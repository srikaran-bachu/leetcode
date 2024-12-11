// src/CodeEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

interface CodeEditorProps {
    onCodeChange: (code: string) => void; // Prop to notify changes in code
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onCodeChange }) => {
    const editorRef = useRef<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const [language, setLanguage] = useState<string>('python'); // Default to Python
    const [output, setOutput] = useState<string>(''); // For terminal output

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
        setOutput(''); // Clear the terminal when a new question is selected
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
        if (event.target.value !== 'python') {
            setOutput('Warning: Test cases only work for Python.');
        } else {
            setOutput('');
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
            setOutput('Please select a question first.');
            return;
        }
        if (language !== 'python') {
            setOutput('Test cases are only available for Python at the moment.');
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
            setOutput(resultOutput);
        } catch (error) {
            console.error('Error running code:', error);
            setOutput('Error: Could not reach the server.');
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
                height="300px" // Adjusted height
                language={language}
                theme="vs-dark"
                onMount={(editor) => (editorRef.current = editor)}
                onChange={handleEditorChange} // Trigger on every change
            />

            {/* Run button */}
            <button className="run-button" onClick={handleRunClick}>
                Run
            </button>

            {/* Terminal output */}
            <div className="terminal-output">
                <h3>Terminal</h3>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;

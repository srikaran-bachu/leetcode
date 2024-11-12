// src/Chatbot.tsx
import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot: React.FC = () => {
    const [input, setInput] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSendMessage = () => {
        setInput('');
    };

    return (
        <div className="chatbot">
            <div className="chatbot-messages">
                <p>AI: Hello! How can I help you?</p>
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;

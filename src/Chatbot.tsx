import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// Define props type
interface ChatbotProps {
  editorCode: string; // This is the prop passed from App.tsx
}

const Chatbot: React.FC<ChatbotProps> = ({ editorCode }) => {
  const [messages, setMessages] = useState<{ user: string; bot: string | null }[]>([]);
  const [userInput, setUserInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    // Add user message to the chat
    setMessages((prevMessages) => [...prevMessages, { user: userInput, bot: null }]);

    try {
      // Send the message and editor code to the backend
      const response = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput, code: editorCode }),
      });

      const data = await response.json();
      const botMessage = data.response || "Sorry, I couldn't understand that.";

      // Update the chat with the bot response only (not adding the user message again)
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1 ? { ...msg, bot: botMessage } : msg
        )
      );
    } catch (error) {
      console.error('Error communicating with the chatbot API:', error);
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1 ? { ...msg, bot: 'Error: Could not reach the server.' } : msg
        )
      );
    }

    setUserInput(''); // Clear the input field
  };

  // Scroll to the bottom of the chat whenever a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatbot">
      <div ref={chatContainerRef} className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>
              <strong>User:</strong> {msg.user}
            </p>
            {msg.bot && <p><strong>AI:</strong> {msg.bot}</p>}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;

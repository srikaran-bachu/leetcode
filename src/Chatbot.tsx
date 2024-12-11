import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

interface ChatbotProps {
  editorCode: string;
  question: { id: number; title: string; description: string };
}

const Chatbot: React.FC<ChatbotProps> = ({ editorCode, question }) => {
  const [messages, setMessages] = useState<{ user: string; bot: string | null }[]>([]);
  const [userInput, setUserInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    // Add the user's message to the chat
    const userMessage = { user: userInput, bot: null };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userInput,
          code: editorCode,
          question_id: question.id,
        }),
      });

      const data = await response.json();
      const botMessage = data.response || "Sorry, I couldn't understand that.";

      // Add the bot's response as a new message
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: '', bot: botMessage },
      ]);
    } catch (error) {
      console.error('Error communicating with the chatbot API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: '', bot: 'Error: Could not reach the server.' },
      ]);
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
          <div key={index} className={`message ${msg.bot ? 'bot' : 'user'}`}>
            {msg.user && (
              <div className="user-message">
                <strong>User:</strong> {msg.user}
              </div>
            )}
            {msg.bot && (
              <div className="bot-message">
                <strong>AI:</strong>
                <pre>
                  <code
                    dangerouslySetInnerHTML={{
                      __html: msg.bot.replace(/\n/g, '<br>').replace(/```/g, ''),
                    }}
                  />
                </pre>
              </div>
            )}
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

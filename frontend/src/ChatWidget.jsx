import { useState } from 'react';
import axios from 'axios';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your LangGraph Financial Advisor. Ask me anything about your spending!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to UI
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send to FastAPI backend
      const res = await axios.post('https://quickbooks-ai-clone.onrender.com/api/chat', { message: input });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error connecting to the backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          💬 Ask AI
        </button>
      )}

      {isOpen && (
        <div className="chat-window glass-card">
          <div className="chat-header">
            <h3>AI Financial Advisor</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="message ai">Thinking...</div>}
          </div>

          <form onSubmit={sendMessage} className="chat-input-area">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your spending..."
            />
            <button type="submit" disabled={isLoading}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

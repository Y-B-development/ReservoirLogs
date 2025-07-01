import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

function App() {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  // Your Koyeb backend URL
  const API_URL = 'https://tasteless-amalie-y-b-development-e34c22e7.koyeb.app';

  // Polling: fetch messages immediately and then every 2 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a new message
  const sendMessage = async (content) => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      // Optimistic update
      setMessages(prev => [...prev, data]);
      return null;
    } catch (err) {
      console.error('Error sending message:', err);
      return err.message;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const content = e.target.elements.content.value.trim();
    if (!content) return;
    sendMessage(content);
    e.target.reset();
  };

  return (
    <div className="app-container">
      <div className="messages-container" ref={messagesRef}>
        <MessageList messages={messages} />
      </div>
      <form onSubmit={handleSubmit}>
        <input name="content" type="text" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;

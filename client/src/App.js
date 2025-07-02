// client/src/App.js

import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

function App() {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const API_URL = 'https://tasteless-amalie-y-b-development-e34c22e7.koyeb.app';

  // Polling: fetch messages every 2 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
    const iv = setInterval(fetchMessages, 2000);
    return () => clearInterval(iv);
  }, []);

  // Auto‑scroll to bottom on new messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content) => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setMessages(prev => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const content = e.target.elements.content.value.trim();
    if (content) {
      sendMessage(content);
      e.target.reset();
    }
  };

  // Split name into letters for styling
  const title = 'ReservoirLogs'.split('').map((char, i) => (
    <span key={i}>{char}</span>
  ));

  return (
    <div className="app-container">
      <h1 className="reservoir-logo">{title}</h1>
      <div className="messages-container" ref={messagesRef}>
        <MessageList messages={messages} />
      </div>
      <form onSubmit={handleSubmit}>
        <input name="content" type="text" placeholder="Type a message…" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;

// client/src/App.js

import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import bgImage from './assets/reservoir-dogs-poster.jpg';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

function App() {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);
  const API_URL = 'https://tasteless-amalie-y-b-development-e34c22e7.koyeb.app';

  // Polling every 2 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages`);
        if (!res.ok) throw new Error('Fetch failed');
        setMessages(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchMessages();
    const iv = setInterval(fetchMessages, 2000);
    return () => clearInterval(iv);
  }, []);

  // Auto‑scroll to bottom
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content) => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Send failed');
      setMessages(prev => [...prev, data]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const txt = e.target.elements.content.value.trim();
    if (txt) {
      sendMessage(txt);
      e.target.reset();
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="reservoir-logo" data-text="ReservoirLogs">
        ReservoirLogs
      </h1>
      <div className="messages-container" ref={messagesRef}>
        <MessageList messages={messages} />
      </div>
      <MessageForm onSend={sendMessage} />
    </div>
  );
}

export default App;

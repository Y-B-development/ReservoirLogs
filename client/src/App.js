import React, { useEffect, useState } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

function App() {
  const [messages, setMessages] = useState([]);

  const API_URL = 'https://tasteless-amalie-y-b-development-e34c22e7.koyeb.app';

  useEffect(() => {
    fetch(`${API_URL}/api/messages`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(err => console.error('Fetch messages error:', err));
  }, []);

  const sendMessage = async (content) => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (res.bodyUsed) {
        throw new Error('Response body already used');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      setMessages(prev => [...prev, data]);
      return null;
    } catch (err) {
      console.error('Frontend caught error:', err.message);
      return err.message;
    }
  };

  return (
    <div className="app-container">
      <h1>ReservoirLogs</h1>
      <MessageList messages={messages} />
      <MessageForm onSend={sendMessage} />
    </div>
  );
}

export default App;

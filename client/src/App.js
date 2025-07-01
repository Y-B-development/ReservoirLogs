// client/src/App.js

import React, { useEffect, useState } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/messages`)
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  })
  .then(data => setMessages(data))
  .catch(err => console.error('Fetch messages error:', err));
  }, []);

 const sendMessage = async (content) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/messages` , {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Unknown error');
    }

  console.log('🔁 Response text:', text);  // ← see what's returned

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

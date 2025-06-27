import React, { useState } from 'react';

function MessageForm({ onSend }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!content.trim()) {
    setError('Message cannot be empty.');
    return;
  }

  if (content.length > 200) {
    setError('Message too long (200 characters max).');
    return;
  }

  const backendError = await onSend(content);
  if (backendError) {
    setError(backendError);
    return;
  }

  setError(null);
  setContent('');
};


  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        placeholder="Type a message..."
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Send</button>

      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
}

export default MessageForm;

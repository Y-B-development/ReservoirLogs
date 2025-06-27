import React from 'react';

function MessageList({ messages }) {
  return (
    <div>
      {messages.map((msg) => (
        <div key={msg._id} className="message">
          <p>{msg.content}</p>
          <p className="message-time">
            {new Date(msg.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MessageList;

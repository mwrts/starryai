import React, { useState } from 'react';

const ChatInput = ({ onSend, onSkip }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ flexGrow: 1, marginRight: '1rem' }}
      />
      <button type="submit">Send</button>
      <button type="button" onClick={onSkip} style={{ marginLeft: '0.5rem' }}>
        Skip
      </button>
    </form>
  );
};

export default ChatInput;

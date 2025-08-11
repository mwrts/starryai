import React, { useState } from 'react';

const ChatInput = ({ onSend, onSkip }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
      <textarea
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows="1"
        style={{ flexGrow: 1, marginRight: '1rem', resize: 'none' }}
      />
      <button type="submit">Send</button>
      <button type="button" onClick={onSkip} style={{ marginLeft: '0.5rem' }}>
        Skip
      </button>
    </form>
  );
};

export default ChatInput;

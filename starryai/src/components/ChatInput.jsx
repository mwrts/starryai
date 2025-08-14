import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSend, onSkip }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

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
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', width: '100%', alignItems: 'flex-start', padding: '0.5rem' }}>
      <textarea
        ref={textareaRef}
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows="1"
        style={{
          flexGrow: 1,
          marginRight: '1rem',
          resize: 'none',
          maxHeight: '150px',
          overflowY: 'auto'
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit">Send</button>
        <button type="button" onClick={onSkip}>Skip</button>
      </div>
    </form>
  );
};

export default ChatInput;

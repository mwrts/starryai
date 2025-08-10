import React from 'react';
import Message from './Message';

const MessageList = ({ messages, onRewind }) => {
  return (
    <div>
      {messages.map((msg, index) => (
        <Message
          key={index}
          message={msg}
          onRewind={() => onRewind(index)}
        />
      ))}
    </div>
  );
};

export default MessageList;

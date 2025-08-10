import React from 'react';
import Message from './Message';

const MessageList = ({ messages, onRewind, onRegenerate }) => {
  return (
    <div>
      {messages.map((msg, index) => (
        <Message
          key={index}
          message={msg}
          onRewind={() => onRewind(index)}
          onRegenerate={onRegenerate}
          isLastMessage={index === messages.length - 1}
        />
      ))}
    </div>
  );
};

export default MessageList;

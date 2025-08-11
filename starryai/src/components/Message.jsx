import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Message.module.css';

const Message = ({ message, onRewind, onRegenerate, isLastMessage }) => {
  const messageClass = message.sender === 'user' ? styles.user : styles.bot;

  return (
    <div className={`${styles.message} ${messageClass}`}>
      <div className={styles.bubble}>
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
      <div className={styles.actions}>
        {message.sender === 'user' && (
          <button onClick={onRewind} className={styles.actionButton}>
            ↩️
          </button>
        )}
        {message.sender === 'bot' && isLastMessage && (
          <button onClick={onRegenerate} className={styles.actionButton}>
            🔄
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;

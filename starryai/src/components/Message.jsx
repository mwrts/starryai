import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Message.module.css';

const Message = ({ message, onRewind }) => {
  const messageClass = message.sender === 'user' ? styles.user : styles.bot;

  return (
    <div className={`${styles.message} ${messageClass}`}>
      <div className={styles.bubble}>
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
      {message.sender === 'user' && (
        <button onClick={onRewind} className={styles.rewindButton}>
          ↩️
        </button>
      )}
    </div>
  );
};

export default Message;

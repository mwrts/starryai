import React from 'react';
import styles from './ChatHeader.module.css';

const ChatHeader = ({ character }) => {
  if (!character) {
    return <div className={styles.header}></div>; // Render an empty header if no character
  }

  return (
    <header className={styles.header}>
      <div className={styles.characterInfo}>
        <img src={character.image || 'https://via.placeholder.com/150'} alt={character.name} className={styles.image} />
        <h3 className={styles.name}>{character.name}</h3>
      </div>
      <div className={styles.actions}>
        <a href="/#/settings" className={styles.settingsButton}>
          ⚙️
        </a>
      </div>
    </header>
  );
};

export default ChatHeader;

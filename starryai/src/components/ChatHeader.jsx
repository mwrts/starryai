import React from 'react';
import styles from './ChatHeader.module.css';

const ChatHeader = ({ character, modelName }) => {
  if (!character) {
    return <div className={styles.header}></div>; // Render an empty header if no character
  }

  return (
    <header className={styles.header}>
      <div className={styles.characterInfo}>
        <img src={character.image || 'https://via.placeholder.com/150'} alt={character.name} className={styles.image} />
        <div>
          <h3 className={styles.name}>{character.name}</h3>
          {modelName && <p className={styles.modelName}>Model: {modelName}</p>}
        </div>
      </div>
      <div className={styles.actions}>
        <a href={`/#/character/edit/${character.id}`} className={styles.settingsButton}>
          ✏️
        </a>
      </div>
    </header>
  );
};

export default ChatHeader;

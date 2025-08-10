import React from 'react';
import styles from './CharacterCard.module.css';

const CharacterCard = ({ character }) => {
  return (
    <a href={`/#/chat/${character.id}`} className={styles.link}>
      <div className={styles.card}>
        <img src={character.image} alt={character.name} className={styles.image} />
        <h3 className={styles.name}>{character.name}</h3>
      </div>
    </a>
  );
};

export default CharacterCard;

import React from 'react';
import styles from './CharacterCard.module.css';

const CharacterCard = ({ character, onClick }) => {
  return (
    <div className={styles.card} onClick={() => onClick(character)}>
      <img src={character.image} alt={character.name} className={styles.image} />
      <h3 className={styles.name}>{character.name}</h3>
    </div>
  );
};

export default CharacterCard;

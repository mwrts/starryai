import React, { useState, useEffect } from 'react';
import { loadCharacters } from '../utils/localStorage';
import CharacterCard from './CharacterCard';
import styles from './CharacterList.module.css';

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    setCharacters(loadCharacters());
  }, []);

  if (characters.length === 0) {
    return <p>No characters created yet. Go to the "Create Character" page to add one.</p>;
  }

  return (
    <div className={styles.list}>
      {characters.map(character => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
};

export default CharacterList;

import React, { useState, useEffect } from 'react';
import { loadRecentChats, loadCharacters } from '../utils/localStorage';
import styles from './RecentChats.module.css';

const RecentChats = () => {
  const [recentCharacters, setRecentCharacters] = useState([]);

  useEffect(() => {
    const recentIds = loadRecentChats();
    const allCharacters = loadCharacters();
    const characters = recentIds.map(id => allCharacters.find(c => c.id === id)).filter(Boolean);
    setRecentCharacters(characters);
  }, []);

  if (recentCharacters.length === 0) {
    return <p>No recent chats.</p>;
  }

  return (
    <ul className={styles.list}>
      {recentCharacters.map(character => (
        <li key={character.id} className={styles.item}>
          <a href={`/#/chat/${character.id}`}>
            <img src={character.image} alt={character.name} className={styles.image} />
            <span>{character.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default RecentChats;

import React, { useState, useEffect } from 'react';
import { loadAllChatHistories, loadCharacters } from '../utils/localStorage';
import styles from './RecentChatsList.module.css';

const RecentChatsList = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const allHistories = loadAllChatHistories();
    const characters = loadCharacters();

    const chatList = Object.keys(allHistories)
      .map(characterId => {
        const character = characters.find(c => c.id.toString() === characterId);
        const history = allHistories[characterId];
        // Only show chats that have more than the initial system message.
        if (character && history.length > 1) {
          return {
            character,
            lastMessage: history[history.length - 1],
          };
        }
        return null;
      })
      .filter(Boolean); // Filter out nulls

    setChats(chatList);
  }, []);

  if (chats.length === 0) {
    return <p>No recent chats.</p>;
  }

  return (
    <div className={styles.list}>
      {chats.map(({ character }) => (
        <a key={character.id} href={`#/chat/${character.id}`} className={styles.card}>
          {character.image && <img src={character.image} alt={character.name} className={styles.image} />}
          <div className={styles.name}>{character.name}</div>
        </a>
      ))}
    </div>
  );
};

export default RecentChatsList;

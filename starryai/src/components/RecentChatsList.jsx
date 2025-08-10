import React, { useState, useEffect } from 'react';
import { loadCharacters, loadAllChatHistories, deleteChatSession } from '../utils/localStorage';
import styles from './RecentChatsList.module.css';

const RecentChatsList = () => {
  const [recentChats, setRecentChats] = useState([]);

  const loadChats = () => {
    const characters = loadCharacters();
    const allHistories = loadAllChatHistories();

    const allChats = [];
    for (const charId in allHistories) {
      const character = characters.find(c => c.id.toString() === charId);
      if (character) {
        const charChats = allHistories[charId];
        for (const chat of charChats) {
          allChats.push({
            ...chat,
            characterId: charId,
            characterName: character.name,
            characterImage: character.image,
          });
        }
      }
    }

    // Sort by lastUpdated descending
    allChats.sort((a, b) => b.lastUpdated - a.lastUpdated);
    setRecentChats(allChats);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleDelete = (e, characterId, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteChatSession(characterId, chatId);
      loadChats(); // Refresh the list
    }
  };

  if (recentChats.length === 0) {
    return <p>No recent chats.</p>;
  }

  const placeholderImage = 'https://via.placeholder.com/150';
  return (
    <div className={styles.list}>
      {recentChats.map(chat => (
        <a key={chat.id} href={`/#/chat/${chat.characterId}/${chat.id}`} className={styles.chatItem}>
          <img src={chat.characterImage || placeholderImage} alt={chat.characterName} className={styles.image} />
          <div className={styles.info}>
            <h4 className={styles.name}>{chat.characterName}</h4>
            <p className={styles.time}>{new Date(chat.lastUpdated).toLocaleString()}</p>
          </div>
          <button
            className={styles.deleteButton}
            onClick={(e) => handleDelete(e, chat.characterId, chat.id)}
          >
            &times;
          </button>
        </a>
      ))}
    </div>
  );
};

export default RecentChatsList;

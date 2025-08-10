import React, { useState, useEffect } from 'react';
import { loadCharacters, deleteCharacter, loadRecentChatForCharacter } from '../utils/localStorage';
import CharacterCard from './CharacterCard';
import Modal from './Modal';
import styles from './CharacterList.module.css';

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCharacters(loadCharacters());
  }, []);

  const handleCardClick = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleStartChat = () => {
    const newChatId = `chat-${Date.now()}`;
    window.location.hash = `#/chat/${selectedCharacter.id}/${newChatId}`;
  };

  const handleResumeChat = () => {
    const recentChat = loadRecentChatForCharacter(selectedCharacter.id);
    if (recentChat) {
      window.location.hash = `#/chat/${selectedCharacter.id}/${recentChat.id}`;
    } else {
      // If no recent chat, start a new one
      handleStartChat();
    }
  };

  const handleDeleteCharacter = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCharacter.name}? This will delete all chat history with them.`)) {
      deleteCharacter(selectedCharacter.id);
      setCharacters(loadCharacters()); // Refresh the list
      handleCloseModal();
    }
  };

  if (characters.length === 0) {
    return <p>No characters created yet. Go to the "Create Character" page to add one.</p>;
  }

  return (
    <>
      <div className={styles.list}>
        {characters.map(character => (
          <CharacterCard key={character.id} character={character} onClick={handleCardClick} />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedCharacter && (
          <div className={styles.modalContent}>
            <h2>{selectedCharacter.name}</h2>
            <div className={styles.modalButtons}>
              <button onClick={handleStartChat}>Start New Chat</button>
              <button onClick={handleResumeChat}>Resume Chat</button>
              <button onClick={handleDeleteCharacter} className={styles.deleteButton}>Delete Character</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CharacterList;

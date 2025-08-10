import React, { useState, useEffect } from 'react';
import styles from './CharacterCreatorPage.module.css';
import { loadCharacters, saveCharacters } from '../utils/localStorage';

const CharacterCreatorPage = ({ characterId }) => {
  const [name, setName] = useState('');
  const [lore, setLore] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [image, setImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (characterId) {
      setIsEditMode(true);
      const characters = loadCharacters();
      const characterToEdit = characters.find(c => c.id.toString() === characterId);
      if (characterToEdit) {
        setName(characterToEdit.name);
        setLore(characterToEdit.lore);
        setFirstMessage(characterToEdit.firstMessage || '');
        setImage(characterToEdit.image || null);
      }
    }
  }, [characterId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !lore) {
      alert('Name and lore are required.');
      return;
    }

    const characters = loadCharacters();

    if (isEditMode) {
      const updatedCharacters = characters.map(c => {
        if (c.id.toString() === characterId) {
          return { ...c, name, lore, image, firstMessage };
        }
        return c;
      });
      saveCharacters(updatedCharacters);
      alert('Character updated successfully!');
      window.location.hash = '#/'; // Go back to home page
    } else {
      const newCharacter = {
        id: Date.now(),
        name,
        lore,
        image,
        firstMessage,
      };
      saveCharacters([...characters, newCharacter]);
      alert('Character created successfully!');
      // Clear form
      setName('');
      setLore('');
      setFirstMessage('');
      setImage(null);
      e.target.reset();
    }
  };

  return (
    <div className={styles.page}>
      <h2>{isEditMode ? 'Edit Character' : 'Create a New Character'}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lore">Definition/Lore</label>
          <textarea
            id="lore"
            name="lore"
            rows="10"
            value={lore}
            onChange={(e) => setLore(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="firstMessage">First Message</label>
          <textarea
            id="firstMessage"
            name="firstMessage"
            rows="3"
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          {isEditMode ? 'Update Character' : 'Create Character'}
        </button>
      </form>
    </div>
  );
};

export default CharacterCreatorPage;

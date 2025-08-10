import React, { useState } from 'react';
import styles from './CharacterCreatorPage.module.css';
import { loadCharacters, saveCharacters } from '../utils/localStorage';

const CharacterCreatorPage = () => {
  const [name, setName] = useState('');
  const [lore, setLore] = useState('');
  const [image, setImage] = useState(null);

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

    const newCharacter = {
      id: Date.now(),
      name,
      lore,
      image,
    };

    const characters = loadCharacters();
    saveCharacters([...characters, newCharacter]);

    // Clear form
    setName('');
    setLore('');
    setImage(null);
    e.target.reset();

    alert('Character created successfully!');
  };

  return (
    <div className={styles.page}>
      <h2>Create a New Character</h2>
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
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Create Character</button>
      </form>
    </div>
  );
};

export default CharacterCreatorPage;

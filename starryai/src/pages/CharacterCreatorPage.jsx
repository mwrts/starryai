import React, { useState, useEffect, useRef } from 'react';
import styles from './CharacterCreatorPage.module.css';
import { loadCharacters, saveCharacters } from '../utils/localStorage';

const CharacterCreatorPage = ({ characterId }) => {
  const [name, setName] = useState('');
  const [lore, setLore] = useState('');
  const [scenario, setScenario] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [image, setImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (characterId) {
      setIsEditMode(true);
      const characters = loadCharacters();
      const characterToEdit = characters.find(c => c.id.toString() === characterId);
      if (characterToEdit) {
        setName(characterToEdit.name);
        setLore(characterToEdit.lore);
        setScenario(characterToEdit.scenario || '');
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

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const processImportedCharacters = (charactersToImport) => {
      let importedCount = 0;
      const existingCharacters = loadCharacters();

      const newCharacters = charactersToImport.reduce((acc, char) => {
        if (char.name && char.lore) {
          acc.push({
            id: Date.now() + importedCount,
            name: char.name,
            lore: char.lore,
            scenario: char.scenario || '',
            firstMessage: char.firstMessage || '',
            image: char.image || null,
          });
          importedCount++;
        }
        return acc;
      }, []);

      if (newCharacters.length > 0) {
        saveCharacters([...existingCharacters, ...newCharacters]);
        alert(`${importedCount} character(s) imported successfully!`);
        window.location.hash = '#/';
      } else {
        alert('No valid characters found in the file.');
      }
    };

    if (file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          const charactersToImport = Array.isArray(json) ? json : [json];
          processImportedCharacters(charactersToImport);
        } catch (error) {
          alert('Failed to parse JSON file.');
          console.error("JSON Parse Error:", error);
        }
      };
      reader.readAsText(file);
    } else if (file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const metadata = await window.exifr.parse(event.target.result);
          if (metadata && metadata.chara) {
            const charData = JSON.parse(atob(metadata.chara));
            processImportedCharacters([charData]);
          } else {
            alert('No character data found in PNG metadata.');
          }
        } catch (error) {
          alert('Failed to read character data from PNG.');
          console.error("PNG Metadata Error:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file type. Please upload a .json or .png file.');
    }

    e.target.value = null; // Reset file input
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
          return { ...c, name, lore, scenario, image, firstMessage };
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
        scenario,
        image,
        firstMessage,
      };
      saveCharacters([...characters, newCharacter]);
      alert('Character created successfully!');
      // Clear form
      setName('');
      setLore('');
      setScenario('');
      setFirstMessage('');
      setImage(null);
      e.target.reset();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2>{isEditMode ? 'Edit Character' : 'Create a New Character'}</h2>
        <button type="button" onClick={() => fileInputRef.current.click()}>
          Import from JSON
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json,.png"
          onChange={handleFileImport}
        />
      </div>
      <hr />
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
          <label htmlFor="scenario">Scenario</label>
          <textarea
            id="scenario"
            name="scenario"
            rows="3"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
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

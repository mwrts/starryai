import React, { useState, useEffect, useContext } from 'react';
import styles from './SettingsPage.module.css';
import { loadProxyConfigs, saveProxyConfigs, loadPersona, savePersona, loadGenerationSettings, saveGenerationSettings } from '../utils/localStorage';
import { ThemeContext, themes } from '../contexts/ThemeContext';

const SettingsPage = () => {
  const [configs, setConfigs] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [persona, setPersona] = useState('');
  const [generationSettings, setGenerationSettings] = useState(loadGenerationSettings());

  const { theme, setTheme } = useContext(ThemeContext);
  const [customTheme, setCustomTheme] = useState(theme);

  useEffect(() => {
    setConfigs(loadProxyConfigs());
    setPersona(loadPersona());
    setGenerationSettings(loadGenerationSettings());
  }, []);

  useEffect(() => {
    setCustomTheme(theme);
  }, [theme]);

  const handleProxySubmit = (e) => {
    e.preventDefault();
    if (!apiKey || !proxyUrl) {
      alert('API Key and Proxy URL are required.');
      return;
    }
    const newConfig = { id: Date.now(), apiKey, proxyUrl, modelName };
    const updatedConfigs = [...configs, newConfig];
    setConfigs(updatedConfigs);
    saveProxyConfigs(updatedConfigs);
    setApiKey('');
    setProxyUrl('');
    setModelName('');
  };

  const handleDeleteProxy = (id) => {
    const updatedConfigs = configs.filter(config => config.id !== id);
    setConfigs(updatedConfigs);
    saveProxyConfigs(updatedConfigs);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleCustomThemeChange = (e) => {
    const { name, value } = e.target;
    const newCustomTheme = { ...customTheme, [name]: value };
    setCustomTheme(newCustomTheme);
    setTheme(newCustomTheme);
  };

  const handlePersonaChange = (e) => {
    setPersona(e.target.value);
  };

  const handlePersonaSubmit = (e) => {
    e.preventDefault();
    savePersona(persona);
    alert('Persona saved successfully!');
  };

  const handleGenerationSettingsChange = (e) => {
    const { name, value } = e.target;
    setGenerationSettings(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  useEffect(() => {
    saveGenerationSettings(generationSettings);
  }, [generationSettings]);

  return (
    <div className={styles.page}>
      <h2>Settings</h2>

      <div className={styles.section}>
        <h3>Generation Settings</h3>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="maxTokens">Max Tokens: {generationSettings.maxTokens}</label>
            <input
              type="range"
              id="maxTokens"
              name="maxTokens"
              min="100"
              max="2000"
              step="100"
              value={generationSettings.maxTokens}
              onChange={handleGenerationSettingsChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contextWindowSize">Context Window (characters): {generationSettings.contextWindowSize}</label>
            <input
              type="range"
              id="contextWindowSize"
              name="contextWindowSize"
              min="1000"
              max="128000"
              step="1000"
              value={generationSettings.contextWindowSize}
              onChange={handleGenerationSettingsChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>User Persona</h3>
        <form onSubmit={handlePersonaSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="persona">Your Persona</label>
            <textarea
              id="persona"
              name="persona"
              rows="5"
              value={persona}
              onChange={handlePersonaChange}
              placeholder="Describe yourself to the bot. This will be sent with every message."
            ></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>Save Persona</button>
        </form>
      </div>

      <div className={styles.section}>
        <h3>Theme Customization</h3>
        <div className={styles.themeSelector}>
          <h4>Predefined Palettes</h4>
          {Object.keys(themes).map(themeName => (
            <button key={themeName} onClick={() => handleThemeChange(themes[themeName])}>
              {themeName}
            </button>
          ))}
        </div>
        <div className={styles.themeEditor}>
          <h4>Custom Palette</h4>
          <div className={styles.formGroup}>
            <label>Background Color</label>
            <input type="color" name="--main-bg-color" value={customTheme['--main-bg-color']} onChange={handleCustomThemeChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Text Color</label>
            <input type="color" name="--text-color" value={customTheme['--text-color']} onChange={handleCustomThemeChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Accent Color</label>
            <input type="color" name="--accent-color" value={customTheme['--accent-color']} onChange={handleCustomThemeChange} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Proxy Configurations</h3>
        <div className={styles.configsList}>
          <h4>Saved Configurations</h4>
          {configs.length === 0 ? <p>No proxy configurations saved.</p> : (
            <ul>
              {configs.map(config => (
                <li key={config.id}>
                  <span>URL: {config.proxyUrl}</span>
                  <span>Model: {config.modelName || 'Not set'}</span>
                  <button onClick={() => handleDeleteProxy(config.id)} className={styles.deleteButton}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={handleProxySubmit} className={styles.form}>
          <h4>Add New Configuration</h4>
          <div className={styles.formGroup}><label htmlFor="apiKey">API Key</label><input type="password" id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} /></div>
          <div className={styles.formGroup}><label htmlFor="proxyUrl">Proxy URL</label><input type="text" id="proxyUrl" value={proxyUrl} onChange={(e) => setProxyUrl(e.target.value)} /></div>
          <div className={styles.formGroup}><label htmlFor="modelName">Model Name</label><input type="text" id="modelName" value={modelName} onChange={(e) => setModelName(e.target.value)} /></div>
          <button type="submit" className={styles.submitButton}>Save Configuration</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

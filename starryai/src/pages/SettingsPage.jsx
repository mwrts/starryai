import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from './SettingsPage.module.css';
import { saveProxyConfigs, loadPersona, savePersona, loadGenerationSettings, saveGenerationSettings } from '../utils/localStorage';
import { ThemeContext, themes } from '../contexts/ThemeContext';
import { ProxyContext } from '../contexts/ProxyContext';
import { UISettingsContext } from '../contexts/UISettingsContext';

const SettingsPage = () => {
  const { proxyConfigs, activeProxyId, setActiveProxyId, refreshProxyConfigs } = useContext(ProxyContext);
  const { uiSettings, setUiSettings } = useContext(UISettingsContext);
  const dataImportRef = useRef(null);
  const [apiKey, setApiKey] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [persona, setPersona] = useState('');
  const [generationSettings, setGenerationSettings] = useState(loadGenerationSettings());

  const { theme, setTheme } = useContext(ThemeContext);
  const [customTheme, setCustomTheme] = useState(theme);

  useEffect(() => {
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
    const updatedConfigs = [...proxyConfigs, newConfig];
    saveProxyConfigs(updatedConfigs);
    refreshProxyConfigs(); // Refresh context
    setApiKey('');
    setProxyUrl('');
    setModelName('');
  };

  const handleDeleteProxy = (id) => {
    const updatedConfigs = proxyConfigs.filter(config => config.id !== id);
    saveProxyConfigs(updatedConfigs);
    if (activeProxyId === id.toString()) {
      setActiveProxyId(null);
    }
    refreshProxyConfigs(); // Refresh context
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

  const handleUISettingsChange = (e) => {
    const { name, checked } = e.target;
    setUiSettings(prev => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    // This was removed by mistake in a previous step, adding it back.
    // The context handles saving, but this component needs to react to changes.
  }, [uiSettings]);

  const handleExport = () => {
    if (!window.confirm('Warning: The exported file will contain your API keys in plain text. Do not share this file with anyone you do not trust completely. Do you want to proceed?')) {
      return;
    }

    const allData = {};
    const keysToExport = [
      'janitor_ai_clone_characters',
      'janitor_ai_clone_chat_history',
      'janitor_ai_clone_proxy_configs',
      'janitor_ai_clone_active_proxy_id',
      'janitor_ai_clone_generation_settings',
      'janitor_ai_clone_persona',
      'janitor_ai_clone_ui_settings',
      'theme'
    ];

    keysToExport.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        allData[key] = value;
      }
    });

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'starryai_backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('Are you sure you want to import this file? This will overwrite all existing characters, chats, and settings.')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);

        // Basic validation
        if (!importedData.janitor_ai_clone_characters || !importedData.theme) {
          throw new Error("Invalid backup file.");
        }

        localStorage.clear();

        for (const key in importedData) {
          if (Object.hasOwnProperty.call(importedData, key)) {
            localStorage.setItem(key, importedData[key]);
          }
        }

        alert('Data imported successfully! The application will now reload.');
        window.location.reload();

      } catch (error) {
        alert('Failed to import data. Please make sure the file is a valid backup.');
        console.error("Import Error:", error);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className={styles.page}>
      <h2>Settings</h2>

      <div className={styles.section}>
        <h3>UI Settings</h3>
        <div className={styles.formGroup}>
          <label className={styles.toggleLabel}>
            <span>Enable Starry Background</span>
            <input
              type="checkbox"
              name="starsEnabled"
              checked={uiSettings.starsEnabled}
              onChange={handleUISettingsChange}
            />
          </label>
        </div>
      </div>

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
        <h3>Data Management</h3>
        <div className={styles.dataActions}>
          <button onClick={handleExport}>Export All Data</button>
          <button onClick={() => dataImportRef.current.click()}>Import Data</button>
          <input
            type="file"
            ref={dataImportRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleImport}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3>Proxy Configurations</h3>
        <div className={styles.configsList}>
          <h4>Saved Configurations</h4>
          {proxyConfigs.length === 0 ? <p>No proxy configurations saved.</p> : (
            <ul>
              {proxyConfigs.map(config => (
                <li key={config.id} className={activeProxyId === config.id.toString() ? styles.activeItem : ''}>
                  <div className={styles.configDetails}>
                    <span>URL: {config.proxyUrl}</span>
                    <span>Model: {config.modelName || 'Not set'}</span>
                  </div>
                  <div className={styles.configActions}>
                    {activeProxyId === config.id.toString() ? (
                      <span className={styles.activeLabel}>Active</span>
                    ) : (
                      <button onClick={() => setActiveProxyId(config.id.toString())}>Set Active</button>
                    )}
                    <button onClick={() => handleDeleteProxy(config.id)} className={styles.deleteButton}>Delete</button>
                  </div>
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

import React, { useState, useEffect, useContext } from 'react';
import styles from './SettingsPage.module.css';
import { loadProxyConfigs, saveProxyConfigs, loadBackgroundSettings, saveBackgroundSettings } from '../utils/localStorage';
import { ThemeContext, themes } from '../contexts/ThemeContext';

const SettingsPage = () => {
  const [configs, setConfigs] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [modelName, setModelName] = useState('');

  const { theme, setTheme } = useContext(ThemeContext);
  const [customTheme, setCustomTheme] = useState(theme);
  const [backgroundSettings, setBackgroundSettings] = useState(loadBackgroundSettings());

  useEffect(() => {
    setConfigs(loadProxyConfigs());
  }, []);

  useEffect(() => {
    setCustomTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveBackgroundSettings(backgroundSettings);
  }, [backgroundSettings]);

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

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundSettings(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundSettingChange = (e) => {
    const { name, value } = e.target;
    setBackgroundSettings(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <div className={styles.page}>
      <h2>Settings</h2>

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
        <h3>Background Settings</h3>
        <div className={styles.formGroup}>
          <label>Background Image</label>
          <input type="file" accept="image/*" onChange={handleBackgroundImageChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Blur: {backgroundSettings.blur}px</label>
          <input type="range" name="blur" min="0" max="20" step="1" value={backgroundSettings.blur} onChange={handleBackgroundSettingChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Opacity: {backgroundSettings.opacity}</label>
          <input type="range" name="opacity" min="0" max="1" step="0.1" value={backgroundSettings.opacity} onChange={handleBackgroundSettingChange} />
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

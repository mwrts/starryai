import React, { useState, useEffect } from 'react';
import styles from './Layout.module.css';
import Header from './Header';
import { loadUISettings } from '../utils/localStorage';

const Layout = ({ children }) => {
  const [uiSettings, setUiSettings] = useState(loadUISettings());

  // This effect will be needed if we want the background to update without a refresh
  // For now, it loads on mount which is sufficient for a setting that isn't changed often.
  useEffect(() => {
    const handleStorageChange = () => {
      setUiSettings(loadUISettings());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className={`${styles.layout} ${uiSettings.starsEnabled ? styles.starsActive : ''}`}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

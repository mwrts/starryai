import React, { useState, useEffect } from 'react';
import styles from './Layout.module.css';
import Header from './Header';
import { loadBackgroundSettings } from '../utils/localStorage';

const Layout = ({ children }) => {
  const [backgroundSettings, setBackgroundSettings] = useState(loadBackgroundSettings());

  useEffect(() => {
    const handleStorageChange = () => {
      setBackgroundSettings(loadBackgroundSettings());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const layoutStyle = {
    '--background-image': backgroundSettings.image ? `url(${backgroundSettings.image})` : 'none',
    '--background-blur': `${backgroundSettings.blur}px`,
    '--background-opacity': backgroundSettings.opacity,
  };

  return (
    <div className={styles.layout} style={layoutStyle}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

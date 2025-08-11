import React, { useContext } from 'react';
import styles from './Layout.module.css';
import Header from './Header';
import { UISettingsContext } from '../contexts/UISettingsContext';

const Layout = ({ children }) => {
  const { uiSettings } = useContext(UISettingsContext);

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

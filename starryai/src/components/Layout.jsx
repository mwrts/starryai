import React, { useContext } from 'react';
import styles from './Layout.module.css';
import Header from './Header';
import { UISettingsContext } from '../contexts/UISettingsContext';

const Layout = ({ children }) => {
  const { uiSettings } = useContext(UISettingsContext);

  return (
    <div className={styles.layout}>
      {uiSettings.starsEnabled && (
        <div className={styles.starsContainer}>
          <div className={styles.stars}></div>
          <div className={styles.stars2}></div>
          <div className={styles.stars3}></div>
          <div className={styles.shootingStar}></div>
          <div className={styles.shootingStar}></div>
          <div className={styles.shootingStar}></div>
        </div>
      )}
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

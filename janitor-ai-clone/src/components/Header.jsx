import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/#/">Janitor AI Clone</a>
      </div>
      <nav className={styles.nav}>
        <a href="/#/">Home</a>
        <a href="/#/characters">Create Character</a>
        <a href="/#/settings">Settings</a>
      </nav>
    </header>
  );
};

export default Header;

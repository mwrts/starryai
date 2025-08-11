import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { getActiveProxy } from '../utils/localStorage';

const Header = () => {
  const [activeModel, setActiveModel] = useState(null);

  useEffect(() => {
    const proxy = getActiveProxy();
    if (proxy && proxy.modelName) {
      setActiveModel(proxy.modelName);
    } else {
      setActiveModel(null);
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/#/">StarryAI</a>
      </div>
      {activeModel && <span className={styles.activeModel}>Active Model: {activeModel}</span>}
      <nav className={styles.nav}>
        <a href="/#/">Home</a>
        <a href="/#/characters">Create Character</a>
        <a href="/#/settings">Settings</a>
      </nav>
    </header>
  );
};

export default Header;

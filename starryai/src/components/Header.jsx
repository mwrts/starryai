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
        <a href="/#/">
          <img src="https://cdn.discordapp.com/attachments/1402748839462699162/1404293414337515670/STARRY.png?ex=689aa9a8&is=68995828&hm=9bad03862c7c357d8f1b3a673bbb757fc726aca83ca6488db9c45be5d7b0afc5&" alt="StarryAI Logo" />
        </a>
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

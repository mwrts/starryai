import React, { useContext, useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { ProxyContext } from '../contexts/ProxyContext';

const Header = () => {
  const { activeProxy } = useContext(ProxyContext);
  const activeModelName = activeProxy?.modelName;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      menuRef.current?.querySelector('a')?.focus();
    } else {
      buttonRef.current?.focus();
    }
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/#/">
          <img src="https://cdn.discordapp.com/attachments/1402748839462699162/1404293414337515670/STARRY.png?ex=689aa9a8&is=68995828&hm=9bad03862c7c357d8f1b3a673bbb757fc726aca83ca6488db9c45be5d7b0afc5&" alt="StarryAI Logo" />
          <span>StarryAI</span>
        </a>
      </div>

      {activeModelName && <span className={styles.activeModel}>Active Model: {activeModelName}</span>}

      <button
        ref={buttonRef}
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
      >
        &#9776;
      </button>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`} ref={menuRef}>
        <button className={styles.closeButton} onClick={toggleMenu}>&times;</button>
        <a href="/#/" onClick={toggleMenu}>Home</a>
        <a href="/#/characters" onClick={toggleMenu}>Create Character</a>
        <a href="/#/settings" onClick={toggleMenu}>Settings</a>
      </nav>
    </header>
  );
};

export default Header;

import React from 'react';
import styles from './Layout.module.css';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

import React from 'react';
import CharacterList from '../components/CharacterList';
import RecentChatsList from '../components/RecentChatsList';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div>
      <h2>Recent Chats</h2>
      <RecentChatsList />
      <hr className={styles.divider} />
      <h2>Created Characters</h2>
      <CharacterList />
    </div>
  );
};

export default HomePage;

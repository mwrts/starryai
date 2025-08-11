import React from 'react';
import CharacterList from '../components/CharacterList';
import RecentChatsList from '../components/RecentChatsList';

const HomePage = () => {
  return (
    <div>
      <h2>Recent Chats</h2>
      <RecentChatsList />
      <hr />
      <h2>Created Characters</h2>
      <CharacterList />
    </div>
  );
};

export default HomePage;

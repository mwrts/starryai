import React from 'react';
import CharacterList from '../components/CharacterList';
import RecentChats from '../components/RecentChats';

const HomePage = () => {
  return (
    <div>
      <h2>Recent Chats</h2>
      <RecentChats />
      <hr />
      <h2>Created Characters</h2>
      <CharacterList />
    </div>
  );
};

export default HomePage;

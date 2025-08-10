import React from 'react';
import CharacterList from '../components/CharacterList';

const HomePage = () => {
  return (
    <div>
      <h2>Recent Chats</h2>
      {/* This will be implemented later */}
      <p>No recent chats.</p>
      <hr />
      <h2>Created Characters</h2>
      <CharacterList />
    </div>
  );
};

export default HomePage;

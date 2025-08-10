import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CharacterCreatorPage from './pages/CharacterCreatorPage';
import SettingsPage from './pages/SettingsPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  let CurrentPage;
  let pageProps = {};

  if (route.startsWith('#/chat/')) {
    const characterId = route.split('/')[2];
    CurrentPage = ChatPage;
    pageProps = { characterId };
  } else {
    switch (route) {
      case '#/characters':
        CurrentPage = CharacterCreatorPage;
        break;
      case '#/settings':
        CurrentPage = SettingsPage;
        break;
      default:
        CurrentPage = HomePage;
    }
  }

  return (
    <Layout>
      <CurrentPage {...pageProps} />
    </Layout>
  );
}

export default App;

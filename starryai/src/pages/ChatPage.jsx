import React, { useState, useEffect } from 'react';
import styles from './ChatPage.module.css';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import ChatHeader from '../components/ChatHeader';
import { loadCharacters, loadProxyConfigs, loadChatHistory, saveChatHistory, loadPersona, loadGenerationSettings } from '../utils/localStorage';
import { getBotResponse } from '../utils/api';

const ChatPage = ({ characterId, chatId }) => {
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [persona, setPersona] = useState('');
  const [generationSettings, setGenerationSettings] = useState(loadGenerationSettings());

  useEffect(() => {
    setPersona(loadPersona());
    setGenerationSettings(loadGenerationSettings());
    const characters = loadCharacters();
    const foundCharacter = characters.find(c => c.id.toString() === characterId);
    if (foundCharacter) {
      setCharacter(foundCharacter);
      const history = loadChatHistory(characterId, chatId);
      if (history.length > 0) {
        setMessages(history);
      } else {
        const firstMessage = foundCharacter.firstMessage
          ? { sender: 'bot', text: foundCharacter.firstMessage }
          : { sender: 'bot', text: `You are now chatting with ${foundCharacter.name}.` };
        setMessages([firstMessage]);
      }
    }
  }, [characterId, chatId]);

  useEffect(() => {
    if (character && chatId) {
      saveChatHistory(character.id, chatId, messages);
    }
  }, [messages, character, chatId]);

  const handleSend = async (text) => {
    const newMessage = { sender: 'user', text };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    const proxyConfigs = loadProxyConfigs();
    if (proxyConfigs.length === 0) {
      alert('No proxy configuration found. Please add one in the settings.');
      return;
    }
    const proxyConfig = proxyConfigs[0]; // Use the first config for now

    setIsTyping(true);
    try {
      const botText = await getBotResponse(character, newMessages, proxyConfig, persona, generationSettings);
      const botMessage = { sender: 'bot', text: botText };
      setMessages([...newMessages, botMessage]);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Failed to get a response from the bot. Please check your proxy configuration and API key.');
    } finally {
      setIsTyping(false);
    }
  };

  if (!character) {
    return <div>Character not found.</div>;
  }

  const handleRewind = (index) => {
    const newMessages = messages.slice(0, index);
    setMessages(newMessages);
  };

  const handleRegenerate = async () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender !== 'bot') {
      return;
    }

    const messagesForApi = messages.slice(0, -1);

    const proxyConfigs = loadProxyConfigs();
    if (proxyConfigs.length === 0) {
      alert('No proxy configuration found. Please add one in the settings.');
      return;
    }
    const proxyConfig = proxyConfigs[0];

    setIsTyping(true);
    try {
      const botText = await getBotResponse(character, messagesForApi, proxyConfig, persona, generationSettings);
      const botMessage = { sender: 'bot', text: botText };
      setMessages([...messagesForApi, botMessage]);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Failed to get a response from the bot. Please check your proxy configuration and API key.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSkipTurn = async () => {
    const proxyConfigs = loadProxyConfigs();
    if (proxyConfigs.length === 0) {
      alert('No proxy configuration found. Please add one in the settings.');
      return;
    }
    const proxyConfig = proxyConfigs[0];

    setIsTyping(true);
    try {
      const botText = await getBotResponse(character, messages, proxyConfig, persona, generationSettings);
      const botMessage = { sender: 'bot', text: botText };
      setMessages([...messages, botMessage]);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Failed to get a response from the bot. Please check your proxy configuration and API key.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.page}>
      <ChatHeader character={character} />
      <div className={styles.messageList}>
        <MessageList messages={messages} onRewind={handleRewind} onRegenerate={handleRegenerate} />
        {isTyping && <div className={styles.typingIndicator}>Bot is typing...</div>}
      </div>
      <div className={styles.chatInput}>
        <ChatInput onSend={handleSend} onSkip={handleSkipTurn} />
      </div>
    </div>
  );
};

export default ChatPage;

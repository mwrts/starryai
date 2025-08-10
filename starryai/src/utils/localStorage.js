const CHARACTERS_KEY = 'janitor_ai_clone_characters';

export const saveCharacters = (characters) => {
  try {
    const serializedState = JSON.stringify(characters);
    localStorage.setItem(CHARACTERS_KEY, serializedState);
  } catch (e) {
    console.error("Could not save characters.", e);
  }
};

export const loadCharacters = () => {
  try {
    const serializedState = localStorage.getItem(CHARACTERS_KEY);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load characters.", e);
    return [];
  }
};

const PERSONA_KEY = 'janitor_ai_clone_persona';

export const savePersona = (persona) => {
  try {
    localStorage.setItem(PERSONA_KEY, persona);
  } catch (e) {
    console.error("Could not save persona.", e);
  }
};

export const loadPersona = () => {
  try {
    const persona = localStorage.getItem(PERSONA_KEY);
    return persona || '';
  } catch (e) {
    console.error("Could not load persona.", e);
    return '';
  }
};

const CHAT_HISTORY_KEY = 'janitor_ai_clone_chat_history';

// Loads all chat histories and handles migration from old format.
const loadAllChatHistories = () => {
  try {
    const serializedState = localStorage.getItem(CHAT_HISTORY_KEY);
    if (serializedState === null) {
      return {};
    }
    const allHistories = JSON.parse(serializedState);

    // Migration logic
    for (const charId in allHistories) {
      if (Array.isArray(allHistories[charId])) {
        // Old format: array of messages
        allHistories[charId] = [{
          id: `chat-${Date.now()}`,
          messages: allHistories[charId],
          lastUpdated: Date.now()
        }];
      }
    }
    return allHistories;
  } catch (e) {
    console.error("Could not load chat histories.", e);
    return {};
  }
};

export const saveChatHistory = (characterId, chatId, messages) => {
  try {
    const allHistories = loadAllChatHistories();
    if (!allHistories[characterId]) {
      allHistories[characterId] = [];
    }
    const chatIndex = allHistories[characterId].findIndex(chat => chat.id === chatId);
    if (chatIndex !== -1) {
      allHistories[characterId][chatIndex].messages = messages;
      allHistories[characterId][chatIndex].lastUpdated = Date.now();
    } else {
      allHistories[characterId].push({ id: chatId, messages, lastUpdated: Date.now() });
    }
    const serializedState = JSON.stringify(allHistories);
    localStorage.setItem(CHAT_HISTORY_KEY, serializedState);
  } catch (e) {
    console.error("Could not save chat history.", e);
  }
};

export const loadChatHistory = (characterId, chatId) => {
  try {
    const allHistories = loadAllChatHistories();
    if (!allHistories[characterId]) {
      return [];
    }
    const chat = allHistories[characterId].find(chat => chat.id === chatId);
    return chat ? chat.messages : [];
  } catch (e) {
    console.error("Could not load chat history.", e);
    return [];
  }
};

export const loadRecentChatForCharacter = (characterId) => {
  try {
    const allHistories = loadAllChatHistories();
    if (!allHistories[characterId] || allHistories[characterId].length === 0) {
      return null;
    }
    // Sort by lastUpdated descending and return the first one
    const sortedChats = allHistories[characterId].sort((a, b) => b.lastUpdated - a.lastUpdated);
    return sortedChats[0];
  } catch (e) {
    console.error("Could not load recent chat.", e);
    return null;
  }
};

export const deleteCharacter = (characterId) => {
  try {
    // Delete character
    const characters = loadCharacters();
    const updatedCharacters = characters.filter(c => c.id !== characterId);
    saveCharacters(updatedCharacters);

    // Delete chat histories
    const allHistories = loadAllChatHistories();
    delete allHistories[characterId];
    const serializedState = JSON.stringify(allHistories);
    localStorage.setItem(CHAT_HISTORY_KEY, serializedState);
  } catch (e) {
    console.error("Could not delete character.", e);
  }
};

const PROXY_CONFIGS_KEY = 'janitor_ai_clone_proxy_configs';

export const saveProxyConfigs = (configs) => {
  try {
    const serializedState = JSON.stringify(configs);
    localStorage.setItem(PROXY_CONFIGS_KEY, serializedState);
  } catch (e) {
    console.error("Could not save proxy configs.", e);
  }
};

export const loadProxyConfigs = () => {
  try {
    const serializedState = localStorage.getItem(PROXY_CONFIGS_KEY);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load proxy configs.", e);
    return [];
  }
};

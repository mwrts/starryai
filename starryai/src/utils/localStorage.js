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

const UI_SETTINGS_KEY = 'janitor_ai_clone_ui_settings';
const DEFAULT_UI_SETTINGS = {
  starsEnabled: true,
};

export const saveUISettings = (settings) => {
  try {
    const serializedState = JSON.stringify(settings);
    localStorage.setItem(UI_SETTINGS_KEY, serializedState);
  } catch (e) {
    console.error("Could not save UI settings.", e);
  }
};

export const loadUISettings = () => {
  try {
    const serializedState = localStorage.getItem(UI_SETTINGS_KEY);
    if (serializedState === null) {
      return DEFAULT_UI_SETTINGS;
    }
    return { ...DEFAULT_UI_SETTINGS, ...JSON.parse(serializedState) };
  } catch (e) {
    console.error("Could not load UI settings.", e);
    return DEFAULT_UI_SETTINGS;
  }
};

export const getActiveProxy = () => {
  const proxyConfigs = loadProxyConfigs();
  if (proxyConfigs.length === 0) {
    return null;
  }
  const activeId = loadActiveProxyId();
  if (activeId) {
    const activeConfig = proxyConfigs.find(c => c.id.toString() === activeId);
    // If activeId is saved but config not found (e.g. deleted), return null
    // to force user to select a new one.
    return activeConfig || null;
  }
  // Fallback to the first config if no active one is explicitly set.
  return proxyConfigs[0];
};

const ACTIVE_PROXY_ID_KEY = 'janitor_ai_clone_active_proxy_id';

export const saveActiveProxyId = (id) => {
  try {
    if (id === null || id === undefined) {
      localStorage.removeItem(ACTIVE_PROXY_ID_KEY);
    } else {
      localStorage.setItem(ACTIVE_PROXY_ID_KEY, id);
    }
  } catch (e) {
    console.error("Could not save active proxy id.", e);
  }
};

export const loadActiveProxyId = () => {
  try {
    return localStorage.getItem(ACTIVE_PROXY_ID_KEY);
  } catch (e) {
    console.error("Could not load active proxy id.", e);
    return null;
  }
};

const GENERATION_SETTINGS_KEY = 'janitor_ai_clone_generation_settings';
const DEFAULT_GENERATION_SETTINGS = {
  maxTokens: 500,
  contextWindowSize: 4096,
};

export const saveGenerationSettings = (settings) => {
  try {
    const serializedState = JSON.stringify(settings);
    localStorage.setItem(GENERATION_SETTINGS_KEY, serializedState);
  } catch (e) {
    console.error("Could not save generation settings.", e);
  }
};

export const loadGenerationSettings = () => {
  try {
    const serializedState = localStorage.getItem(GENERATION_SETTINGS_KEY);
    if (serializedState === null) {
      return DEFAULT_GENERATION_SETTINGS;
    }
    return { ...DEFAULT_GENERATION_SETTINGS, ...JSON.parse(serializedState) };
  } catch (e) {
    console.error("Could not load generation settings.", e);
    return DEFAULT_GENERATION_SETTINGS;
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
export const loadAllChatHistories = () => {
  try {
    const serializedState = localStorage.getItem(CHAT_HISTORY_KEY);
    if (serializedState === null) {
      return {};
    }
    const allHistories = JSON.parse(serializedState);

    // Migration logic
    for (const charId in allHistories) {
      const history = allHistories[charId];
      if (Array.isArray(history) && history.length > 0 && history[0].sender) {
        // Old format: array of message objects
        allHistories[charId] = [{
          id: `chat-${Date.now()}`,
          messages: history,
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
    const characterHistories = allHistories[characterId] || [];

    const chatIndex = characterHistories.findIndex(chat => chat.id === chatId);

    let newCharacterHistories;
    if (chatIndex !== -1) {
      newCharacterHistories = [
        ...characterHistories.slice(0, chatIndex),
        { ...characterHistories[chatIndex], messages, lastUpdated: Date.now() },
        ...characterHistories.slice(chatIndex + 1),
      ];
    } else {
      newCharacterHistories = [...characterHistories, { id: chatId, messages, lastUpdated: Date.now() }];
    }

    const newAllHistories = {
      ...allHistories,
      [characterId]: newCharacterHistories,
    };

    const serializedState = JSON.stringify(newAllHistories);
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

export const deleteChatSession = (characterId, chatId) => {
  try {
    const allHistories = loadAllChatHistories();
    if (!allHistories[characterId]) {
      return;
    }
    const updatedChats = allHistories[characterId].filter(chat => chat.id !== chatId);
    allHistories[characterId] = updatedChats;
    const serializedState = JSON.stringify(allHistories);
    localStorage.setItem(CHAT_HISTORY_KEY, serializedState);
  } catch (e) {
    console.error("Could not delete chat session.", e);
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

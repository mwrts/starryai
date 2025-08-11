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

const updateRecentChats = (characterId) => {
  try {
    let recentChats = loadRecentChats();
    // Remove the characterId if it already exists to move it to the front
    recentChats = recentChats.filter(id => id !== characterId);
    // Add the characterId to the front of the array
    recentChats.unshift(characterId);
    // Keep the list at a reasonable size, e.g., 10
    const sliced = recentChats.slice(0, 10);
    localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(sliced));
  } catch (e) {
    console.error("Could not update recent chats.", e);
  }
};

export const loadRecentChats = () => {
  try {
    const serializedState = localStorage.getItem(RECENT_CHATS_KEY);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load recent chats.", e);
    return [];
  }
};

const CHAT_HISTORY_KEY = 'janitor_ai_clone_chat_history';
const RECENT_CHATS_KEY = 'janitor_ai_clone_recent_chats';

export const saveChatHistory = (characterId, messages) => {
  try {
    const allHistories = loadAllChatHistories();
    allHistories[characterId] = messages;
    const serializedState = JSON.stringify(allHistories);
    localStorage.setItem(CHAT_HISTORY_KEY, serializedState);
    updateRecentChats(characterId);
  } catch (e) {
    console.error("Could not save chat history.", e);
  }
};

export const loadChatHistory = (characterId) => {
  try {
    const allHistories = loadAllChatHistories();
    return allHistories[characterId] || [];
  } catch (e) {
    console.error("Could not load chat history.", e);
    return [];
  }
};

const loadAllChatHistories = () => {
  try {
    const serializedState = localStorage.getItem(CHAT_HISTORY_KEY);
    if (serializedState === null) {
      return {};
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load chat histories.", e);
    return {};
  }
}

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

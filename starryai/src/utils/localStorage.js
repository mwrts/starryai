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

const BACKGROUND_SETTINGS_KEY = 'janitor_ai_clone_background_settings';

export const saveBackgroundSettings = (settings) => {
  try {
    const serializedState = JSON.stringify(settings);
    localStorage.setItem(BACKGROUND_SETTINGS_KEY, serializedState);
  } catch (e) {
    console.error("Could not save background settings.", e);
  }
};

export const loadBackgroundSettings = () => {
  try {
    const serializedState = localStorage.getItem(BACKGROUND_SETTINGS_KEY);
    if (serializedState === null) {
      return { image: null, blur: 0, opacity: 1 };
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load background settings.", e);
    return { image: null, blur: 0, opacity: 1 };
  }
};

const CHAT_HISTORY_KEY = 'janitor_ai_clone_chat_history';

export const saveChatHistory = (characterId, messages) => {
  try {
    const allHistories = loadAllChatHistories();
    allHistories[characterId] = messages;
    const serializedState = JSON.stringify(allHistories);
    localStorage.setItem(CHAT_HISTORY_KEY, serializedState);
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

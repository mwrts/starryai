export const getBotResponse = async (character, history, newMessage, proxyConfig, persona, generationSettings) => {
  const { apiKey, proxyUrl, modelName } = proxyConfig;
  const { maxTokens, contextWindowSize } = generationSettings;

  let systemContent = `You are ${character.name}. ${character.lore}`;
  if (persona) {
    systemContent += `\n\nThe user you are talking to has the following persona: ${persona}`;
  }

  const systemMessage = {
    role: 'system',
    content: systemContent,
  };

  let currentTokenCount = 0;
  const contextMessages = [];

  // Add messages from the end of the history until the context window is full
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    const messageTokenCount = msg.text.length; // Approximation
    if (currentTokenCount + messageTokenCount > contextWindowSize) {
      break;
    }
    contextMessages.unshift({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    });
    currentTokenCount += messageTokenCount;
  }

  const messages = [systemMessage, ...contextMessages];

  if (newMessage) {
    messages.push({ role: 'user', content: newMessage });
  }

  const body = {
    model: modelName,
    messages: messages,
  };

  if (maxTokens > 0) {
    body.max_tokens = maxTokens;
  }

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error('Failed to get response from the API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
};

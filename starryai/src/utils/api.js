export const getBotResponse = async (character, history, newMessage, proxyConfig) => {
  const { apiKey, proxyUrl, modelName } = proxyConfig;

  const systemMessage = {
    role: 'system',
    content: `You are ${character.name}. ${character.lore}`,
  };

  const messages = [
    systemMessage,
    ...history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: newMessage },
  ];

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
      }),
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

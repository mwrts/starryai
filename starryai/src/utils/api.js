export const getBotResponse = async (character, history, newMessage, proxyConfig, persona) => {
  const { apiKey, proxyUrl, modelName } = proxyConfig;

  let systemContent = `You are ${character.name}. ${character.lore}`;
  if (persona) {
    systemContent += `\n\nThe user you are talking to has the following persona: ${persona}`;
  }

  const systemMessage = {
    role: 'system',
    content: systemContent,
  };

  const messages = [
    systemMessage,
    ...history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
  ];

  if (newMessage) {
    messages.push({ role: 'user', content: newMessage });
  }

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

// APIリクエストを行う独自の関数
async function createChatCompletion(system_message, user_message) {
  const API_KEY = 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;

  // APIキーの存在を確認
  if (!API_KEY) {
    throw new Error("OpenAI API Key is missing");
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: system_message,
        },
        {
          role: 'user',
          content: user_message,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // エラーメッセージを具体化
    throw new Error(data.error?.message || `Unexpected error, status code: ${response.status}`);
  }

  return data;
}

// ハンドラー関数
export default async function handler(req, res) {
  const { system_message, user_message } = req.body;

  if (!system_message || !user_message) {
    res.status(400).json({ error: 'System and user messages are both required' });
    return;
  }

  try {
    const data = await createChatCompletion(system_message, user_message);

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ text: data.choices[0].message.content.trim() });
    } else {
      throw new Error('No choices in response');
    }
  } catch (error) {
    // エラーメッセージを送信
    res.status(500).json({ error: error.message });
  }
}

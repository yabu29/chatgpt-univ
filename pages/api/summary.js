// APIリクエストを行う独自の関数を改善
async function improvedCreateChatCompletion(system_message, user_message) {
  const API_KEY = process.env.OPENAI_API_KEY;
  
  // APIキーの存在を確認
  if (!API_KEY) {
    console.error("OpenAI API Key is missing");
    throw new Error("OpenAI API Key is missing");
  }

  try {
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
      console.error("Response Error:", data.error?.message || `Unexpected error, status code: ${response.status}`);
      throw new Error(data.error?.message || `Unexpected error, status code: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error; // またはカスタムエラーメッセージを投げる
  }
}
// タイムアウトを設定する関数
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out after " + ms + "ms"));
    }, ms);
  });
}

// improvedCreateChatCompletion関数にタイムアウトを追加
async function improvedCreateChatCompletionWithTimeout(system_message, user_message) {
  try {
    const result = await Promise.race([
      improvedCreateChatCompletion(system_message, user_message),
      timeout(30000),
    ]);
    return result;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}

// ハンドラー関数
export default async function handler(req, res) {
  const { system_message, user_message } = req.body;

  if (!system_message || !user_message) {
    console.error("Request Error: System and user messages are both required");
    res.status(400).json({ error: 'System and user messages are both required' });
    return;
  }

  try {
    // ここを修正
    const data = await improvedCreateChatCompletion(system_message, user_message);

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ text: data.choices[0].message.content.trim() });
    } else {
      console.error("No choices in response");
      throw new Error('No choices in response');
    }
  } catch (error) {
    console.error("Handler Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
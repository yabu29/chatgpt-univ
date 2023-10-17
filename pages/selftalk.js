import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');

  const handleButtonClick = async () => {
    setError('');

    const system_message = `あなたは語学学習のエキスパートです。以下に私が話したスピーキング原稿を記載しています。それに対する、文章校正とより良くなるTipsを教えてください。 \n\n入力文\n${inputText}`;

    const response = await fetch('/api/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        system_message,
        user_message: inputText
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    } else {
      setOutputText(data.text);
    }
  };

  return (
    <div className="container"> {/* コンテナクラスを追加 */}
      <Head>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <h1>ChatGPT｜独り言フィードバック</h1> {/* ヘッダーを追加 */}
      <div className="input-group">
        <textarea 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          placeholder="入力文を入力（補足情報を記載）" 
          className="input-field" /* input-fieldクラスを追加 */
        />
      </div>
      <div className="input-group">
        <button onClick={handleButtonClick}>送信</button>
      </div>
      <div className="output-section">
        {error && <p className="error">{error}</p>} {/* エラーメッセージ */}
        <p>{outputText}</p>
      </div>
    </div>
  );
}

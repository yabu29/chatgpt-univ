import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [role, setRole] = useState('');
  const [command, setCommand] = useState('');
  const [constraint, setConstraint] = useState('');
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false); // フィードバック入力フィールドの表示管理用

  const handleButtonClick = async () => {
    setError('');
    let system_message = `あなたの役割は${role}です。\n\n #命令文\n${command}\n\n#制約条件\n${constraint}\n\n入力文\n${inputText}`;

    if (feedback) {
      system_message += `\n\nユーザーからのフィードバックがありました。\n\n${feedback}を考慮して作成してください。`;
    }

    const requestBody = {
      system_message,
      user_message: inputText, // this can be included if the API requires it
    };

    const response = await fetch('/api/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
    } else {
      setOutputText(data.text);
      setShowFeedback(true); // 初回のレスポンス後、フィードバック入力フィールドを表示
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Feedback-enabled API Interaction</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <h1>ChatGPT｜深津式プロンプト</h1>
      <div className="input-group">
      <input 
          type="text" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          placeholder="役割を入力（例：ライター、学生、エンジニア）" 
          className="input-field"
        />
        <input 
          type="text" 
          value={command} 
          onChange={(e) => setCommand(e.target.value)} 
          placeholder="命令文を入力（例：〜を書いて）" 
          className="input-field"
        />
        <textarea 
          value={constraint} 
          onChange={(e) => setConstraint(e.target.value)} 
          placeholder="制約条件を入力（条件を箇条書きで入力）" 
          className="input-field"
        />
        <textarea 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          placeholder="入力文を入力（補足情報を記載）" 
          className="input-field"
        />
        {showFeedback && (
          <textarea 
            value={feedback} 
            onChange={(e) => setFeedback(e.target.value)} 
            placeholder="回答にお困りの場合は、こちらにフィードバックを入力してください。" 
            className="input-field feedback-field"
          />
        )}
      </div>
      <div className="input-group">
        <button onClick={handleButtonClick}>送信</button>
      </div>
      <div className="output-section">
        {error && <p className="error">{error}</p>}
        <p>{outputText}</p>
      </div>
    </div>
  );
}

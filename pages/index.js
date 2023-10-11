import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [role, setRole] = useState('');
  const [command, setCommand] = useState('');
  const [constraint, setConstraint] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');

  const handleButtonClick = async () => {
    setError('');

    const system_message = `あなたの役割は${role}です。\n\n #命令文\n${command}\n\n#制約条件\n${constraint}\n\n入力文\n${inputText}`;

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
      <h1>ChatGPT｜深津式プロンプト</h1> {/* ヘッダーを追加 */}
      <div className="input-group">
        <input 
          type="text" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          placeholder="役割を入力（例：ライター、学生、エンジニア）" 
          className="input-field" /* input-fieldクラスを追加 */
        />
        <input 
          type="text" 
          value={command} 
          onChange={(e) => setCommand(e.target.value)} 
          placeholder="命令文を入力（例：〜を書いて）" 
          className="input-field" /* input-fieldクラスを追加 */
        />
        <textarea 
          type="text" 
          value={constraint} 
          onChange={(e) => setConstraint(e.target.value)} 
          placeholder="制約条件を入力（条件を箇条書きで入力）" 
          className="input-field" /* input-fieldクラスを追加 */
        />
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

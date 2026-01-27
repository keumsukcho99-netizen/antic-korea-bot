import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("%c[Antique-Korea] 시스템 연결 성공", "color: #b8860b; font-weight: bold;");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

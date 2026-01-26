import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 로딩 확인을 위한 로그
console.log("Antique-Korea App initializing from index.tsx...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical Error: Root element '#root' not found in index.html");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React app mounted successfully.");
}

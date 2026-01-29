
   import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Antique Korea Engine Starting...");

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    
    // 앱 렌더링 후 로딩 화면 제거 함수
    const hideLoader = () => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 500);
        }
    };

    // DOM이 준비되면 안전하게 로더 제거
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        // 혹시 모를 로딩 지연을 대비해 최대 2초 후 강제 제거
        setTimeout(hideLoader, 2000);
    }
}

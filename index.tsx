
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
    
    // 로딩 화면을 숨기는 함수
    const hideLoader = () => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                    console.log("Antique Korea: Entry path cleared.");
                }
            }, 500);
        }
    };

    // 브라우저 로드가 끝나거나, 최대 2초가 지나면 무조건 로딩을 치웁니다.
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        setTimeout(hideLoader, 2000);
    }
}

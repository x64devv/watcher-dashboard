import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { WebSocketProvider } from './context/WebSocketContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebSocketProvider configs={[
      {
        id: 'main',
        url: 'ws://localhost:8080/api/lara-sock',
      },
      {
        id: 'logs',
        url: 'ws://localhost:8080/api/logs-sock',
      }
    ]}>
      <App />
    </WebSocketProvider>
  </StrictMode>
);

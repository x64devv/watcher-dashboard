import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { WebSocketProvider } from './context/WebSocketContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebSocketProvider url="ws://localhost:8080">
      <App />
    </WebSocketProvider>
  </StrictMode>
);

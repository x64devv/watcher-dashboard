import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { WebSocketProvider } from './context/WebSocketContext';
import './index.css';
const laraId = "laravel"
const nginx = "nginx"
createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <WebSocketProvider configs={[
      {
        id: laraId,
        url: 'ws://localhost:8080/api/lara-sock',
        onOpen: (evnt)=>{
          console.log(`sock ${laraId} opened`)
        },
        onMessage: (envt)=>{
          console.log("received message: ", envt.data)
        }
        
      }
    ]}>
      <App />
    </WebSocketProvider>
  </StrictMode>
);

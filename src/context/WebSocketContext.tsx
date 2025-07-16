import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket, WebSocketState } from '../hooks/useWebSocket';

interface WebSocketContextType extends WebSocketState {
  sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => boolean;
  reconnect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
  url?: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  url = 'ws://localhost:8080/api/lara-sock' // Default WebSocket URL - change this to your server
}) => {
  const webSocket = useWebSocket({
    url,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    onOpen: (event) => {
      console.log('WebSocket connected:', event);
    },
    onMessage: (event) => {
      console.log('WebSocket message received:', event.data);
      
      // You can dispatch custom events here for different parts of your app to listen to
      try {
        const data = JSON.parse(event.data);
        
        // Dispatch custom events based on message type
        if (data.type) {
          window.dispatchEvent(new CustomEvent(`websocket:${data.type}`, {
            detail: data
          }));
        }
      } catch (error) {
        console.warn('Failed to parse WebSocket message:', error);
      }
    },
    onClose: (event) => {
      console.log('WebSocket disconnected:', event);
    },
    onError: (event) => {
      console.error('WebSocket error:', event);
    },
  });

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
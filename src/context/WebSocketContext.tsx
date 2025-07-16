import React, { createContext, useContext, ReactNode } from 'react';
import { useMemo } from 'react';
import { useMultipleWebSockets, WebSocketConfig, WebSocketConnection } from '../hooks/useMultipleWebSockets';

interface WebSocketContextType {
  connections: Map<string, WebSocketConnection>;
  sendMessage: (id: string, data: string | ArrayBufferLike | Blob | ArrayBufferView) => boolean;
  reconnect: (id: string) => void;
  disconnect: (id: string) => void;
  reconnectAll: () => void;
  disconnectAll: () => void;
  getConnection: (id: string) => WebSocketConnection | undefined;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
  configs?: WebSocketConfig[];
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  configs = [
    {
      id: 'main',
      url: 'ws://localhost:8080/api/lara-sock',
    },
    {
      id: 'logs',
      url: 'ws://localhost:8080/api/logs-sock',
    }
  ]
}) => {
  const configsWithHandlers = useMemo(() => configs.map(config => ({
    ...config,
    reconnectInterval: config.reconnectInterval || 3000,
    maxReconnectAttempts: config.maxReconnectAttempts || 5,
    onOpen: (event: Event, id: string) => {
      console.log(`WebSocket ${id} connected:`, event);
      config.onOpen?.(event, id);
    },
    onMessage: (event: MessageEvent, id: string) => {
      console.log(`WebSocket ${id} message received:`, event.data);
      
      try {
        const data = JSON.parse(event.data);
        
        // Dispatch custom events based on message type and connection
        if (data.type) {
          window.dispatchEvent(new CustomEvent(`websocket:${id}:${data.type}`, {
            detail: { ...data, connectionId: id }
          }));
        }
        
        // Also dispatch a general event for this connection
        window.dispatchEvent(new CustomEvent(`websocket:${id}:message`, {
          detail: { data, connectionId: id, rawEvent: event }
        }));
      } catch (error) {
      }
      
      config.onMessage?.(event, id);
    }
  })), [configs]);

  const multipleWebSockets = useMultipleWebSockets(configsWithHandlers);

  const getConnection = (id: string) => {
    return multipleWebSockets.connections.get(id);
  };

  const contextValue: WebSocketContextType = {
    ...multipleWebSockets,
    getConnection,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
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
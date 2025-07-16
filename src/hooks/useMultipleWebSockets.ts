import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketConfig {
  id: string;
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onOpen?: (event: Event, id: string) => void;
  onMessage?: (event: MessageEvent, id: string) => void;
  onClose?: (event: CloseEvent, id: string) => void;
  onError?: (event: Event, id: string) => void;
}

export interface WebSocketConnection {
  id: string;
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
  config: WebSocketConfig;
}

export interface MultipleWebSocketsState {
  connections: Map<string, WebSocketConnection>;
}

export const useMultipleWebSockets = (configs: WebSocketConfig[]) => {
  const [state, setState] = useState<MultipleWebSocketsState>({
    connections: new Map(),
  });

  const reconnectTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const shouldReconnectRef = useRef<Map<string, boolean>>(new Map());

  const updateConnection = useCallback((id: string, updates: Partial<WebSocketConnection>) => {
    setState(prev => {
      const newConnections = new Map(prev.connections);
      const existing = newConnections.get(id);
      if (existing) {
        newConnections.set(id, { ...existing, ...updates });
      }
      return { connections: newConnections };
    });
  }, []);

  const connect = useCallback((id: string) => {
    const connection = state.connections.get(id);
    if (!connection || connection.isConnecting || connection.isConnected) {
      return;
    }

    updateConnection(id, {
      isConnecting: true,
      error: null,
    });

    try {
      const socket = new WebSocket(connection.config.url, connection.config.protocols);

      socket.onopen = (event) => {
        updateConnection(id, {
          socket,
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectAttempts: 0,
        });
        connection.config.onOpen?.(event, id);
      };

      socket.onmessage = (event) => {
        connection.config.onMessage?.(event, id);
      };

      socket.onclose = (event) => {
        updateConnection(id, {
          socket: null,
          isConnected: false,
          isConnecting: false,
        });

        connection.config.onClose?.(event, id);

        // Attempt to reconnect if it wasn't a manual close
        const shouldReconnect = shouldReconnectRef.current.get(id);
        if (shouldReconnect && connection.reconnectAttempts < (connection.config.maxReconnectAttempts || 5)) {
          updateConnection(id, {
            reconnectAttempts: connection.reconnectAttempts + 1,
          });

          const timeout = setTimeout(() => {
            connect(id);
          }, connection.config.reconnectInterval || 3000);

          reconnectTimeoutsRef.current.set(id, timeout);
        }
      };

      socket.onerror = (event) => {
        updateConnection(id, {
          error: 'WebSocket connection error',
          isConnecting: false,
        });
        connection.config.onError?.(event, id);
      };

    } catch (error) {
      updateConnection(id, {
        error: error instanceof Error ? error.message : 'Failed to create WebSocket',
        isConnecting: false,
      });
    }
  }, [state.connections, updateConnection]);

  const disconnect = useCallback((id: string) => {
    shouldReconnectRef.current.set(id, false);
    
    const timeout = reconnectTimeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      reconnectTimeoutsRef.current.delete(id);
    }

    const connection = state.connections.get(id);
    if (connection?.socket) {
      connection.socket.close();
    }

    updateConnection(id, {
      socket: null,
      isConnected: false,
      isConnecting: false,
      reconnectAttempts: 0,
    });
  }, [state.connections, updateConnection]);

  const sendMessage = useCallback((id: string, data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    const connection = state.connections.get(id);
    if (connection?.socket && connection.isConnected) {
      connection.socket.send(data);
      return true;
    }
    return false;
  }, [state.connections]);

  const reconnect = useCallback((id: string) => {
    disconnect(id);
    shouldReconnectRef.current.set(id, true);
    updateConnection(id, { reconnectAttempts: 0 });
    setTimeout(() => connect(id), 100);
  }, [disconnect, connect, updateConnection]);

  const disconnectAll = useCallback(() => {
    state.connections.forEach((_, id) => {
      disconnect(id);
    });
  }, [state.connections, disconnect]);

  const reconnectAll = useCallback(() => {
    state.connections.forEach((_, id) => {
      reconnect(id);
    });
  }, [state.connections, reconnect]);

  // Initialize connections when configs change
  useEffect(() => {
    const newConnections = new Map<string, WebSocketConnection>();
    
    configs.forEach(config => {
      const existing = state.connections.get(config.id);
      newConnections.set(config.id, existing || {
        id: config.id,
        socket: null,
        isConnected: false,
        isConnecting: false,
        error: null,
        reconnectAttempts: 0,
        config,
      });
      
      // Set up reconnect flag
      shouldReconnectRef.current.set(config.id, true);
    });

    setState({ connections: newConnections });

    // Connect all new connections
    configs.forEach(config => {
      if (!state.connections.has(config.id)) {
        setTimeout(() => connect(config.id), 100);
      }
    });

    // Cleanup removed connections
    state.connections.forEach((_, id) => {
      if (!configs.find(c => c.id === id)) {
        disconnect(id);
      }
    });
  }, [configs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reconnectTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      reconnectTimeoutsRef.current.clear();
      
      state.connections.forEach(connection => {
        if (connection.socket) {
          connection.socket.close();
        }
      });
    };
  }, []);

  return {
    connections: state.connections,
    connect,
    disconnect,
    reconnect,
    sendMessage,
    disconnectAll,
    reconnectAll,
  };
};
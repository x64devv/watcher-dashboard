import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

export interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
}

export const useWebSocket = (config: WebSocketConfig) => {
  const {
    url,
    protocols,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onOpen,
    onMessage,
    onClose,
    onError,
  } = config;

  const [state, setState] = useState<WebSocketState>({
    socket: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
  });

  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const shouldReconnectRef = useRef(true);

  const connect = useCallback(() => {
    if (state.isConnecting || state.isConnected) {
      return;
    }

    setState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      const socket = new WebSocket(url);

      socket.onopen = (event) => {
        setState(prev => ({
          ...prev,
          socket,
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectAttempts: 0,
        }));
        onOpen?.(event);
      };

      socket.onmessage = (event) => {
        onMessage?.(event);
      };

      socket.onclose = (event) => {
        setState(prev => ({
          ...prev,
          socket: null,
          isConnected: false,
          isConnecting: false,
        }));

        onClose?.(event);

        // Attempt to reconnect if it wasn't a manual close
        if (shouldReconnectRef.current && state.reconnectAttempts < maxReconnectAttempts) {
          setState(prev => ({
            ...prev,
            reconnectAttempts: prev.reconnectAttempts + 1,
          }));

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      socket.onerror = (event) => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          isConnecting: false,
        }));
        onError?.(event);
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create WebSocket',
        isConnecting: false,
      }));
    }
  }, [url, protocols, onOpen, onMessage, onClose, onError, reconnectInterval, maxReconnectAttempts, state.isConnecting, state.isConnected, state.reconnectAttempts]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (state.socket) {
      state.socket.close();
    }

    setState(prev => ({
      ...prev,
      socket: null,
      isConnected: false,
      isConnecting: false,
      reconnectAttempts: 0,
    }));
  }, [state.socket]);

  const sendMessage = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (state.socket && state.isConnected) {
      state.socket.send(data);
      return true;
    }
    return false;
  }, [state.socket, state.isConnected]);

  const reconnect = useCallback(() => {
    disconnect();
    shouldReconnectRef.current = true;
    setState(prev => ({ ...prev, reconnectAttempts: 0 }));
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  // Connect on mount
  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();

    // Cleanup on unmount
    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (state.socket) {
        state.socket.close();
      }
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    reconnect,
    sendMessage,
  };
};
import React from 'react';
import { Wifi, WifiOff, AlertCircle, RotateCcw } from 'lucide-react';
import { useWebSocketContext } from '../context/WebSocketContext';

interface WebSocketStatusProps {
  className?: string;
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ className = '' }) => {
  const { isConnected, isConnecting, error, reconnectAttempts, reconnect } = useWebSocketContext();

  const getStatusIcon = () => {
    if (isConnecting) {
      return <RotateCcw className="w-4 h-4 animate-spin" />;
    }
    if (isConnected) {
      return <Wifi className="w-4 h-4" />;
    }
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (isConnecting) {
      return 'text-yellow-600 bg-yellow-50';
    }
    if (isConnected) {
      return 'text-green-600 bg-green-50';
    }
    return 'text-red-600 bg-red-50';
  };

  const getStatusText = () => {
    if (isConnecting) {
      return 'Connecting...';
    }
    if (isConnected) {
      return 'Connected';
    }
    if (error) {
      return `Error: ${error}`;
    }
    return 'Disconnected';
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
      
      {reconnectAttempts > 0 && (
        <span className="text-xs opacity-75">
          (Attempt {reconnectAttempts})
        </span>
      )}
      
      {error && !isConnecting && (
        <button
          onClick={reconnect}
          className="ml-2 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
          title="Retry connection"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default WebSocketStatus;
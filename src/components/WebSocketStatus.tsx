import React from 'react';
import { Wifi, WifiOff, AlertCircle, RotateCcw, Server } from 'lucide-react';
import { useWebSocketContext } from '../context/WebSocketContext';

interface WebSocketStatusProps {
  connectionId?: string;
  className?: string;
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ connectionId, className = '' }) => {
  const { getConnection, reconnect, connections } = useWebSocketContext();

  // If no connectionId provided, show status for all connections
  if (!connectionId) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {Array.from(connections.entries()).map(([id, connection]) => (
          <WebSocketStatus key={id} connectionId={id} />
        ))}
      </div>
    );
  }

  const connection = getConnection(connectionId);
  
  if (!connection) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 bg-gray-50 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Connection not found</span>
      </div>
    );
  }

  const { isConnected, isConnecting, error, reconnectAttempts } = connection;

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
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor()} ${className}`} title={`Connection: ${connectionId}`}>
      <Server className="w-3 h-3 opacity-75" />
      {getStatusIcon()}
      <span className="text-sm font-medium">
        {connectionId}: {getStatusText()}
      </span>
      
      {reconnectAttempts > 0 && (
        <span className="text-xs opacity-75">
          (Attempt {reconnectAttempts})
        </span>
      )}
      
      {error && !isConnecting && (
        <button
          onClick={() => reconnect(connectionId)}
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
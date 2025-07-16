import React from 'react';
import { Plus, Trash2, Settings, Power, PowerOff } from 'lucide-react';
import { useWebSocketContext } from '../context/WebSocketContext';
import WebSocketStatus from './WebSocketStatus';

interface MultiWebSocketManagerProps {
  className?: string;
}

const MultiWebSocketManager: React.FC<MultiWebSocketManagerProps> = ({ className = '' }) => {
  const { connections, disconnect, reconnect, disconnectAll, reconnectAll, sendMessage } = useWebSocketContext();
  const [testMessage, setTestMessage] = React.useState('{"type": "ping", "data": "test"}');

  const handleSendTestMessage = (connectionId: string) => {
    if (testMessage.trim()) {
      sendMessage(connectionId, testMessage);
    }
  };

  const handleSendToAll = () => {
    if (testMessage.trim()) {
      connections.forEach((_, id) => {
        sendMessage(id, testMessage);
      });
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">WebSocket Manager</h3>
            <p className="text-sm text-gray-500">
              Manage multiple WebSocket connections ({connections.size} active)
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={reconnectAll}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Power className="w-4 h-4" />
            Reconnect All
          </button>
          <button
            onClick={disconnectAll}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <PowerOff className="w-4 h-4" />
            Disconnect All
          </button>
        </div>
      </div>

      {/* Connection List */}
      <div className="space-y-4 mb-6">
        {Array.from(connections.entries()).map(([id, connection]) => (
          <div key={id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <WebSocketStatus connectionId={id} />
              <div className="text-sm text-gray-600">
                <div className="font-medium">{connection.config.url}</div>
                {connection.error && (
                  <div className="text-red-600 text-xs mt-1">{connection.error}</div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSendTestMessage(id)}
                disabled={!connection.isConnected}
                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Test
              </button>
              <button
                onClick={() => connection.isConnected ? disconnect(id) : reconnect(id)}
                className={`p-2 rounded-lg transition-colors ${
                  connection.isConnected
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                {connection.isConnected ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Message Input */}
      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Message (JSON)
        </label>
        <div className="flex gap-2">
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder='{"type": "ping", "data": "test"}'
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
            rows={3}
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSendToAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send to All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiWebSocketManager;
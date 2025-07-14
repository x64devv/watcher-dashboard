import React, { useEffect, useRef } from 'react';
import { Terminal, AlertTriangle, Info, AlertCircle, Bug } from 'lucide-react';
import { LaravelLogEntry } from '../types/dashboard';
import LogFilters from './LogFilters';

interface LogFeedProps {
  logs: LaravelLogEntry[];
  className?: string;
}

const LogFeed: React.FC<LogFeedProps> = ({ logs, className = '' }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = React.useState({
    levels: [] as string[],
    search: '',
    timeRange: 'all',
  });

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Filter logs based on current filters
  const filteredLogs = React.useMemo(() => {
    let filtered = logs;

    // Filter by log levels
    if (filters.levels.length > 0) {
      filtered = filtered.filter(log => filters.levels.includes(log.level));
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm) ||
        log.level.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by time range
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const timeRangeMs = {
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
      }[filters.timeRange] || 0;

      if (timeRangeMs > 0) {
        const cutoffTime = new Date(now.getTime() - timeRangeMs);
        filtered = filtered.filter(log => new Date(log.timestamp) >= cutoffTime);
      }
    }

    return filtered;
  }, [logs, filters]);
  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
      case 'alert':
      case 'emergency':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      case 'info':
      case 'notice':
        return Info;
      case 'debug':
        return Bug;
      default:
        return Terminal;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
      case 'alert':
      case 'emergency':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
      case 'notice':
        return 'text-blue-600 bg-blue-50';
      case 'debug':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <Terminal className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Laravel Logs</h3>
            <p className="text-sm text-gray-500">
              Real-time application logs 
              {filteredLogs.length !== logs.length && (
                <span className="ml-2 text-blue-600">
                  ({filteredLogs.length} of {logs.length} shown)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      
      <LogFilters filters={filters} onFiltersChange={setFilters} />
      
      <div
        ref={logContainerRef}
        className="h-96 overflow-y-auto p-4 space-y-3 font-mono text-sm"
      >
        {filteredLogs.map((log) => {
          const Icon = getLogIcon(log.level);
          const colorClass = getLogColor(log.level);
          
          return (
            <div
              key={log.id}
              className={`flex items-start gap-3 p-3 rounded-lg ${colorClass} hover:opacity-80 transition-opacity`}
            >
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium uppercase text-xs">{log.level}</span>
                  <span className="text-xs opacity-75">{formatTimestamp(log.timestamp)}</span>
                </div>
                <p className="text-sm break-words">{log.message}</p>
                {log.context && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs opacity-75 hover:opacity-100">
                      Context
                    </summary>
                    <pre className="mt-1 text-xs opacity-75 overflow-x-auto">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          );
        })}
        
        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent logs available</p>
          </div>
        )}
        
        {logs.length > 0 && filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No logs match the current filters</p>
            <button
              onClick={() => setFilters({ levels: [], search: '', timeRange: 'all' })}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogFeed;
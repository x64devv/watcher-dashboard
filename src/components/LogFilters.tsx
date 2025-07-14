import React from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';

interface LogFiltersProps {
  filters: {
    levels: string[];
    search: string;
    timeRange: string;
  };
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const logLevels = [
  { value: 'emergency', label: 'Emergency', color: 'bg-red-600' },
  { value: 'alert', label: 'Alert', color: 'bg-red-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
  { value: 'error', label: 'Error', color: 'bg-red-400' },
  { value: 'warning', label: 'Warning', color: 'bg-yellow-400' },
  { value: 'notice', label: 'Notice', color: 'bg-blue-400' },
  { value: 'info', label: 'Info', color: 'bg-blue-400' },
  { value: 'debug', label: 'Debug', color: 'bg-gray-400' },
];

const timeRanges = [
  { value: 'all', label: 'All Time' },
  { value: '1h', label: 'Last Hour' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
];

const LogFilters: React.FC<LogFiltersProps> = ({ filters, onFiltersChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleLevelToggle = (level: string) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter(l => l !== level)
      : [...filters.levels, level];
    
    onFiltersChange({ ...filters, levels: newLevels });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleTimeRangeChange = (timeRange: string) => {
    onFiltersChange({ ...filters, timeRange });
  };

  const clearFilters = () => {
    onFiltersChange({
      levels: [],
      search: '',
      timeRange: 'all',
    });
  };

  const hasActiveFilters = filters.levels.length > 0 || filters.search || filters.timeRange !== 'all';

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="p-4">
        {/* Filter Toggle and Search */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                {filters.levels.length + (filters.search ? 1 : 0) + (filters.timeRange !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search log messages..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Log Levels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Log Levels</label>
              <div className="flex flex-wrap gap-2">
                {logLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleLevelToggle(level.value)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                      ${filters.levels.includes(level.value)
                        ? `${level.color} text-white shadow-sm`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className={`w-2 h-2 rounded-full ${level.color}`} />
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={filters.timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogFilters;
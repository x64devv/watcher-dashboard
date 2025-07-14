import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Bug, Clock, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import { LaravelStats as LaravelStatsType } from '../types/dashboard';

interface LaravelStatsProps {
  data: LaravelStatsType;
}

const LaravelStats: React.FC<LaravelStatsProps> = ({ data }) => {
  const maxErrors = Math.max(...data.errorTrends.map(item => item.errors));

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Logs"
          value={data.totalLogs.toLocaleString()}
          change={{ value: "+5.2%", type: "increase" }}
          icon={Bug}
        />
        <StatCard
          title="Errors"
          value={data.errorCount.toLocaleString()}
          change={{ value: "-3.1%", type: "decrease" }}
          icon={XCircle}
        />
        <StatCard
          title="Warnings"
          value={data.warningCount.toLocaleString()}
          change={{ value: "+1.8%", type: "increase" }}
          icon={AlertTriangle}
        />
        <StatCard
          title="Info Logs"
          value={data.infoCount.toLocaleString()}
          change={{ value: "+12.5%", type: "increase" }}
          icon={CheckCircle}
        />
        <StatCard
          title="Debug Logs"
          value={data.debugCount.toLocaleString()}
          change={{ value: "+8.7%", type: "increase" }}
          icon={Bug}
        />
      </div>

      {/* Error Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Error Trends (24h)</h3>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-2">
          {data.errorTrends.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-sm transition-all duration-500 hover:from-red-700 hover:to-red-500 cursor-pointer"
                style={{ height: `${maxErrors > 0 ? (item.errors / maxErrors) * 100 : 0}%` }}
                title={`${item.hour}: ${item.errors} errors`}
              />
              <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                {item.hour}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Errors and Slow Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Errors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Errors</h3>
          </div>
          
          <div className="space-y-4">
            {data.recentErrors.map((error) => (
              <div key={error.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-800 uppercase">{error.level}</span>
                  <span className="text-xs text-red-600">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Queries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Slow Queries</h3>
          </div>
          
          <div className="space-y-4">
            {data.slowQueries.map((query, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-800">{query.time}s</span>
                  <span className="text-xs text-yellow-600">
                    {new Date(query.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <code className="text-sm text-yellow-700 font-mono break-all">
                  {query.query}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaravelStats;
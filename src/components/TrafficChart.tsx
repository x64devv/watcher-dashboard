import React from 'react';
import { Activity } from 'lucide-react';

interface TrafficChartProps {
  data: Array<{
    hour: string;
    visits: number;
  }>;
  className?: string;
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data, className = '' }) => {
  const maxVisits = Math.max(...data.map(item => item.visits));

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Activity className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Hourly Traffic</h3>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500 hover:from-blue-700 hover:to-blue-500 cursor-pointer"
              style={{ height: `${(item.visits / maxVisits) * 100}%` }}
              title={`${item.hour}: ${item.visits} visits`}
            />
            <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
              {item.hour}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficChart;
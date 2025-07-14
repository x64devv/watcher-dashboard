import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  icon: LucideIcon;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, icon: Icon, className = '' }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-sm text-gray-500">{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">{item.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartCard;
import React from 'react';
import { ChevronDown, Globe, Circle } from 'lucide-react';
import { Site } from '../types/dashboard';

interface SiteSelectorProps {
  sites: Site[];
  selectedSite: Site;
  onSiteChange: (site: Site) => void;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({ sites, selectedSite, onSiteChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getStatusColor = (status: Site['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      case 'maintenance':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: Site['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors min-w-[200px]"
      >
        <Globe className="w-5 h-5 text-gray-500" />
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-900">{selectedSite.name}</div>
          <div className="text-sm text-gray-500">{selectedSite.domain}</div>
        </div>
        <div className="flex items-center gap-2">
          <Circle className={`w-2 h-2 fill-current ${getStatusColor(selectedSite.status)}`} />
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {sites.map((site) => (
            <button
              key={site.id}
              onClick={() => {
                onSiteChange(site);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <Globe className="w-5 h-5 text-gray-500" />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{site.name}</div>
                <div className="text-sm text-gray-500">{site.domain}</div>
              </div>
              <div className="flex items-center gap-2">
                <Circle className={`w-2 h-2 fill-current ${getStatusColor(site.status)}`} />
                <span className={`text-sm ${getStatusColor(site.status)}`}>
                  {getStatusText(site.status)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteSelector;
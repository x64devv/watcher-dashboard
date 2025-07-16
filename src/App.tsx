import React from 'react';
import { Monitor } from 'lucide-react';
import SiteSelector from './components/SiteSelector';
import TabNavigation from './components/TabNavigation';
import WebSocketStatus from './components/WebSocketStatus';
import NginxStats from './components/NginxStats';
import LaravelStats from './components/LaravelStats';
import LogFeed from './components/LogFeed';
import MultiWebSocketManager from './components/MultiWebSocketManager';
import { useDashboardData } from './hooks/useDashboardData';
import { useWebSocketContext } from './context/WebSocketContext';

function App() {
  const { sites, selectedSite, dashboardData, isLoading, setSelectedSite } = useDashboardData();
  const { sendMessage, getConnection } = useWebSocketContext();
  const [activeTab, setActiveTab] = React.useState('nginx');

  // Send site selection to WebSocket connections when site changes
  React.useEffect(() => {
    if (selectedSite) {
      const mainConnection = getConnection('main');
      const logsConnection = getConnection('logs');
      
      const message = JSON.stringify({
        type: 'site_selected',
        site: {
          id: selectedSite.id,
          name: selectedSite.name,
          domain: selectedSite.domain,
          status: selectedSite.status
        }
      });
      
      // Send to main connection if connected
      if (mainConnection?.isConnected) {
        sendMessage('main', message);
      }
      
      // Send to logs connection if connected
      if (logsConnection?.isConnected) {
        sendMessage('logs', message);
      }
    }
  }, [selectedSite, sendMessage, getConnection]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { nginx, laravel, liveLogs } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Server Dashboard</h1>
              </div>
            </div>
            <SiteSelector
              sites={sites}
              selectedSite={selectedSite}
              onSiteChange={setSelectedSite}
            />
            <WebSocketStatus />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabbed Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="p-6">
            {activeTab === 'nginx' && <NginxStats data={nginx} />}
            {activeTab === 'laravel' && <LaravelStats data={laravel} />}
            {activeTab === 'logs' && <LogFeed logs={liveLogs} />}
            {activeTab === 'websockets' && <MultiWebSocketManager />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
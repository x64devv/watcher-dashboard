import { useState, useEffect } from 'react';
import { DashboardData, Site, NginxStats, LaravelStats } from '../types/dashboard';

// Mock sites data (keeping this as static for now)
const mockSites: Site[] = [
  { id: '1', name: 'Main Website', domain: 'example.com', status: 'online' },
  { id: '2', name: 'Blog', domain: 'blog.example.com', status: 'online' },
  { id: '3', name: 'E-commerce', domain: 'shop.example.com', status: 'maintenance' },
  { id: '4', name: 'API Server', domain: 'api.example.com', status: 'online' },
  { id: '5', name: 'Dev Environment', domain: 'dev.example.com', status: 'offline' },
];

// Default/initial data structure
const getInitialNginxStats = (): NginxStats => ({
  totalVisits: 0,
  uniqueVisitors: 0,
  pageViews: 0,
  bounceRate: 0,
  avgSessionDuration: '0:00',
  topPages: [],
  browsers: [],
  operatingSystems: [],
  devices: [],
  statusCodes: [],
  hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    visits: 0,
  })),
  countryStats: [],
});

const getInitialLaravelStats = (): LaravelStats => ({
  totalLogs: 0,
  errorCount: 0,
  warningCount: 0,
  infoCount: 0,
  debugCount: 0,
  recentErrors: [],
  errorTrends: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    errors: 0,
  })),
  slowQueries: [],
});

const generateLiveLog = (id: string) => ({
  id,
  level: ['info', 'warning', 'error', 'debug'][Math.floor(Math.random() * 4)] as any,
  message: [
    'User authentication successful',
    'Cache cleared successfully',
    'Database query executed',
    'File uploaded to storage',
    'Email sent successfully',
    'API request processed',
    'Session started',
    'Password reset requested',
  ][Math.floor(Math.random() * 8)],
  timestamp: new Date().toISOString(),
  context: Math.random() > 0.7 ? { user_id: Math.floor(Math.random() * 1000) } : undefined,
});

export const useDashboardData = () => {
  const [sites] = useState<Site[]>(mockSites);
  const [selectedSite, setSelectedSite] = useState<Site>(mockSites[0]);
  const [dashboardData, setDashboardData] = useState<DashboardData>(() => ({
    site: mockSites[0],
    nginx: getInitialNginxStats(),
    laravel: getInitialLaravelStats(),
    liveLogs: [],
  }));
  const [isLoading, setIsLoading] = useState(false);

  // Handle WebSocket messages for Nginx stats (from 'main' connection)
  useEffect(() => {
    const handleNginxStats = (event: CustomEvent) => {
      const { data, connectionId } = event.detail;
      
      if (connectionId === 'main' && data.type === 'nginx_stats') {
        setDashboardData(prev => ({
          ...prev,
          nginx: {
            ...prev.nginx,
            ...data.stats,
          },
        }));
      }
    };

    window.addEventListener('websocket:main:nginx_stats', handleNginxStats as EventListener);
    
    return () => {
      window.removeEventListener('websocket:main:nginx_stats', handleNginxStats as EventListener);
    };
  }, []);

  // Handle WebSocket messages for Laravel stats (from 'logs' connection)
  useEffect(() => {
    const handleLaravelStats = (event: CustomEvent) => {
      const { data, connectionId } = event.detail;
      
      if (connectionId === 'logs' && data.type === 'laravel_stats') {
        setDashboardData(prev => ({
          ...prev,
          laravel: {
            ...prev.laravel,
            ...data.stats,
          },
        }));
      }
    };

    window.addEventListener('websocket:logs:laravel_stats', handleLaravelStats as EventListener);
    
    return () => {
      window.removeEventListener('websocket:logs:laravel_stats', handleLaravelStats as EventListener);
    };
  }, []);

  // Handle live log entries (from 'logs' connection)
  useEffect(() => {
    const handleLiveLog = (event: CustomEvent) => {
      const { data, connectionId } = event.detail;
      
      if (connectionId === 'logs' && data.type === 'live_log') {
        setDashboardData(prev => {
          const newLog = {
            id: data.log.id || Date.now().toString(),
            level: data.log.level,
            message: data.log.message,
            timestamp: data.log.timestamp || new Date().toISOString(),
            context: data.log.context,
            extra: data.log.extra,
          };
          
          const updatedLogs = [newLog, ...prev.liveLogs].slice(0, 100); // Keep only last 100 logs
          
          return {
            ...prev,
            liveLogs: updatedLogs,
          };
        });
      }
    };

    window.addEventListener('websocket:logs:live_log', handleLiveLog as EventListener);
    
    return () => {
      window.removeEventListener('websocket:logs:live_log', handleLiveLog as EventListener);
    };
  }, []);

  // Handle general data updates (could be from either connection)
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      const { data, connectionId } = event.detail;
      
      // Handle bulk data updates
      if (data.type === 'dashboard_update') {
        setDashboardData(prev => ({
          ...prev,
          ...(data.nginx && { nginx: { ...prev.nginx, ...data.nginx } }),
          ...(data.laravel && { laravel: { ...prev.laravel, ...data.laravel } }),
          ...(data.liveLogs && { liveLogs: data.liveLogs }),
        }));
      }
    };

    // Listen to both connections for general updates
    window.addEventListener('websocket:main:dashboard_update', handleDataUpdate as EventListener);
    window.addEventListener('websocket:logs:dashboard_update', handleDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('websocket:main:dashboard_update', handleDataUpdate as EventListener);
      window.removeEventListener('websocket:logs:dashboard_update', handleDataUpdate as EventListener);
    };
  }, []);

  // Update site in dashboard data when selected site changes
  useEffect(() => {
    setDashboardData(prev => ({
      ...prev,
      site: selectedSite,
    }));
  }, [selectedSite]);

  // Fallback: Generate some mock logs if no real logs are coming through (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only add mock logs if we have no real logs and no WebSocket connections are active
      setDashboardData(prev => {
        // If we already have logs from WebSocket, don't add mock ones
        if (prev.liveLogs.length > 0 && prev.liveLogs[0].id !== 'mock') {
          return prev;
        }
        
        const newLog = { ...generateLiveLog('mock-' + Date.now().toString()), id: 'mock-' + Date.now().toString() };
        const updatedLogs = [newLog, ...prev.liveLogs].slice(0, 50);
        
        return {
          ...prev,
          liveLogs: updatedLogs,
        };
      });
    }, 5000); // Add mock log every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    sites,
    selectedSite,
    dashboardData,
    isLoading,
    setSelectedSite,
  };
};
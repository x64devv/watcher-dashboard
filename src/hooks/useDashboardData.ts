import { useState, useEffect } from 'react';
import { DashboardData, Site } from '../types/dashboard';

// Mock data generator
const generateMockData = (site: Site): DashboardData => ({
  site,
  nginx: {
    totalVisits: Math.floor(Math.random() * 50000) + 10000,
    uniqueVisitors: Math.floor(Math.random() * 25000) + 5000,
    pageViews: Math.floor(Math.random() * 100000) + 20000,
    bounceRate: Math.floor(Math.random() * 40) + 30,
    avgSessionDuration: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    topPages: [
      { path: '/', visits: Math.floor(Math.random() * 5000) + 1000, percentage: 35 },
      { path: '/about', visits: Math.floor(Math.random() * 3000) + 500, percentage: 20 },
      { path: '/contact', visits: Math.floor(Math.random() * 2000) + 300, percentage: 15 },
      { path: '/services', visits: Math.floor(Math.random() * 1500) + 200, percentage: 12 },
      { path: '/blog', visits: Math.floor(Math.random() * 1000) + 100, percentage: 8 },
    ],
    browsers: [
      { name: 'Chrome', count: Math.floor(Math.random() * 15000) + 5000, percentage: 65 },
      { name: 'Firefox', count: Math.floor(Math.random() * 5000) + 1000, percentage: 20 },
      { name: 'Safari', count: Math.floor(Math.random() * 3000) + 500, percentage: 10 },
      { name: 'Edge', count: Math.floor(Math.random() * 1000) + 200, percentage: 5 },
    ],
    operatingSystems: [
      { name: 'Windows', count: Math.floor(Math.random() * 12000) + 3000, percentage: 55 },
      { name: 'macOS', count: Math.floor(Math.random() * 6000) + 1500, percentage: 25 },
      { name: 'Linux', count: Math.floor(Math.random() * 3000) + 800, percentage: 12 },
      { name: 'Android', count: Math.floor(Math.random() * 2000) + 500, percentage: 8 },
    ],
    devices: [
      { type: 'Desktop', count: Math.floor(Math.random() * 15000) + 5000, percentage: 70 },
      { type: 'Mobile', count: Math.floor(Math.random() * 8000) + 2000, percentage: 25 },
      { type: 'Tablet', count: Math.floor(Math.random() * 2000) + 500, percentage: 5 },
    ],
    statusCodes: [
      { code: '200', count: Math.floor(Math.random() * 45000) + 15000, percentage: 85 },
      { code: '404', count: Math.floor(Math.random() * 3000) + 1000, percentage: 8 },
      { code: '500', count: Math.floor(Math.random() * 1000) + 200, percentage: 4 },
      { code: '301', count: Math.floor(Math.random() * 800) + 100, percentage: 3 },
    ],
    hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      visits: Math.floor(Math.random() * 2000) + 100,
    })),
    countryStats: [
      { country: 'United States', count: Math.floor(Math.random() * 8000) + 2000, percentage: 35 },
      { country: 'United Kingdom', count: Math.floor(Math.random() * 4000) + 1000, percentage: 20 },
      { country: 'Canada', count: Math.floor(Math.random() * 3000) + 800, percentage: 15 },
      { country: 'Germany', count: Math.floor(Math.random() * 2000) + 500, percentage: 12 },
      { country: 'France', count: Math.floor(Math.random() * 1500) + 300, percentage: 8 },
    ],
  },
  laravel: {
    totalLogs: Math.floor(Math.random() * 10000) + 1000,
    errorCount: Math.floor(Math.random() * 100) + 10,
    warningCount: Math.floor(Math.random() * 200) + 20,
    infoCount: Math.floor(Math.random() * 500) + 100,
    debugCount: Math.floor(Math.random() * 1000) + 200,
    recentErrors: [
      {
        id: '1',
        level: 'error',
        message: 'Database connection failed',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        level: 'warning',
        message: 'Slow query detected: SELECT * FROM users',
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: '3',
        level: 'error',
        message: 'File not found: /storage/app/uploads/image.jpg',
        timestamp: new Date(Date.now() - 900000).toISOString(),
      },
    ],
    errorTrends: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      errors: Math.floor(Math.random() * 20),
    })),
    slowQueries: [
      {
        query: 'SELECT * FROM users WHERE created_at > ?',
        time: 2.5,
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
      {
        query: 'SELECT posts.*, users.name FROM posts JOIN users',
        time: 1.8,
        timestamp: new Date(Date.now() - 360000).toISOString(),
      },
    ],
  },
  liveLogs: [],
});

const mockSites: Site[] = [
  { id: '1', name: 'Main Website', domain: 'example.com', status: 'online' },
  { id: '2', name: 'Blog', domain: 'blog.example.com', status: 'online' },
  { id: '3', name: 'E-commerce', domain: 'shop.example.com', status: 'maintenance' },
  { id: '4', name: 'API Server', domain: 'api.example.com', status: 'online' },
  { id: '5', name: 'Dev Environment', domain: 'dev.example.com', status: 'offline' },
];

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
  const [dashboardData, setDashboardData] = useState<DashboardData>(() => 
    generateMockData(mockSites[0])
  );
  const [isLoading, setIsLoading] = useState(false);

  // Simulate API call when site changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDashboardData(generateMockData(selectedSite));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedSite]);

  // Simulate live log updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(prev => {
        const newLog = generateLiveLog(Date.now().toString());
        const updatedLogs = [newLog, ...prev.liveLogs].slice(0, 50); // Keep only last 50 logs
        
        return {
          ...prev,
          liveLogs: updatedLogs,
        };
      });
    }, 3000); // Add new log every 3 seconds

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
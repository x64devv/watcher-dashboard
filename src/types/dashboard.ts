export interface Site {
  id: string;
  name: string;
  domain: string;
  status: 'online' | 'offline' | 'maintenance';
}

export interface NginxStats {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: Array<{
    path: string;
    visits: number;
    percentage: number;
  }>;
  browsers: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  operatingSystems: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  devices: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  statusCodes: Array<{
    code: string;
    count: number;
    percentage: number;
  }>;
  hourlyTraffic: Array<{
    hour: string;
    visits: number;
  }>;
  countryStats: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
}

export interface LaravelStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  debugCount: number;
  recentErrors: Array<{
    id: string;
    level: string;
    message: string;
    timestamp: string;
    context?: any;
  }>;
  errorTrends: Array<{
    hour: string;
    errors: number;
  }>;
  slowQueries: Array<{
    query: string;
    time: number;
    timestamp: string;
  }>;
}

export interface LaravelLogEntry {
  id: string;
  level: 'emergency' | 'alert' | 'critical' | 'error' | 'warning' | 'notice' | 'info' | 'debug';
  message: string;
  timestamp: string;
  context?: any;
  extra?: any;
}

// WebSocket message types for type safety
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface NginxStatsMessage extends WebSocketMessage {
  type: 'nginx_stats';
  stats: Partial<NginxStats>;
}

export interface LaravelStatsMessage extends WebSocketMessage {
  type: 'laravel_stats';
  stats: Partial<LaravelStats>;
}

export interface LiveLogMessage extends WebSocketMessage {
  type: 'live_log';
  log: Partial<LaravelLogEntry>;
}

export interface DashboardUpdateMessage extends WebSocketMessage {
  type: 'dashboard_update';
  nginx?: Partial<NginxStats>;
  laravel?: Partial<LaravelStats>;
  liveLogs?: LaravelLogEntry[];
}

export interface SiteSelectedMessage extends WebSocketMessage {
  type: 'site_selected';
  site: Site;
}

export interface DashboardData {
  site: Site;
  nginx: NginxStats;
  laravel: LaravelStats;
  liveLogs: LaravelLogEntry[];
}
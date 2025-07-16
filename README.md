# Server Monitoring Dashboard

A real-time server monitoring dashboard built with React, TypeScript, and WebSockets.

## Features

- **Real-time Nginx Statistics**: Live web server metrics via WebSocket
- **Laravel Application Monitoring**: Real-time Laravel logs and performance metrics
- **Multi-site Support**: Switch between different monitored sites
- **Live Log Streaming**: Real-time log entries with filtering capabilities
- **WebSocket Management**: Monitor and manage multiple WebSocket connections

## WebSocket Integration

The dashboard connects to two WebSocket endpoints:

### Main Connection (`ws://localhost:8080/api/lara-sock`)
Handles Nginx statistics and general server metrics.

Expected message format for Nginx stats:
```json
{
  "type": "nginx_stats",
  "stats": {
    "totalVisits": 12345,
    "uniqueVisitors": 8901,
    "pageViews": 23456,
    "bounceRate": 45,
    "avgSessionDuration": "2:34",
    "topPages": [
      { "path": "/", "visits": 5000, "percentage": 35 }
    ],
    "browsers": [
      { "name": "Chrome", "count": 15000, "percentage": 65 }
    ],
    "hourlyTraffic": [
      { "hour": "00:00", "visits": 123 }
    ]
  }
}
```

### Logs Connection (`ws://localhost:8080/api/logs-sock`)
Handles Laravel application logs and statistics.

Expected message formats:

**Laravel Statistics:**
```json
{
  "type": "laravel_stats",
  "stats": {
    "totalLogs": 1000,
    "errorCount": 10,
    "warningCount": 25,
    "infoCount": 500,
    "debugCount": 465,
    "recentErrors": [
      {
        "id": "1",
        "level": "error",
        "message": "Database connection failed",
        "timestamp": "2025-01-27T10:30:00Z"
      }
    ],
    "errorTrends": [
      { "hour": "00:00", "errors": 2 }
    ],
    "slowQueries": [
      {
        "query": "SELECT * FROM users WHERE created_at > ?",
        "time": 2.5,
        "timestamp": "2025-01-27T10:30:00Z"
      }
    ]
  }
}
```

**Live Log Entry:**
```json
{
  "type": "live_log",
  "log": {
    "id": "unique-log-id",
    "level": "info",
    "message": "User authentication successful",
    "timestamp": "2025-01-27T10:30:00Z",
    "context": {
      "user_id": 123
    }
  }
}
```

## Site Selection

When a site is selected, the dashboard sends a message to both WebSocket connections:

```json
{
  "type": "site_selected",
  "site": {
    "id": "1",
    "name": "Main Website",
    "domain": "example.com",
    "status": "online"
  }
}
```

## Development

```bash
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## WebSocket Server Requirements

Your WebSocket servers should:

1. Accept connections at the specified endpoints
2. Handle the `site_selected` message to filter data by site
3. Send periodic updates with the expected message formats
4. Maintain connection stability with proper error handling

## Architecture

- **React + TypeScript**: Modern frontend framework with type safety
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Custom WebSocket Hooks**: Robust WebSocket management with reconnection
- **Event-driven Updates**: Custom events for real-time data flow
- **Modular Components**: Clean separation of concerns
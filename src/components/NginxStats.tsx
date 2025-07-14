import React from 'react';
import { Users, Eye, MousePointer, Clock, Globe, Monitor, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import TrafficChart from './TrafficChart';
import { NginxStats as NginxStatsType } from '../types/dashboard';

interface NginxStatsProps {
  data: NginxStatsType;
}

const NginxStats: React.FC<NginxStatsProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Visits"
          value={data.totalVisits.toLocaleString()}
          change={{ value: "+12.5%", type: "increase" }}
          icon={Eye}
        />
        <StatCard
          title="Unique Visitors"
          value={data.uniqueVisitors.toLocaleString()}
          change={{ value: "+8.3%", type: "increase" }}
          icon={Users}
        />
        <StatCard
          title="Page Views"
          value={data.pageViews.toLocaleString()}
          change={{ value: "+15.2%", type: "increase" }}
          icon={MousePointer}
        />
        <StatCard
          title="Bounce Rate"
          value={`${data.bounceRate}%`}
          change={{ value: "-2.1%", type: "decrease" }}
          icon={XCircle}
        />
        <StatCard
          title="Avg Session"
          value={data.avgSessionDuration}
          change={{ value: "+0:15", type: "increase" }}
          icon={Clock}
        />
      </div>

      {/* Traffic Chart */}
      <TrafficChart data={data.hourlyTraffic} />

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ChartCard
          title="Top Pages"
          data={data.topPages.map(page => ({
            name: page.path,
            value: page.visits,
            percentage: page.percentage,
          }))}
          icon={Globe}
        />
        <ChartCard
          title="Browsers"
          data={data.browsers.map(browser => ({
            name: browser.name,
            value: browser.count,
            percentage: browser.percentage,
          }))}
          icon={Monitor}
        />
        <ChartCard
          title="Operating Systems"
          data={data.operatingSystems.map(os => ({
            name: os.name,
            value: os.count,
            percentage: os.percentage,
          }))}
          icon={Monitor}
        />
        <ChartCard
          title="Devices"
          data={data.devices.map(device => ({
            name: device.type,
            value: device.count,
            percentage: device.percentage,
          }))}
          icon={Smartphone}
        />
        <ChartCard
          title="Status Codes"
          data={data.statusCodes.map(code => ({
            name: code.code,
            value: code.count,
            percentage: code.percentage,
          }))}
          icon={CheckCircle}
        />
        <ChartCard
          title="Countries"
          data={data.countryStats.map(country => ({
            name: country.country,
            value: country.count,
            percentage: country.percentage,
          }))}
          icon={Globe}
        />
      </div>
    </div>
  );
};

export default NginxStats;
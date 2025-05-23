
import React, { useState, useEffect } from 'react';
import { Activity, Globe, Server, Wifi, AlertCircle, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

const NetworkMonitoring = () => {
  const [networkStats, setNetworkStats] = useState({
    uptime: 99.97,
    latency: 12,
    throughput: 1847,
    errorRate: 0.03,
    activeNodes: 847,
    totalTransactions: 1247892,
    securityScore: 98.5
  });

  const [regionalData, setRegionalData] = useState([
    { region: 'North America', nodes: 234, latency: 8, status: 'optimal' },
    { region: 'Europe', nodes: 189, latency: 15, status: 'optimal' },
    { region: 'Asia Pacific', nodes: 298, latency: 22, status: 'good' },
    { region: 'South America', nodes: 67, latency: 35, status: 'good' },
    { region: 'Africa', nodes: 59, latency: 45, status: 'average' }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'High traffic detected in Asia Pacific region', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New nodes added to European cluster', time: '5 min ago' },
    { id: 3, type: 'success', message: 'Security patch deployed successfully', time: '15 min ago' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        latency: 10 + Math.random() * 10,
        throughput: 1800 + Math.random() * 100,
        activeNodes: 840 + Math.floor(Math.random() * 20),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 50)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'average': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-50 text-green-800';
      case 'warning': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'info': return 'border-blue-500 bg-blue-50 text-blue-800';
      default: return 'border-red-500 bg-red-50 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Globe className="w-6 h-6" />
          Global Network Monitoring
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">{networkStats.uptime}%</div>
            <div className="text-blue-100">Network Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{networkStats.latency.toFixed(1)}ms</div>
            <div className="text-blue-100">Avg Latency</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{networkStats.throughput.toFixed(0)}</div>
            <div className="text-blue-100">TPS</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{networkStats.securityScore}%</div>
            <div className="text-blue-100">Security Score</div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Network Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Network Uptime</span>
                <span className="font-bold text-green-600">{networkStats.uptime}%</span>
              </div>
              <Progress value={networkStats.uptime} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Throughput</span>
                <span className="font-bold text-blue-600">{networkStats.throughput.toFixed(0)} TPS</span>
              </div>
              <Progress value={(networkStats.throughput / 2000) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Error Rate</span>
                <span className="font-bold text-red-600">{networkStats.errorRate}%</span>
              </div>
              <Progress value={networkStats.errorRate * 20} className="h-2" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-500" />
            Node Distribution
          </h3>
          <div className="space-y-3">
            {regionalData.map((region) => (
              <div key={region.region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(region.status)}`}></div>
                  <span className="font-medium">{region.region}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{region.nodes} nodes</div>
                  <div className="text-sm text-gray-600">{region.latency}ms</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Network Alerts
        </h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border-l-4 p-3 rounded-r-lg ${getAlertColor(alert.type)}`}>
              <div className="flex justify-between items-start">
                <p className="font-medium">{alert.message}</p>
                <span className="text-sm opacity-75">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          Network Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{networkStats.activeNodes}</div>
            <div className="text-sm text-gray-600">Active Nodes</div>
            <Badge variant="secondary" className="mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12 today
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{networkStats.totalTransactions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Transactions</div>
            <Badge variant="secondary" className="mt-2">
              <Zap className="w-3 h-3 mr-1" />
              +247 today
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{networkStats.latency.toFixed(1)}ms</div>
            <div className="text-sm text-gray-600">Average Latency</div>
            <Badge variant="secondary" className="mt-2">
              <Activity className="w-3 h-3 mr-1" />
              Optimal
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{networkStats.securityScore}%</div>
            <div className="text-sm text-gray-600">Security Score</div>
            <Badge variant="secondary" className="mt-2">
              <Activity className="w-3 h-3 mr-1" />
              Excellent
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitoring;

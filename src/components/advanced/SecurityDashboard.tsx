
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Brain, Zap } from 'lucide-react';
import { useAdvancedSecurity } from '../../hooks/useAdvancedSecurity';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

const SecurityDashboard = () => {
  const { metrics, isScanning, aiInsights, runSecurityScan, resolveThreats } = useAdvancedSecurity();

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getMetricColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 60) return 'text-yellow-500';
    if (score < 80) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Risk Score</h3>
            <Shield className={`w-6 h-6 ${getMetricColor(metrics.riskScore)}`} />
          </div>
          <div className={`text-3xl font-bold ${getMetricColor(metrics.riskScore)} mb-2`}>
            {metrics.riskScore}%
          </div>
          <Progress value={metrics.riskScore} className="h-2" />
          <p className="text-sm text-gray-500 mt-2">
            Threat Level: <span className="font-semibold capitalize">{metrics.threatLevel}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Active Threats</h3>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-500 mb-2">
            {metrics.activeThreats.filter(t => !t.resolved).length}
          </div>
          <p className="text-sm text-gray-500">
            {metrics.anomaliesDetected} total detected
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Last Scan</h3>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-gray-800 mb-2">
            {metrics.lastScan.toLocaleTimeString()}
          </div>
          <Button 
            onClick={runSecurityScan} 
            disabled={isScanning}
            className="w-full"
            size="sm"
          >
            {isScanning ? 'Scanning...' : 'Run Scan'}
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6" />
          <h3 className="font-semibold text-lg">AI Security Insights</h3>
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span className="text-sm">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Threat Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {metrics.activeThreats.slice(-5).map((threat) => (
            <div key={threat.id} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
              threat.severity === 'critical' ? 'border-red-500 bg-red-50' :
              threat.severity === 'high' ? 'border-orange-500 bg-orange-50' :
              threat.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-green-500 bg-green-50'
            }`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    threat.severity === 'critical' ? 'bg-red-500 text-white' :
                    threat.severity === 'high' ? 'bg-orange-500 text-white' :
                    threat.severity === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {threat.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">{threat.source}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{threat.description}</p>
                <p className="text-xs text-gray-500">{threat.timestamp.toLocaleString()}</p>
              </div>
              {!threat.resolved && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveThreats([threat.id])}
                  className="ml-3"
                >
                  Resolve
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;

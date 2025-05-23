
import { useState, useEffect, useCallback } from 'react';

export interface AnalyticsData {
  users: {
    total: number;
    active: number;
    growth: number;
    retention: number;
  };
  security: {
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    incidents: number;
    resolved: number;
    riskScore: number;
  };
  performance: {
    uptime: number;
    latency: number;
    throughput: number;
    errorRate: number;
  };
  blockchain: {
    transactions: number;
    gasPrice: number;
    blockTime: number;
    validators: number;
  };
}

export const useAdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    users: {
      total: 15847,
      active: 12934,
      growth: 23.5,
      retention: 87.2
    },
    security: {
      threatLevel: 'low',
      incidents: 3,
      resolved: 142,
      riskScore: 15
    },
    performance: {
      uptime: 99.97,
      latency: 12.3,
      throughput: 1847,
      errorRate: 0.03
    },
    blockchain: {
      transactions: 1247892,
      gasPrice: 5.2,
      blockTime: 3.1,
      validators: 21
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshAnalytics = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAnalytics(prev => ({
      ...prev,
      users: {
        ...prev.users,
        active: prev.users.active + Math.floor(Math.random() * 10 - 5),
        growth: 20 + Math.random() * 10
      },
      security: {
        ...prev.security,
        riskScore: Math.max(0, Math.min(100, prev.security.riskScore + Math.floor(Math.random() * 10 - 5)))
      },
      performance: {
        ...prev.performance,
        latency: 10 + Math.random() * 10,
        throughput: 1800 + Math.random() * 100
      },
      blockchain: {
        ...prev.blockchain,
        transactions: prev.blockchain.transactions + Math.floor(Math.random() * 100),
        gasPrice: 4 + Math.random() * 3
      }
    }));

    setLastUpdated(new Date());
    setIsLoading(false);
  }, []);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [analytics]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        refreshAnalytics();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLoading, refreshAnalytics]);

  return {
    analytics,
    isLoading,
    lastUpdated,
    refreshAnalytics,
    exportData
  };
};

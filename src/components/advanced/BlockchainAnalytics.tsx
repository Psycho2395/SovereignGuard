
import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, DollarSign, Users, BarChart3, PieChart } from 'lucide-react';
import { Progress } from '../ui/progress';

const BlockchainAnalytics = () => {
  const [chainMetrics, setChainMetrics] = useState({
    bnbPrice: 312.45,
    gasPrice: 5.2,
    blockTime: 3.1,
    transactions: 1247892,
    validators: 21,
    stakingRewards: 8.7
  });

  const [networkHealth, setNetworkHealth] = useState({
    nodes: 847,
    uptime: 99.97,
    consensusRate: 100,
    throughput: 2000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setChainMetrics(prev => ({
        ...prev,
        bnbPrice: 310 + Math.random() * 10,
        gasPrice: 4 + Math.random() * 3,
        blockTime: 2.8 + Math.random() * 0.6,
        transactions: prev.transactions + Math.floor(Math.random() * 100)
      }));

      setNetworkHealth(prev => ({
        ...prev,
        nodes: 840 + Math.floor(Math.random() * 20),
        throughput: 1800 + Math.floor(Math.random() * 400)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Activity className="w-6 h-6" />
          BNB Smart Chain Analytics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">${chainMetrics.bnbPrice.toFixed(2)}</div>
            <div className="text-orange-100">BNB Price</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{chainMetrics.gasPrice.toFixed(1)} gwei</div>
            <div className="text-orange-100">Gas Price</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{chainMetrics.blockTime.toFixed(1)}s</div>
            <div className="text-orange-100">Block Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{chainMetrics.validators}</div>
            <div className="text-orange-100">Validators</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Network Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Network Uptime</span>
                <span className="font-bold text-green-600">{networkHealth.uptime}%</span>
              </div>
              <Progress value={networkHealth.uptime} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Consensus Rate</span>
                <span className="font-bold text-blue-600">{networkHealth.consensusRate}%</span>
              </div>
              <Progress value={networkHealth.consensusRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Throughput</span>
                <span className="font-bold text-purple-600">{networkHealth.throughput} TPS</span>
              </div>
              <Progress value={(networkHealth.throughput / 2000) * 100} className="h-2" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Transaction Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Transactions</span>
              <span className="font-bold text-2xl">{chainMetrics.transactions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Nodes</span>
              <span className="font-bold text-xl text-blue-600">{networkHealth.nodes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Staking Rewards</span>
              <span className="font-bold text-xl text-green-600">{chainMetrics.stakingRewards}% APY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainAnalytics;

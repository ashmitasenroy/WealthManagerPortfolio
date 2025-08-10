import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Wifi, Clock, Users } from 'lucide-react';

interface LiveDashboardProps {
  summary: any;
  holdings: any[];
}

interface LiveUpdate {
  id: string;
  symbol: string;
  change: number;
  changePercent: number;
  timestamp: Date;
  type: 'gain' | 'loss';
}

const LiveDashboard: React.FC<LiveDashboardProps> = ({ summary, holdings }) => {
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [activeUsers] = useState(Math.floor(Math.random() * 100) + 50);

  // Simulate live market updates
  useEffect(() => {
    if (!isLive || holdings.length === 0) return;

    const interval = setInterval(() => {
      const randomHolding = holdings[Math.floor(Math.random() * holdings.length)];
      const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
      const change = (randomHolding.value * changePercent) / 100;

      const newUpdate: LiveUpdate = {
        id: Date.now().toString(),
        symbol: randomHolding.symbol,
        change,
        changePercent,
        timestamp: new Date(),
        type: change >= 0 ? 'gain' : 'loss'
      };

      setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep only 10 recent updates
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive, holdings]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Live Feed */}
      <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Live Market Feed</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className={`text-xs font-medium ${isLive ? 'text-green-400' : 'text-red-400'}`}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isLive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLive ? 'Pause Feed' : 'Resume Feed'}
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {liveUpdates.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Waiting for market updates...</p>
              <p className="text-slate-500 text-sm">Live data will appear here</p>
            </div>
          ) : (
            liveUpdates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  update.type === 'gain'
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    update.type === 'gain' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {update.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{update.symbol}</p>
                    <p className="text-xs text-slate-400">{formatTime(update.timestamp)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${
                    update.type === 'gain' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {update.change >= 0 ? '+' : ''}₹{Math.abs(update.change).toFixed(2)}
                  </p>
                  <p className={`text-sm ${
                    update.type === 'gain' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {update.changePercent >= 0 ? '+' : ''}{update.changePercent.toFixed(2)}%
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Wifi className="w-5 h-5 text-green-400" />
            <h4 className="text-lg font-bold text-white">Connection Status</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Market Data</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Latency</span>
              <span className="text-blue-400 text-sm font-medium">12ms</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Last Update</span>
              <span className="text-white text-sm font-medium">
                {new Date().toLocaleTimeString('en-US', { 
                  hour12: false, 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Updates/min</span>
              <span className="text-purple-400 text-sm font-medium">20</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-bold text-white">Platform Activity</h4>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{activeUsers}</div>
            <p className="text-slate-400 text-sm">Active users</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs">+{Math.floor(Math.random() * 5) + 1} online</span>
            </div>
          </div>
        </div>

        {/* Market Hours */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h4 className="text-lg font-bold text-white">Market Status</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">NSE</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Open</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">BSE</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Open</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-700">
              <p className="text-slate-400 text-xs">Closes at 3:30 PM IST</p>
              <p className="text-white text-sm font-medium">
                {new Date().toLocaleTimeString('en-US', {
                  timeZone: 'Asia/Kolkata',
                  hour12: true,
                  hour: 'numeric',
                  minute: '2-digit'
                })} IST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;

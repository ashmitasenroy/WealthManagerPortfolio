import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';

interface Holding {
  symbol: string;
  name: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
  sector: string;
  marketCap?: string | number;
}

interface TopPerformersProps {
  holdings: Holding[];
}

const TopPerformers: React.FC<TopPerformersProps> = ({ holdings }) => {
  // Get top 5 gainers and losers
  const sortedByGain = [...holdings].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
  const topGainers = sortedByGain.slice(0, 5);
  const topLosers = sortedByGain.slice(-5).reverse();

  // Prepare data for chart
  const chartData = [
    ...topGainers.map(holding => ({
      symbol: holding.symbol,
      name: holding.name,
      performance: holding.gainLossPercent,
      value: holding.value,
      type: 'gainer'
    })),
    ...topLosers.map(holding => ({
      symbol: holding.symbol,
      name: holding.name,
      performance: holding.gainLossPercent,
      value: holding.value,
      type: 'loser'
    }))
  ].sort((a, b) => b.performance - a.performance);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-slate-300 text-sm">{data.symbol}</p>
          <p className={`font-semibold ${data.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.performance >= 0 ? '+' : ''}{data.performance.toFixed(2)}%
          </p>
          <p className="text-blue-400 text-sm">Value: ₹{data.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (performance: number) => {
    if (performance >= 10) return '#10b981'; // Green
    if (performance >= 5) return '#3b82f6';  // Blue
    if (performance >= 0) return '#06b6d4';  // Cyan
    if (performance >= -5) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Performance Chart */}
      <div className="xl:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Performance Overview</h3>
            <p className="text-slate-400 text-sm">Top and bottom performers by percentage return</p>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Gainers</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Losers</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="symbol" 
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="performance" 
                radius={[2, 2, 0, 0]}
                name="Performance %"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.performance)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers Lists */}
      <div className="space-y-6">
        {/* Top Gainers */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h4 className="text-lg font-bold text-white">Top Gainers</h4>
          </div>
          
          <div className="space-y-3">
            {topGainers.slice(0, 3).map((holding, index) => (
              <div key={holding.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {index === 0 && <Award className="w-5 h-5 text-yellow-400" />}
                    {index === 1 && <div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
                    {index === 2 && <div className="w-3 h-3 bg-amber-600 rounded-full"></div>}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{holding.symbol}</p>
                    <p className="text-slate-400 text-xs truncate max-w-20">{holding.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">
                    +{holding.gainLossPercent.toFixed(2)}%
                  </p>
                  <p className="text-slate-400 text-xs">
                    ₹{(holding.value/1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h4 className="text-lg font-bold text-white">Top Losers</h4>
          </div>
          
          <div className="space-y-3">
            {topLosers.slice(0, 3).map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{holding.symbol}</p>
                    <p className="text-slate-400 text-xs truncate max-w-20">{holding.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-bold text-sm">
                    {holding.gainLossPercent.toFixed(2)}%
                  </p>
                  <p className="text-slate-400 text-xs">
                    ₹{(holding.value/1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="xl:col-span-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <h4 className="text-lg font-bold text-white mb-4">Performance Metrics</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              {holdings.filter(h => h.gainLoss > 0).length}
            </p>
            <p className="text-slate-400 text-sm">Gainers</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">
              {holdings.filter(h => h.gainLoss < 0).length}
            </p>
            <p className="text-slate-400 text-sm">Losers</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {topGainers.length > 0 ? `+${topGainers[0].gainLossPercent.toFixed(1)}%` : '0%'}
            </p>
            <p className="text-slate-400 text-sm">Best Performer</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {((holdings.reduce((sum, h) => sum + h.gainLossPercent, 0) / holdings.length) || 0).toFixed(1)}%
            </p>
            <p className="text-slate-400 text-sm">Avg Return</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;

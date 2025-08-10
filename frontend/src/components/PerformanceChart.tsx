import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface PerformanceDataPoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
  gainLoss: number;
}

interface PerformanceChartProps {
  data?: PerformanceDataPoint[];
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

// Generate sample performance data
const generatePerformanceData = (currentValue: number, gainLoss: number): PerformanceDataPoint[] => {
  const data: PerformanceDataPoint[] = [];
  const startValue = currentValue - gainLoss;
  const baselineValue = startValue;
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    // Generate realistic portfolio growth with some volatility
    const progress = i / 29;
    const portfolioValue = startValue + (gainLoss * progress) + (Math.random() - 0.5) * (currentValue * 0.02);
    const benchmarkValue = baselineValue + (gainLoss * 0.7 * progress) + (Math.random() - 0.5) * (currentValue * 0.015);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      portfolioValue: Math.round(portfolioValue),
      benchmarkValue: Math.round(benchmarkValue),
      gainLoss: Math.round(portfolioValue - startValue)
    });
  }
  
  return data;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  totalValue,
  totalGainLoss,
  totalGainLossPercent
}) => {
  const chartData = data || generatePerformanceData(totalValue, totalGainLoss);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-slate-300 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'portfolioValue' && '📈 Portfolio: '}
              {entry.dataKey === 'benchmarkValue' && '📊 Benchmark: '}
              {entry.dataKey === 'gainLoss' && '💰 Gain/Loss: '}
              ₹{entry.value.toLocaleString()}
              {entry.dataKey === 'gainLoss' && entry.value >= 0 && ' (+)'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Portfolio Performance</h3>
          <p className="text-slate-400 text-sm">30-day performance trend</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Total Return</p>
          <p className={`text-lg font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLoss >= 0 ? '+' : ''}₹{totalGainLoss.toLocaleString()} 
            <span className="text-sm ml-1">({totalGainLossPercent.toFixed(2)}%)</span>
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Area
              type="monotone"
              dataKey="portfolioValue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
              name="Portfolio Value"
            />
            <Area
              type="monotone"
              dataKey="benchmarkValue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#benchmarkGradient)"
              name="Benchmark"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Max Gain</p>
          <p className="text-green-400 font-semibold">+₹{Math.max(...chartData.map(d => d.gainLoss)).toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Volatility</p>
          <p className="text-blue-400 font-semibold">
            {(Math.sqrt(chartData.reduce((acc, curr, idx) => {
              if (idx === 0) return 0;
              const change = (curr.portfolioValue - chartData[idx-1].portfolioValue) / chartData[idx-1].portfolioValue;
              return acc + Math.pow(change, 2);
            }, 0) / (chartData.length - 1)) * Math.sqrt(252) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Win Rate</p>
          <p className="text-purple-400 font-semibold">
            {((chartData.filter((d, i) => i > 0 && d.portfolioValue > chartData[i-1].portfolioValue).length / (chartData.length - 1)) * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

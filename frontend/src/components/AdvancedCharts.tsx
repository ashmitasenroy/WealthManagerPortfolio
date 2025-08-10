import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Calendar, Filter } from 'lucide-react';

interface AdvancedChartsProps {
  summary: any;
}

// Generate sample time series data for different periods
const generateTimeSeriesData = (days: number, startValue: number, endValue: number) => {
  const data: Array<{
    date: string;
    fullDate: string;
    portfolioValue: number;
    benchmarkValue: number;
    volume: number;
    dayChange: number;
  }> = [];
  const totalGrowth = endValue - startValue;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    // Create realistic market movement with volatility
    const progress = i / (days - 1);
    const baseValue = startValue + (totalGrowth * progress);
    const volatility = startValue * 0.02; // 2% daily volatility
    const randomFactor = (Math.random() - 0.5) * volatility;
    
    const portfolioValue = Math.max(baseValue + randomFactor, startValue * 0.8);
    const benchmarkValue = startValue + (totalGrowth * 0.6 * progress) + randomFactor * 0.5;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString(),
      portfolioValue: Math.round(portfolioValue),
      benchmarkValue: Math.round(benchmarkValue),
      volume: Math.round(Math.random() * 1000000 + 500000),
      dayChange: i > 0 ? Math.round(portfolioValue - (data[i-1]?.portfolioValue || 0)) : 0
    });
  }
  
  return data;
};

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ summary }) => {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'line' | 'area' | 'candlestick'>('area');
  const [showVolume, setShowVolume] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState(['portfolio', 'benchmark']);

  // Generate data based on selected time range
  const getDataForRange = () => {
    const currentValue = summary?.totalValue || 1000000;
    const currentGain = summary?.totalGainLoss || 50000;
    
    const ranges = {
      '1D': { days: 1, startValue: currentValue - currentGain },
      '1W': { days: 7, startValue: currentValue - currentGain },
      '1M': { days: 30, startValue: currentValue - currentGain },
      '3M': { days: 90, startValue: currentValue - (currentGain * 1.5) },
      '1Y': { days: 365, startValue: currentValue - (currentGain * 3) }
    };
    
    const range = ranges[timeRange];
    return generateTimeSeriesData(range.days, range.startValue, currentValue);
  };

  const chartData = getDataForRange();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl"
        >
          <p className="text-slate-300 text-sm mb-2 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-1">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-300 capitalize">
                  {entry.dataKey.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
              <span className="text-sm font-semibold text-white">
                {entry.dataKey.includes('Value') ? `₹${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          {payload[0]?.payload?.dayChange && (
            <div className="border-t border-slate-600 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Day Change</span>
                <span className={`text-xs font-semibold ${
                  payload[0].payload.dayChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {payload[0].payload.dayChange >= 0 ? '+' : ''}₹{payload[0].payload.dayChange.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false}
            tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {selectedMetrics.includes('portfolio') && (
            <Line
              type="monotone"
              dataKey="portfolioValue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              name="Portfolio"
            />
          )}
          {selectedMetrics.includes('benchmark') && (
            <Line
              type="monotone"
              dataKey="benchmarkValue"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Benchmark"
            />
          )}
        </LineChart>
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false}
            tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {selectedMetrics.includes('portfolio') && (
            <Area
              type="monotone"
              dataKey="portfolioValue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
              name="Portfolio"
            />
          )}
          {selectedMetrics.includes('benchmark') && (
            <Area
              type="monotone"
              dataKey="benchmarkValue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#benchmarkGradient)"
              name="Benchmark"
            />
          )}
        </AreaChart>
      );
    }

    // Combined chart with volume
    return (
      <ComposedChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
        <YAxis 
          yAxisId="value"
          stroke="#9ca3af" 
          fontSize={12} 
          tickLine={false}
          tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
        />
        {showVolume && (
          <YAxis 
            yAxisId="volume"
            orientation="right"
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false}
            tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        
        {showVolume && (
          <Bar
            yAxisId="volume"
            dataKey="volume"
            fill="#6366f1"
            opacity={0.3}
            name="Volume"
          />
        )}
        
        {selectedMetrics.includes('portfolio') && (
          <Area
            yAxisId="value"
            type="monotone"
            dataKey="portfolioValue"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            name="Portfolio"
          />
        )}
        {selectedMetrics.includes('benchmark') && (
          <Line
            yAxisId="value"
            type="monotone"
            dataKey="benchmarkValue"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Benchmark"
          />
        )}
      </ComposedChart>
    );
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Advanced Portfolio Analytics</h3>
          <p className="text-slate-400 text-sm">Interactive performance visualization with multiple timeframes</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-slate-700 rounded-lg p-1">
            {(['1D', '1W', '1M', '3M', '1Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-slate-700 rounded-lg p-1">
            {[
              { type: 'area', icon: '📈', label: 'Area' },
              { type: 'line', icon: '📊', label: 'Line' },
              { type: 'candlestick', icon: '📉', label: 'Volume' }
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => setChartType(type as any)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all flex items-center space-x-1 ${
                  chartType === type
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Volume Toggle */}
          {chartType === 'candlestick' && (
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-all ${
                showVolume
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              Volume
            </button>
          )}
        </div>
      </div>

      {/* Metrics Selector */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Show:</span>
        </div>
        {[
          { key: 'portfolio', label: 'Portfolio', color: '#3b82f6' },
          { key: 'benchmark', label: 'Benchmark', color: '#10b981' }
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-all ${
              selectedMetrics.includes(key)
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedMetrics.includes(key) ? color : '#64748b' }}
            />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${timeRange}-${chartType}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-96"
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-700"
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide">Period High</p>
          <p className="text-green-400 font-semibold">
            ₹{Math.max(...chartData.map(d => d.portfolioValue)).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide">Period Low</p>
          <p className="text-red-400 font-semibold">
            ₹{Math.min(...chartData.map(d => d.portfolioValue)).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide">Avg Volume</p>
          <p className="text-blue-400 font-semibold">
            {((chartData.reduce((sum, d) => sum + d.volume, 0) / chartData.length) / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide">Period Return</p>
          <p className="text-purple-400 font-semibold">
            {(((chartData[chartData.length - 1]?.portfolioValue - chartData[0]?.portfolioValue) / chartData[0]?.portfolioValue) * 100).toFixed(2)}%
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedCharts;

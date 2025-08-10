import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AllocationData {
  sector: string;
  value: number;
  percentage: number;
}

interface AllocationChartsProps {
  data: AllocationData[];
}

const COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green  
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
];

const AllocationCharts: React.FC<AllocationChartsProps> = ({ data }) => {
  const pieData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{data.sector}</p>
          <p className="text-blue-400">Value: ₹{data.value.toLocaleString()}</p>
          <p className="text-green-400">Allocation: {data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null; // Don't show labels for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Sector Allocation</h3>
            <p className="text-slate-400 text-sm">Portfolio distribution by sector</p>
          </div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
                strokeWidth={2}
                stroke="#1e293b"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-slate-300 truncate">{entry.sector}</span>
              <span className="text-xs text-slate-400 ml-auto">{entry.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Investment Value</h3>
            <p className="text-slate-400 text-sm">Absolute values by sector</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg">Value</button>
            <button className="px-3 py-1 bg-slate-600 text-white text-xs rounded-lg">%</button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="sector" 
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Investment Value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-700">
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wide">Top Sector</p>
            <p className="text-blue-400 font-semibold text-sm">
              {data.length > 0 ? data[0].sector : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wide">Sectors</p>
            <p className="text-green-400 font-semibold text-sm">{data.length}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wide">Concentration</p>
            <p className="text-purple-400 font-semibold text-sm">
              {data.length > 0 ? `${data[0].percentage.toFixed(0)}%` : '0%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationCharts;

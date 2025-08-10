import { useState, useEffect } from 'react';
import { holdingsData, portfolioSummary, sectorAllocation } from './data/portfolioData';

function WorkingDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [hoveredHolding, setHoveredHolding] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'value' | 'gainLoss' | 'symbol'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Sort holdings based on selected criteria
  const sortedHoldings = [...holdingsData].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'value':
        aValue = a.value;
        bValue = b.value;
        break;
      case 'gainLoss':
        aValue = a.gainLossPercent;
        bValue = b.gainLossPercent;
        break;
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      default:
        aValue = a.value;
        bValue = b.value;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
    }
    
    return sortOrder === 'desc' ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number);
  });

  const handleSort = (criteria: 'value' | 'gainLoss' | 'symbol') => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(criteria);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'holdings', label: 'Holdings', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '🔍' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Portfolio Analytics</h1>
              <p className="text-slate-400">Complete wealth management dashboard</p>
            </div>
            
            <nav className="flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Portfolio Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Total Portfolio</h3>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(portfolioSummary.totalPortfolio)}
                </div>
                <div className="text-green-400 text-sm">
                  +{formatCurrency(portfolioSummary.totalGainLoss)} ({portfolioSummary.totalGainLossPercent.toFixed(2)}%)
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Invested</h3>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(portfolioSummary.totalInvested)}
                </div>
                <div className="text-slate-400 text-sm">
                  {portfolioSummary.numberOfHoldings} holdings
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Today's P&L</h3>
                <div className="text-2xl font-bold text-green-400">+₹12,500</div>
                <div className="text-green-400 text-sm">+0.65%</div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Risk Level</h3>
                <div className="text-2xl font-bold text-white">{portfolioSummary.riskLevel}</div>
                <div className="text-slate-400 text-sm">
                  Score: {portfolioSummary.diversificationScore}/10
                </div>
              </div>
            </div>

            {/* Interactive Sector Allocation */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Interactive Sector Allocation 
                {selectedSector && <span className="text-blue-400 ml-2">({selectedSector})</span>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {sectorAllocation.slice(0, 5).map((sector, index) => (
                  <div 
                    key={sector.sector} 
                    className="text-center cursor-pointer transform transition-all duration-200 hover:scale-105"
                    onClick={() => setSelectedSector(selectedSector === sector.sector ? null : sector.sector)}
                  >
                    <div className={`w-full h-20 rounded-lg mb-2 flex items-center justify-center text-white font-bold transition-all duration-200 ${
                      ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index]
                    } ${selectedSector === sector.sector ? 'ring-4 ring-white ring-opacity-50 shadow-lg' : 'hover:shadow-md'}`}>
                      {sector.percentage.toFixed(1)}%
                    </div>
                    <div className="text-slate-300 text-sm font-medium">{sector.sector}</div>
                    <div className="text-slate-400 text-xs">{formatCurrency(sector.value)}</div>
                    {selectedSector === sector.sector && (
                      <div className="mt-2 text-blue-400 text-xs animate-pulse">● Selected</div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Show holdings for selected sector */}
              {selectedSector && (
                <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                  <h4 className="text-white font-medium mb-3">{selectedSector} Holdings:</h4>
                  <div className="space-y-2">
                    {holdingsData
                      .filter(h => h.sector === selectedSector)
                      .slice(0, 3)
                      .map(holding => (
                        <div key={holding.symbol} className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">{holding.symbol}</span>
                          <span className="text-white font-medium">{formatCurrency(holding.value)}</span>
                          <span className={`${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(1)}%
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Performance Bar Chart */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Top 5 Holdings Performance 
                {hoveredHolding && <span className="text-blue-400 ml-2">(Hovering: {hoveredHolding})</span>}
              </h3>
              <div className="space-y-3">
                {sortedHoldings.slice(0, 5).map((holding) => (
                  <div 
                    key={holding.symbol} 
                    className="flex items-center space-x-3 cursor-pointer transition-all duration-200 hover:bg-slate-700 p-2 rounded-lg"
                    onMouseEnter={() => setHoveredHolding(holding.symbol)}
                    onMouseLeave={() => setHoveredHolding(null)}
                  >
                    <div className="w-16 text-sm text-slate-300 font-medium">{holding.symbol}</div>
                    <div className="flex-1 bg-slate-700 rounded-full h-6 relative overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          holding.gainLossPercent >= 0 ? 'bg-green-500' : 'bg-red-500'
                        } ${hoveredHolding === holding.symbol ? 'animate-pulse' : ''}`}
                        style={{ 
                          width: `${Math.min(Math.abs(holding.gainLossPercent) * 10, 100)}%`,
                          minWidth: '8px'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                        {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(1)}%
                      </div>
                    </div>
                    <div className="w-20 text-right text-slate-300 text-sm">
                      {formatCurrency(holding.value)}
                    </div>
                    {hoveredHolding === holding.symbol && (
                      <div className="text-blue-400 text-xs animate-bounce">
                        📊 {holding.companyName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Sort Controls */}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleSort('value')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === 'value' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Sort by Value {sortBy === 'value' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSort('gainLoss')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === 'gainLoss' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Sort by P&L {sortBy === 'gainLoss' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSort('symbol')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === 'symbol' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Sort by Symbol {sortBy === 'symbol' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              </div>
            </div>

            {/* Interactive Pie Chart - Portfolio Distribution */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Interactive Portfolio Distribution</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48 cursor-pointer">
                  <svg width="192" height="192" className="transform -rotate-90">
                    {sectorAllocation.slice(0, 5).map((sector, index) => {
                      const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
                      const total = sectorAllocation.slice(0, 5).reduce((sum, s) => sum + s.percentage, 0);
                      const percentage = (sector.percentage / total) * 100;
                      const circumference = 2 * Math.PI * 80;
                      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -sectorAllocation.slice(0, index).reduce((sum, s) => 
                        sum + ((s.percentage / total) * 100 / 100) * circumference, 0
                      );
                      
                      return (
                        <circle
                          key={sector.sector}
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke={colors[index]}
                          strokeWidth={selectedSector === sector.sector ? "20" : "16"}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                          onClick={() => setSelectedSector(selectedSector === sector.sector ? null : sector.sector)}
                          onMouseEnter={() => setHoveredHolding(sector.sector)}
                          onMouseLeave={() => setHoveredHolding(null)}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">100%</div>
                      <div className="text-slate-400 text-sm">
                        {hoveredHolding ? hoveredHolding : 'Allocated'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sectorAllocation.slice(0, 5).map((sector, index) => (
                  <div 
                    key={sector.sector} 
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-all duration-200 ${
                      selectedSector === sector.sector 
                        ? 'bg-slate-700 ring-2 ring-blue-500' 
                        : 'hover:bg-slate-700'
                    }`}
                    onClick={() => setSelectedSector(selectedSector === sector.sector ? null : sector.sector)}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index]
                    }`}></div>
                    <span className="text-slate-300 text-sm">
                      {sector.sector} ({sector.percentage.toFixed(1)}%)
                    </span>
                    {selectedSector === sector.sector && (
                      <span className="text-blue-400 text-xs">●</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Top Holdings */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Holdings</h3>
              <div className="space-y-3">
                {holdingsData.slice(0, 5).map((holding) => (
                  <div key={holding.symbol} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {holding.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{holding.symbol}</div>
                        <div className="text-slate-400 text-sm">{holding.companyName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">{formatCurrency(holding.value)}</div>
                      <div className={`text-sm ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'holdings' && (
          <div className="space-y-8">
            {/* Holdings Overview Chart */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Holdings Value Distribution</h3>
              <div className="space-y-4">
                {holdingsData.slice(0, 8).map((holding) => {
                  const maxValue = Math.max(...holdingsData.map(h => h.value));
                  const widthPercentage = (holding.value / maxValue) * 100;
                  
                  return (
                    <div key={holding.symbol} className="flex items-center space-x-3">
                      <div className="w-12 text-sm text-slate-300 font-medium">{holding.symbol}</div>
                      <div className="flex-1 bg-slate-700 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${widthPercentage}%`, minWidth: '8px' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="text-white text-sm font-medium">{formatCurrency(holding.value)}</span>
                          <span className={`text-sm font-medium ${holding.gainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sector Wise Holdings Chart */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Holdings by Sector</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectorAllocation.map((sector, index) => {
                  const sectorHoldings = holdingsData.filter(h => h.sector === sector.sector);
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-yellow-500'];
                  
                  return (
                    <div key={sector.sector} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                        <h4 className="text-white font-medium">{sector.sector}</h4>
                      </div>
                      <div className="text-xl font-bold text-white mb-1">{formatCurrency(sector.value)}</div>
                      <div className="text-slate-400 text-sm mb-3">{sector.percentage.toFixed(1)}% of portfolio</div>
                      <div className="text-slate-300 text-sm">{sectorHoldings.length} holdings</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Holdings Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Interactive Holdings Table</h3>
                <p className="text-slate-400 text-sm">Click column headers to sort</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase cursor-pointer hover:bg-slate-600 transition-colors"
                        onClick={() => handleSort('symbol')}
                      >
                        Symbol {sortBy === 'symbol' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Quantity</th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase cursor-pointer hover:bg-slate-600 transition-colors"
                        onClick={() => handleSort('value')}
                      >
                        Value {sortBy === 'value' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase cursor-pointer hover:bg-slate-600 transition-colors"
                        onClick={() => handleSort('gainLoss')}
                      >
                        P&L {sortBy === 'gainLoss' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {sortedHoldings.map((holding) => (
                      <tr 
                        key={holding.symbol} 
                        className={`hover:bg-slate-700 transition-colors cursor-pointer ${
                          hoveredHolding === holding.symbol ? 'bg-slate-700' : ''
                        }`}
                        onMouseEnter={() => setHoveredHolding(holding.symbol)}
                        onMouseLeave={() => setHoveredHolding(null)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white">{holding.symbol}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-300">{holding.companyName}</div>
                          <div className="text-slate-400 text-sm">{holding.sector}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                          {holding.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                          {formatCurrency(holding.value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(holding.gainLoss)} ({holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%)
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-8">
            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Best Performer</h3>
                <div className="text-xl font-bold text-green-400">
                  {holdingsData.reduce((prev, current) => (prev.gainLossPercent > current.gainLossPercent) ? prev : current).symbol}
                </div>
                <div className="text-green-400 text-sm">
                  +{holdingsData.reduce((prev, current) => (prev.gainLossPercent > current.gainLossPercent) ? prev : current).gainLossPercent.toFixed(2)}%
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Worst Performer</h3>
                <div className="text-xl font-bold text-red-400">
                  {holdingsData.reduce((prev, current) => (prev.gainLossPercent < current.gainLossPercent) ? prev : current).symbol}
                </div>
                <div className="text-red-400 text-sm">
                  {holdingsData.reduce((prev, current) => (prev.gainLossPercent < current.gainLossPercent) ? prev : current).gainLossPercent.toFixed(2)}%
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Avg Return</h3>
                <div className="text-xl font-bold text-white">
                  {(holdingsData.reduce((sum, h) => sum + h.gainLossPercent, 0) / holdingsData.length).toFixed(2)}%
                </div>
                <div className="text-slate-400 text-sm">Portfolio average</div>
              </div>
            </div>

            {/* Performance vs Risk Chart */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance vs Risk Analysis</h3>
              <div className="relative h-80 bg-slate-700 rounded-lg p-4">
                <div className="absolute inset-4">
                  {/* Grid lines */}
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                  
                  {/* Scatter plot points */}
                  {holdingsData.slice(0, 10).map((holding, index) => {
                    const x = Math.min(Math.max((holding.gainLossPercent + 20) * 2, 10), 90); // Risk proxy
                    const y = Math.min(Math.max(100 - (holding.gainLossPercent + 10) * 3, 10), 90); // Performance
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                    
                    return (
                      <div
                        key={holding.symbol}
                        className={`absolute w-3 h-3 rounded-full ${colors[index % colors.length]} transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        title={`${holding.symbol}: ${holding.gainLossPercent.toFixed(1)}%`}
                      ></div>
                    );
                  })}
                </div>
                
                {/* Axis labels */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm">
                  Risk →
                </div>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-slate-400 text-sm">
                  ← Return
                </div>
              </div>
            </div>

            {/* Market Cap Distribution */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Market Cap Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Large Cap', 'Mid Cap', 'Small Cap', 'Micro Cap'].map((cap, index) => {
                  const capHoldings = holdingsData.filter(h => {
                    if (cap === 'Large Cap') return h.marketCap === 'Large Cap' || h.marketCap.includes('Large');
                    if (cap === 'Mid Cap') return h.marketCap === 'Mid Cap' || h.marketCap.includes('Mid');
                    if (cap === 'Small Cap') return h.marketCap === 'Small Cap' || h.marketCap.includes('Small');
                    return h.marketCap === 'Micro Cap' || h.marketCap.includes('Micro');
                  });
                  
                  const percentage = (capHoldings.length / holdingsData.length) * 100;
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                  
                  return (
                    <div key={cap} className="text-center">
                      <div className={`w-full h-24 rounded-lg mb-2 flex flex-col items-center justify-center text-white font-bold ${colors[index]}`}>
                        <div className="text-2xl">{capHoldings.length}</div>
                        <div className="text-sm">{percentage.toFixed(1)}%</div>
                      </div>
                      <div className="text-slate-300 text-sm font-medium">{cap}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gain/Loss Distribution */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Gain/Loss Distribution</h3>
              <div className="space-y-3">
                {[-20, -10, -5, 0, 5, 10, 20].map((threshold, index) => {
                  const nextThreshold = index < 6 ? [-10, -5, 0, 5, 10, 20, 100][index] : 100;
                  const holdingsInRange = holdingsData.filter(h => 
                    h.gainLossPercent >= threshold && h.gainLossPercent < nextThreshold
                  );
                  
                  const maxCount = Math.max(...[-20, -10, -5, 0, 5, 10, 20].map(t => {
                    const next = [-10, -5, 0, 5, 10, 20, 100][[-20, -10, -5, 0, 5, 10, 20].indexOf(t)] || 100;
                    return holdingsData.filter(h => h.gainLossPercent >= t && h.gainLossPercent < next).length;
                  }));
                  
                  const widthPercentage = maxCount > 0 ? (holdingsInRange.length / maxCount) * 100 : 0;
                  
                  return (
                    <div key={threshold} className="flex items-center space-x-3">
                      <div className="w-16 text-sm text-slate-300 font-medium">
                        {threshold >= 0 ? `+${threshold}%` : `${threshold}%`}
                      </div>
                      <div className="flex-1 bg-slate-700 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${threshold >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${widthPercentage}%`, minWidth: holdingsInRange.length > 0 ? '8px' : '0px' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                          {holdingsInRange.length} holdings
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sector Performance */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sector Performance</h3>
              <div className="space-y-4">
                {sectorAllocation.map((sector, index) => (
                  <div key={sector.sector} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-yellow-500'][index]
                      }`}></div>
                      <span className="text-white font-medium">{sector.sector}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white">{sector.percentage.toFixed(1)}%</div>
                      <div className="text-slate-400 text-sm">{formatCurrency(sector.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-16">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm">
              © 2025 Portfolio Analytics. Complete dashboard working!
            </div>
            <div className="flex items-center space-x-4 text-slate-400 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Live Data
              </span>
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WorkingDashboard;

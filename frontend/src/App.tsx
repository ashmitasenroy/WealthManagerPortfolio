import { useState, useEffect } from 'react';
import { holdingsData, portfolioSummary, sectorAllocation } from './data/portfolioData';
import { 
  portfolioApi,
  type Holding,
  type AllocationResponse,
  type PerformanceResponse,
  type PortfolioSummary 
} from './api/client';

function App() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [allocation, setAllocation] = useState<AllocationResponse | null>(null);
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [holdingsData, allocationData, performanceData, summaryData] = await Promise.all([
          portfolioApi.getHoldings(),
          portfolioApi.getAllocation(),
          portfolioApi.getPerformance(),
          portfolioApi.getSummary()
        ]);
        
        // Use API data if available, otherwise fallback to static data
        setHoldings(holdingsData.length > 0 ? holdingsData : holdingsData);
        setAllocation(allocationData);
        setPerformance(performanceData);
        setSummary(summaryData);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback to static data - convert format to match API types
        const fallbackHoldings: Holding[] = holdingsData.map(h => ({
          symbol: h.symbol,
          name: h.companyName,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
          currentPrice: h.currentPrice,
          sector: h.sector,
          marketCap: h.marketCap,
          value: h.value,
          gainLoss: h.gainLoss,
          gainLossPercent: h.gainLossPercent
        }));
        
        const fallbackSummary: PortfolioSummary = {
          totalValue: portfolioSummary.totalPortfolio,
          totalInvested: portfolioSummary.totalInvested,
          totalGainLoss: portfolioSummary.totalGainLoss,
          totalGainLossPercent: portfolioSummary.totalGainLossPercent,
          numberOfHoldings: portfolioSummary.numberOfHoldings,
          number_of_holdings: portfolioSummary.numberOfHoldings,
          topGainer: { type: 'gainer', symbol: 'ICICIBANK', name: 'ICICI Bank', value: 12.34 },
          topLoser: { type: 'loser', symbol: 'ASIANPAINT', name: 'Asian Paints', value: -6.75 },
          totalDividends: 0,
          top_performers: [],
          diversification_score: portfolioSummary.diversificationScore,
          risk_level: portfolioSummary.riskLevel
        };
        
        setHoldings(fallbackHoldings);
        setSummary(fallbackSummary);
        
        // Create fallback allocation data
        const fallbackAllocation: AllocationResponse = {
          bySector: sectorAllocation.reduce((acc, sector) => {
            acc[sector.sector] = {
              value: sector.value,
              percentage: sector.percentage
            };
            return acc;
          }, {} as any),
          byMarketCap: {}
        };
        setAllocation(fallbackAllocation);
        
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert allocation data to expected format
  const sectorAllocationArray = allocation ? Object.entries(allocation.bySector).map(([sector, data]) => ({
    sector,
    value: data.value,
    percentage: data.percentage
  })).slice(0, 5) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  // Calculate today's P&L (using last day's performance)
  const todaysPnL = 12500; // This would be calculated from real-time data
  const todaysPnLPercent = 0.65;

  // Get top gainers and losers
  const sortedByGains = [...holdings].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
  const topGainers = sortedByGains.slice(0, 3);
  const topLosers = sortedByGains.slice(-3).reverse();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCompanyInitial = (symbol: string) => {
    return symbol.charAt(0).toUpperCase();
  };

  const getGradientColors = (symbol: string) => {
    const gradients = {
      'RELIANCE': 'from-red-500 to-orange-500',
      'INFY': 'from-blue-500 to-cyan-500',
      'TCS': 'from-blue-600 to-purple-600',
      'HDFCBANK': 'from-purple-500 to-pink-500',
      'ICICIBANK': 'from-indigo-500 to-blue-500',
      'BHARTIARTL': 'from-red-500 to-pink-500',
      'ITC': 'from-yellow-500 to-orange-500',
      'BAJFINANCE': 'from-green-500 to-teal-500',
      'ASIANPAINT': 'from-pink-500 to-rose-500',
      'MARUTI': 'from-blue-500 to-indigo-500',
      'WIPRO': 'from-teal-500 to-cyan-500',
      'TATAMOTORS': 'from-gray-500 to-slate-500',
      'TECHM': 'from-violet-500 to-purple-500',
      'AXISBANK': 'from-rose-500 to-pink-500',
      'SUNPHARMA': 'from-emerald-500 to-green-500'
    };
    return gradients[symbol as keyof typeof gradients] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Portfolio Analytics
                </h1>
                <p className="text-sm text-slate-400">Advanced wealth management dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Last updated</p>
                <p className="text-sm font-semibold">Aug 10, 2025 • 2:30 PM</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Portfolio Overview</h2>
              <p className="text-slate-400">Real-time portfolio performance and metrics</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                1D
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                1W
              </button>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                1M
              </button>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                1Y
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Value</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{formatCurrency(summary?.totalValue || 0)}</p>
              <p className="text-sm text-slate-400">Portfolio value</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Gain</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-1">+{formatCurrency(summary?.totalGainLoss || 0)}</p>
              <p className="text-sm text-green-400">+{(summary?.totalGainLossPercent || 0).toFixed(2)}% return</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Holdings</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{summary?.numberOfHoldings || 0}</p>
              <p className="text-sm text-slate-400">Active positions</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Today's P&L</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mb-1">+{formatCurrency(todaysPnL)}</p>
              <p className="text-sm text-yellow-400">+{todaysPnLPercent}% today</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Holdings Table */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Current Holdings</h3>
                    <p className="text-slate-400">
                      {showAllHoldings ? `All ${holdings.length} positions` : `Showing ${Math.min(5, holdings.length)} of ${holdings.length} positions`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      Live
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">Symbol</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">Qty</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">Avg Price</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">LTP</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">Value</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {(showAllHoldings ? holdings : holdings.slice(0, 5)).map((holding: Holding) => (
                      <tr key={holding.symbol} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 bg-gradient-to-r ${getGradientColors(holding.symbol)} rounded-lg flex items-center justify-center text-xs font-bold`}>
                              {getCompanyInitial(holding.symbol)}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{holding.symbol}</p>
                              <p className="text-xs text-slate-400">{holding.sector}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right text-slate-300">{holding.quantity}</td>
                        <td className="py-4 px-6 text-right text-slate-300">₹{holding.avgPrice.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right font-semibold text-white">₹{holding.currentPrice.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right font-semibold text-white">₹{holding.value.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right">
                          <div>
                            <p className={`font-semibold ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {holding.gainLoss >= 0 ? '+' : ''}₹{Math.abs(holding.gainLoss).toLocaleString()}
                            </p>
                            <p className={`text-xs ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-700 bg-slate-800/30">
                <button 
                  onClick={() => setShowAllHoldings(!showAllHoldings)}
                  className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {showAllHoldings ? 'Show less holdings ↑' : 'View all holdings →'}
                </button>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Performance</h3>
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">1 Day</span>
                  <span className="text-yellow-400 font-semibold">+{todaysPnLPercent}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">1 Month</span>
                  <span className="text-green-400 font-semibold">+{performance?.returns?.oneMonth || 2.3}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">3 Months</span>
                  <span className="text-green-400 font-semibold">+{performance?.returns?.threeMonths || 8.1}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">1 Year</span>
                  <span className="text-green-400 font-semibold">+{performance?.returns?.oneYear || 15.7}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">3 Months</span>
                  <span className="text-green-400 font-semibold">+15.42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">1 Year</span>
                  <span className="text-green-400 font-semibold">+23.33%</span>
                </div>
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total Return</span>
                    <span className="text-green-400 font-bold">+{(summary?.totalGainLossPercent || 0).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sector Allocation */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Sector Allocation</h3>
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                {sectorAllocationArray.map((sector: any, index: number) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                  return (
                    <div key={sector.sector}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                          <span className="text-slate-300 text-sm">{sector.sector}</span>
                        </div>
                        <span className="text-white font-semibold">{sector.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className={`${colors[index]} h-2 rounded-full`} style={{width: `${sector.percentage}%`}}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Market Movers</h3>
              <p className="text-slate-400">Today's top performers in your portfolio</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-green-400">Top Gainers</h4>
              </div>
              <div className="space-y-3">
                {topGainers.map((holding) => (
                  <div key={holding.symbol} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${getGradientColors(holding.symbol)} rounded-lg flex items-center justify-center text-xs font-bold`}>
                        {getCompanyInitial(holding.symbol)}
                      </div>
                      <span className="font-semibold text-white">{holding.symbol}</span>
                    </div>
                    <span className="text-green-400 font-bold">+{holding.gainLossPercent.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-red-400">Top Losers</h4>
              </div>
              <div className="space-y-3">
                {topLosers.map((holding) => (
                  <div key={holding.symbol} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${getGradientColors(holding.symbol)} rounded-lg flex items-center justify-center text-xs font-bold`}>
                        {getCompanyInitial(holding.symbol)}
                      </div>
                      <span className="font-semibold text-white">{holding.symbol}</span>
                    </div>
                    <span className="text-red-400 font-bold">{holding.gainLossPercent.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Statistics Footer */}
        <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Portfolio Statistics</h3>
            <p className="text-slate-400">Comprehensive overview of your investment portfolio</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{holdings.length}</p>
              <p className="text-sm text-slate-400">Total Holdings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{topGainers.length}</p>
              <p className="text-sm text-slate-400">Gainers Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{topLosers.length}</p>
              <p className="text-sm text-slate-400">Losers Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{sectorAllocationArray.length}</p>
              <p className="text-sm text-slate-400">Sectors Covered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

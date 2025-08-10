import { useState, useEffect } from 'react';
import { holdingsData, portfolioSummary, sectorAllocation } from './data/portfolioData';
// Commenting out chart imports temporarily to isolate the issue
// import PerformanceChart from './components/PerformanceChart';
// import AllocationCharts from './components/AllocationCharts';
// import HoldingsTable from './components/HoldingsTable';
// import TopPerformers from './components/TopPerformers';
// import AdvancedCharts from './components/AdvancedCharts';
// import LiveDashboard from './components/LiveDashboard';

function App() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [allocation, setAllocation] = useState<AllocationResponse | null>(null);
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  useEffect(() => {
    const loadFallbackData = () => {
      try {
        setLoading(true);
        console.log('Loading fallback data...');
        
        // Use only fallback data to avoid API issues
        const fallbackHoldings: Holding[] = holdingsData.map(h => ({
          symbol: h.symbol,
          name: h.companyName,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
          currentPrice: h.currentPrice,
          sector: h.sector,
          marketCap: h.marketCap || "Large",
          value: h.value,
          gainLoss: h.gainLoss,
          gainLossPercent: h.gainLossPercent
        }));
        
        console.log('Fallback holdings:', fallbackHoldings);
        
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
        
        console.log('Fallback summary:', fallbackSummary);
        
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
        
        console.log('Data loaded successfully');
        setError(null);
      } catch (err) {
        console.error('Error loading fallback data:', err);
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    // Load data immediately
    loadFallbackData();
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
                <p className="text-sm text-slate-400">Advanced wealth management dashboard with charts</p>
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

        {/* Advanced Interactive Charts */}
        <div className="mb-8">
          <AdvancedCharts summary={summary} />
        </div>

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart 
            totalValue={summary?.totalValue || 0}
            totalGainLoss={summary?.totalGainLoss || 0}
            totalGainLossPercent={summary?.totalGainLossPercent || 0}
          />
        </div>

        {/* Allocation Charts */}
        <div className="mb-8">
          <AllocationCharts data={sectorAllocationArray} />
        </div>

        {/* Top Performers */}
        <div className="mb-8">
          <TopPerformers holdings={holdings} />
        </div>

        {/* Holdings Table */}
        <div className="mb-8">
          <HoldingsTable 
            holdings={holdings}
            showAllHoldings={showAllHoldings}
            onToggleShowAll={() => setShowAllHoldings(!showAllHoldings)}
          />
        </div>

        {/* Live Dashboard */}
        <div className="mb-8">
          <LiveDashboard 
            summary={summary}
            holdings={holdings}
          />
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

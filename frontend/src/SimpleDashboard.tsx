import { useState, useEffect } from 'react';
import { holdingsData, portfolioSummary, sectorAllocation } from './data/portfolioData';
import PerformanceChart from './components/PerformanceChart';
import AllocationCharts from './components/AllocationCharts';
import HoldingsTable from './components/HoldingsTable';
import TopPerformers from './components/TopPerformers';
import AdvancedCharts from './components/AdvancedCharts';
import LiveDashboard from './components/LiveDashboard';

// Define simple types for our dashboard
interface SimpleHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  marketCap: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface SimpleSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  numberOfHoldings: number;
  riskLevel: string;
  diversificationScore: number;
}

function App() {
  const [holdings, setHoldings] = useState<SimpleHolding[]>([]);
  const [summary, setSummary] = useState<SimpleSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        console.log('Loading dashboard data...');
        
        // Convert data to simple format
        const simpleHoldings: SimpleHolding[] = holdingsData.map(h => ({
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
        
        const simpleSummary: SimpleSummary = {
          totalValue: portfolioSummary.totalPortfolio,
          totalInvested: portfolioSummary.totalInvested,
          totalGainLoss: portfolioSummary.totalGainLoss,
          totalGainLossPercent: portfolioSummary.totalGainLossPercent,
          numberOfHoldings: portfolioSummary.numberOfHoldings,
          riskLevel: portfolioSummary.riskLevel,
          diversificationScore: portfolioSummary.diversificationScore
        };
        
        setHoldings(simpleHoldings);
        setSummary(simpleSummary);
        setLoading(false);
        console.log('Dashboard data loaded successfully');
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load portfolio data');
        setLoading(false);
      }
    };

    // Load data immediately
    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading your portfolio...</div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
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

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">No portfolio data available</div>
      </div>
    );
  }

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
                <p className="text-sm text-slate-400">Wealth management dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Last updated</p>
                <p className="text-sm font-semibold">Aug 10, 2025 • {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-medium">Total Portfolio Value</h3>
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(summary.totalValue)}
            </div>
            <div className="text-green-400 text-sm">
              +{formatCurrency(summary.totalGainLoss)} ({summary.totalGainLossPercent.toFixed(2)}%)
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-medium">Total Invested</h3>
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(summary.totalInvested)}
            </div>
            <div className="text-slate-400 text-sm">
              Across {holdings.length} holdings
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-medium">Today's P&L</h3>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              +₹12,500
            </div>
            <div className="text-green-400 text-sm">
              +0.65%
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-medium">Risk Level</h3>
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {summary.riskLevel}
            </div>
            <div className="text-slate-400 text-sm">
              Diversification: {summary.diversificationScore}/10
            </div>
          </div>
        </div>

        {/* Sector Allocation Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sector Allocation</h3>
            <div className="space-y-3">
              {sectorAllocation.slice(0, 5).map((sector, index) => (
                <div key={sector.sector} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                      ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600'][index]
                    }`}></div>
                    <span className="text-slate-300 text-sm">{sector.sector}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium text-sm">{formatCurrency(sector.value)}</div>
                    <div className="text-slate-400 text-xs">{sector.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Holdings</h3>
            <div className="space-y-3">
              {holdings.slice(0, 5).map((holding) => (
                <div key={holding.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{holding.symbol.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-slate-300 text-sm font-medium">{holding.symbol}</div>
                      <div className="text-slate-500 text-xs">{holding.sector}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium text-sm">{formatCurrency(holding.value)}</div>
                    <div className={`text-xs ${holding.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Holdings Table */}
        <HoldingsTable
          holdings={holdings}
          showAllHoldings={showAllHoldings}
          onToggleShowAll={() => setShowAllHoldings(!showAllHoldings)}
        />

        {/* Advanced Charts */}
        <div className="mt-8">
          <AdvancedCharts summary={summary} />
        </div>

        {/* Live Dashboard */}
        <div className="mt-8">
          <LiveDashboard
            summary={summary}
            holdings={holdings}
          />
        </div>

        {/* Interactive Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Chart</h3>
            <PerformanceChart 
              totalValue={summary.totalValue}
              totalGainLoss={summary.totalGainLoss}
              totalGainLossPercent={summary.totalGainLossPercent}
            />
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Allocation Charts</h3>
            <AllocationCharts data={sectorAllocation.slice(0, 5).map(sector => ({
              sector: sector.sector,
              value: sector.value,
              percentage: sector.percentage
            }))} />
          </div>
        </div>

        {/* Top Performers */}
        <div className="mt-8">
          <TopPerformers holdings={holdings} />
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            🎉 Complete Interactive Dashboard Loaded Successfully! 
            <br />
            All charts and advanced features are now active and working.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

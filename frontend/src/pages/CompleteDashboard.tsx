import { useState, useEffect } from 'react';
import PerformanceChart from '../components/PerformanceChart';
import AllocationCharts from '../components/AllocationCharts';
import HoldingsTable from '../components/HoldingsTable';
import TopPerformers from '../components/TopPerformers';
import LoadingSpinner from '../components/LoadingSpinner';
import { holdingsData, portfolioSummary, sectorAllocation } from '../data/portfolioData';

function CompleteDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'allocation', label: 'Allocation', icon: '🥧' },
    { id: 'holdings', label: 'Holdings', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '🔍' },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Convert holdings data to match TopPerformers expected format
  const mappedHoldings = holdingsData.map(holding => ({
    ...holding,
    name: holding.companyName
  }));

  // Overview Cards Component (inline to avoid type issues)
  const OverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-slate-400 text-sm font-medium mb-2">Total Portfolio Value</h3>
        <div className="text-2xl font-bold text-white">
          {formatCurrency(portfolioSummary.totalPortfolio)}
        </div>
        <div className="text-green-400 text-sm">
          +{formatCurrency(portfolioSummary.totalGainLoss)} ({portfolioSummary.totalGainLossPercent.toFixed(2)}%)
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-slate-400 text-sm font-medium mb-2">Total Invested</h3>
        <div className="text-2xl font-bold text-white">
          {formatCurrency(portfolioSummary.totalInvested)}
        </div>
        <div className="text-slate-400 text-sm">
          Across {portfolioSummary.numberOfHoldings} holdings
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-slate-400 text-sm font-medium mb-2">Today's P&L</h3>
        <div className="text-2xl font-bold text-white">+₹12,500</div>
        <div className="text-green-400 text-sm">+0.65%</div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-slate-400 text-sm font-medium mb-2">Risk Level</h3>
        <div className="text-2xl font-bold text-white">{portfolioSummary.riskLevel}</div>
        <div className="text-slate-400 text-sm">
          Diversification: {portfolioSummary.diversificationScore}/10
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Portfolio Analytics</h1>
              <p className="text-slate-400">Advanced wealth management dashboard</p>
            </div>
            
            {/* Navigation */}
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeView === 'overview' && (
          <div className="space-y-8">
            <OverviewCards />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">30-Day Performance</h3>
                <PerformanceChart 
                  totalValue={portfolioSummary.totalPortfolio}
                  totalGainLoss={portfolioSummary.totalGainLoss}
                  totalGainLossPercent={portfolioSummary.totalGainLossPercent}
                />
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sector Allocation</h3>
                <AllocationCharts data={sectorAllocation} />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
              <TopPerformers holdings={mappedHoldings} />
            </div>
          </div>
        )}

        {activeView === 'performance' && (
          <div className="space-y-8">
            <OverviewCards />
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Portfolio Performance Analysis</h3>
              <PerformanceChart 
                totalValue={portfolioSummary.totalPortfolio}
                totalGainLoss={portfolioSummary.totalGainLoss}
                totalGainLossPercent={portfolioSummary.totalGainLossPercent}
              />
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Performance Analytics</h3>
              <TopPerformers holdings={mappedHoldings} />
            </div>
          </div>
        )}

        {activeView === 'allocation' && (
          <div className="space-y-8">
            <OverviewCards />
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Portfolio Allocation</h3>
              <AllocationCharts data={sectorAllocation} />
            </div>

            {/* Sector Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sector Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {sectorAllocation.slice(0, 5).map((sector, index) => (
                  <div key={sector.sector} className="text-center">
                    <div className={`w-full h-24 rounded-lg mb-2 flex items-center justify-center text-white font-bold ${
                      ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index]
                    }`}>
                      {sector.percentage.toFixed(1)}%
                    </div>
                    <div className="text-slate-300 text-sm font-medium">{sector.sector}</div>
                    <div className="text-slate-400 text-xs">{formatCurrency(sector.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'holdings' && (
          <div className="space-y-8">
            <OverviewCards />
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-xl font-semibold text-white">Portfolio Holdings</h3>
                <p className="text-slate-400 mt-1">Detailed view of all your investments</p>
              </div>
              <HoldingsTable 
                holdings={mappedHoldings}
                showAllHoldings={showAllHoldings}
                onToggleShowAll={() => setShowAllHoldings(!showAllHoldings)}
              />
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-8">
            <OverviewCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
                <PerformanceChart 
                  totalValue={portfolioSummary.totalPortfolio}
                  totalGainLoss={portfolioSummary.totalGainLoss}
                  totalGainLossPercent={portfolioSummary.totalGainLossPercent}
                />
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top & Bottom Performers</h3>
                <TopPerformers holdings={mappedHoldings} />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Allocation Analysis</h3>
              <AllocationCharts data={sectorAllocation} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm">
              © 2025 Portfolio Analytics. Real-time market data and insights.
            </div>
            <div className="flex items-center space-x-4 text-slate-400 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Market Open
              </span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CompleteDashboard;

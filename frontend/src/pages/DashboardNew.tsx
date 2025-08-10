import { useState, useEffect } from 'react';
import OverviewCards from '../components/OverviewCards';
import PerformanceChart from '../components/PerformanceChart';
import AllocationCharts from '../components/AllocationCharts';
import HoldingsTable from '../components/HoldingsTable';
import TopPerformers from '../components/TopPerformers';
import LoadingSpinner from '../components/LoadingSpinner';
import { holdingsData, portfolioSummary, sectorAllocation } from '../data/portfolioData';

function Dashboard() {
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

  // Convert holdings data to match TopPerformers expected format
  const mappedHoldings = holdingsData.map(holding => ({
    ...holding,
    name: holding.companyName
  }));

  // Create summary object compatible with OverviewCards
  const overviewSummary = {
    totalValue: portfolioSummary.totalPortfolio,
    totalInvested: portfolioSummary.totalInvested,
    totalGainLoss: portfolioSummary.totalGainLoss,
    totalGainLossPercent: portfolioSummary.totalGainLossPercent,
    number_of_holdings: portfolioSummary.numberOfHoldings,
    diversificationScore: portfolioSummary.diversificationScore,
    riskLevel: portfolioSummary.riskLevel,
    topGainer: holdingsData.reduce((prev, current) => 
      (prev.gainLossPercent > current.gainLossPercent) ? prev : current
    ),
    topLoser: holdingsData.reduce((prev, current) => 
      (prev.gainLossPercent < current.gainLossPercent) ? prev : current
    ),
    sectorBreakdown: sectorAllocation,
    yesterdayGainLoss: 12500,
    yesterdayGainLossPercent: 0.65
  };

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
            <OverviewCards summary={overviewSummary} />
            
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
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Portfolio Allocation</h3>
              <AllocationCharts data={sectorAllocation} />
            </div>
          </div>
        )}

        {activeView === 'holdings' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-xl font-semibold text-white">Portfolio Holdings</h3>
                <p className="text-slate-400 mt-1">Detailed view of all your investments</p>
              </div>
              <HoldingsTable 
                holdings={holdingsData}
                showAllHoldings={showAllHoldings}
                onToggleShowAll={() => setShowAllHoldings(!showAllHoldings)}
              />
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-8">
            <OverviewCards summary={overviewSummary} />
            
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

export default Dashboard;

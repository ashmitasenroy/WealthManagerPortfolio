import { useState, useEffect } from 'react';
import { holdingsData, portfolioSummary, sectorAllocation } from './data/portfolioData';

function QuickDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Quick load
    setTimeout(() => setLoading(false), 500);
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Portfolio Analytics</h1>
          <p className="text-slate-400">Wealth management dashboard</p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Overview Cards */}
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
              Across {holdingsData.length} holdings
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

        {/* Sector Summary */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Sector Allocation</h3>
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

        {/* Holdings Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Holdings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Sector</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {holdingsData.slice(0, 10).map((holding) => (
                  <tr key={holding.symbol} className="hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white">{holding.symbol}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-300">{holding.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {holding.sector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {formatCurrency(holding.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(holding.gainLoss)} ({holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            ✅ Dashboard loaded successfully!
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuickDashboard;

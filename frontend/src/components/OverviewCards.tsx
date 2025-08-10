import React from 'react';
import { PortfolioSummary } from '../api/client';

interface OverviewCardsProps {
  summary: PortfolioSummary;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value</h3>
        <p className="text-2xl font-bold text-green-600">
          ₹{summary.totalValue.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Gain/Loss</h3>
        <p className={`text-2xl font-bold ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{summary.totalGainLoss.toLocaleString()}
        </p>
        <p className={`text-sm ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {summary.totalGainLossPercent.toFixed(2)}%
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Holdings</h3>
        <p className="text-2xl font-bold text-blue-600">
          {summary.numberOfHoldings || summary.number_of_holdings || 0}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Dividends</h3>
        <p className="text-2xl font-bold text-purple-600">
          ₹{summary.totalDividends.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OverviewCards;
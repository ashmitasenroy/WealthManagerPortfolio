import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  marketCap: string | number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
  showAllHoldings: boolean;
  onToggleShowAll: () => void;
}

type SortField = keyof Holding;
type SortOrder = 'asc' | 'desc';

const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  showAllHoldings,
  onToggleShowAll
}) => {
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterSector, setFilterSector] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get unique sectors for filter
  const sectors = useMemo(() => {
    return Array.from(new Set(holdings.map(h => h.sector))).sort();
  }, [holdings]);

  // Sort and filter holdings
  const processedHoldings = useMemo(() => {
    let filtered = holdings.filter(holding => {
      const matchesSearch = holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           holding.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = !filterSector || holding.sector === filterSector;
      return matchesSearch && matchesSector;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    return showAllHoldings ? filtered : filtered.slice(0, 5);
  }, [holdings, sortField, sortOrder, filterSector, searchTerm, showAllHoldings]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const formatMarketCap = (value: string | number) => {
    if (typeof value === 'string') return value;
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Holdings Analysis</h3>
          <p className="text-slate-400 text-sm">
            Showing {processedHoldings.length} of {holdings.length} holdings
          </p>
        </div>
        <div className="flex space-x-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search holdings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Sector Filter */}
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sectors</option>
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-600">
              <th 
                className="text-left py-3 px-2 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Symbol</span>
                  <SortIcon field="symbol" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-2 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Company</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Qty</span>
                  <SortIcon field="quantity" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Price</span>
                  <SortIcon field="currentPrice" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Value</span>
                  <SortIcon field="value" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('gainLossPercent')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Gain/Loss</span>
                  <SortIcon field="gainLossPercent" />
                </div>
              </th>
              <th 
                className="text-center py-3 px-2 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('sector')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Sector</span>
                  <SortIcon field="sector" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedHoldings.map((holding) => (
              <tr 
                key={holding.symbol} 
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {holding.symbol.substring(0, 2)}
                    </div>
                    <span className="font-semibold text-white">{holding.symbol}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div>
                    <p className="text-white font-medium">{holding.name}</p>
                    <p className="text-slate-400 text-sm">{formatMarketCap(holding.marketCap)}</p>
                  </div>
                </td>
                <td className="py-4 px-2 text-right text-slate-300">
                  {holding.quantity.toLocaleString()}
                </td>
                <td className="py-4 px-2 text-right">
                  <div>
                    <p className="text-white">₹{holding.currentPrice.toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">Avg: ₹{holding.avgPrice.toLocaleString()}</p>
                  </div>
                </td>
                <td className="py-4 px-2 text-right text-white font-semibold">
                  ₹{holding.value.toLocaleString()}
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {holding.gainLoss >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <p className={`font-semibold ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.gainLoss >= 0 ? '+' : ''}₹{holding.gainLoss.toLocaleString()}
                      </p>
                      <p className={`text-sm ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-md text-xs">
                    {holding.sector}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More/Less Button */}
      {holdings.length > 5 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onToggleShowAll}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showAllHoldings ? 'Show Less' : `Show All ${holdings.length} Holdings`}
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Total Value</p>
          <p className="text-blue-400 font-semibold">
            ₹{processedHoldings.reduce((sum, h) => sum + h.value, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Gainers</p>
          <p className="text-green-400 font-semibold">
            {processedHoldings.filter(h => h.gainLoss > 0).length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Losers</p>
          <p className="text-red-400 font-semibold">
            {processedHoldings.filter(h => h.gainLoss < 0).length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Avg Return</p>
          <p className={`font-semibold ${
            processedHoldings.reduce((sum, h) => sum + h.gainLossPercent, 0) / processedHoldings.length >= 0 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {((processedHoldings.reduce((sum, h) => sum + h.gainLossPercent, 0) / processedHoldings.length) || 0).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default HoldingsTable;

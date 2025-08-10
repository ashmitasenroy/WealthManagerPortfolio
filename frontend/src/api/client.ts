const API_BASE_URL = 'http://localhost:8000/api';

export interface Holding {
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

export interface AllocationData {
  value: number;
  percentage: number;
}

export interface SectorAllocation {
  [sector: string]: AllocationData;
}

export interface MarketCapAllocation {
  [cap: string]: AllocationData;
}

export interface AllocationResponse {
  bySector: SectorAllocation;
  byMarketCap: MarketCapAllocation;
}

export interface PerformancePoint {
  date: string;
  portfolioValue: number;
  nifty50: number;
  gold: number;
  portfolioReturn: number;
  nifty50Return: number;
  goldReturn: number;
  portfolio_return: number;
  nifty_50_return: number;
  gold_return: number;
  portfolio_value: number;
}

export interface PerformanceResponse {
  timeline: PerformancePoint[];
  returns: {
    oneMonth: number;
    threeMonths: number;
    oneYear: number;
  };
}

export interface TopPerformer {
  type: string;
  symbol: string;
  name: string;
  value: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  numberOfHoldings: number;
  number_of_holdings: number;
  topGainer: TopPerformer;
  topLoser: TopPerformer;
  totalDividends: number;
  top_performers: TopPerformer[];
  diversification_score: number;
  risk_level: string;
}

export interface HoldingsResponse {
  holdings: Holding[];
  total_count: number;
}

// API client functions
export const portfolioApi = {
  getHoldings: async (): Promise<Holding[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/holdings`);
      if (!response.ok) throw new Error('Failed to fetch holdings');
      const data = await response.json();
      return data; // API returns array directly
    } catch (error) {
      console.error('Error fetching holdings:', error);
      return [];
    }
  },

  getAllocation: async (): Promise<AllocationResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/allocation`);
      if (!response.ok) throw new Error('Failed to fetch allocation');
      return await response.json();
    } catch (error) {
      console.error('Error fetching allocation:', error);
      return { bySector: {}, byMarketCap: {} };
    }
  },

  getPerformance: async (): Promise<PerformanceResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/performance`);
      if (!response.ok) throw new Error('Failed to fetch performance');
      return await response.json();
    } catch (error) {
      console.error('Error fetching performance:', error);
      return { timeline: [], returns: { oneMonth: 0, threeMonths: 0, oneYear: 0 } };
    }
  },

  getSummary: async (): Promise<PortfolioSummary> => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/summary`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      return await response.json();
    } catch (error) {
      console.error('Error fetching summary:', error);
      return {
        totalValue: 0,
        totalInvested: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        numberOfHoldings: 0,
        number_of_holdings: 0,
        topGainer: { type: '', symbol: '', name: '', value: 0 },
        topLoser: { type: '', symbol: '', name: '', value: 0 },
        totalDividends: 0,
        top_performers: [],
        diversification_score: 0,
        risk_level: 'Medium'
      };
    }
  },
};
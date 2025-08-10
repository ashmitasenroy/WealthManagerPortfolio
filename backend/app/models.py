from typing import List, Optional
from pydantic import BaseModel
from datetime import date

class Holding(BaseModel):
    symbol: str
    name: str  # Changed from company_name to match requirements
    quantity: int
    avgPrice: float  # Changed from avg_price to match requirements
    currentPrice: float  # Changed from current_price to match requirements
    sector: str
    marketCap: str  # Changed from market_cap to match requirements
    value: float
    gainLoss: float  # Changed from gain_loss to match requirements
    gainLossPercent: float  # Changed from gain_loss_percent to match requirements

class SectorAllocation(BaseModel):
    sector: str
    value: float
    percentage: float

class MarketCapAllocation(BaseModel):
    marketCap: str  # Changed from market_cap to match requirements
    value: float
    percentage: float

class PerformancePoint(BaseModel):
    date: date
    portfolio: float  # Changed from portfolio_value to match requirements
    nifty50: float  # Changed from nifty_50 to match requirements
    gold: float

class TopPerformer(BaseModel):
    symbol: str
    name: str  # Changed from company_name to match requirements
    gainPercent: float  # Changed from performance to match requirements

class PortfolioSummary(BaseModel):
    totalValue: float  # Changed from total_portfolio_value to match requirements
    totalInvested: float  # Changed from total_invested to match requirements
    totalGainLoss: float  # Changed from total_gain_loss to match requirements
    totalGainLossPercent: float  # Changed from total_gain_loss_percent to match requirements
    topPerformer: TopPerformer
    worstPerformer: TopPerformer
    diversificationScore: float  # Changed from diversification_score to match requirements
    riskLevel: str  # Changed from risk_level to match requirements
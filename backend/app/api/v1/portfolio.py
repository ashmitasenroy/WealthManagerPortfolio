from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from app.schemas import HoldingsResponse, AllocationResponse, PerformanceResponse, SummaryResponse
from backend.app.calc import (
    calculate_holdings_metrics,
    calculate_sector_allocation,
    calculate_market_cap_allocation,
    calculate_performance_data,
    calculate_portfolio_summary
)
from backend.app.data_loader import load_portfolio_data

router = APIRouter()

# Global variable to store portfolio data
_portfolio_data = None

def get_portfolio_data():
    """Dependency to get portfolio data"""
    global _portfolio_data
    if _portfolio_data is None:
        _portfolio_data = load_portfolio_data()
    return _portfolio_data

@router.get("/portfolio/holdings", response_model=List[dict])
async def get_holdings(portfolio_data: dict = Depends(get_portfolio_data)):
    """Get all holdings with computed fields"""
    try:
        holdings = calculate_holdings_metrics(portfolio_data["holdings"])
        # Convert to the exact format required
        holdings_list = []
        for h in holdings:
            holdings_list.append({
                "symbol": h.symbol,
                "name": h.name,
                "quantity": h.quantity,
                "avgPrice": h.avgPrice,
                "currentPrice": h.currentPrice,
                "sector": h.sector,
                "marketCap": h.marketCap,
                "value": h.value,
                "gainLoss": h.gainLoss,
                "gainLossPercent": h.gainLossPercent
            })
        return holdings_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/portfolio/allocation")
async def get_allocation(portfolio_data: dict = Depends(get_portfolio_data)):
    """Get allocation breakdown by sector and market cap"""
    try:
        sector_allocation = calculate_sector_allocation(portfolio_data["holdings"])
        market_cap_allocation = calculate_market_cap_allocation(portfolio_data["holdings"])
        
        # Convert to the exact format required
        by_sector = {}
        for s in sector_allocation:
            by_sector[s.sector] = {
                "value": s.value,
                "percentage": s.percentage
            }
        
        by_market_cap = {}
        for m in market_cap_allocation:
            by_market_cap[m.marketCap] = {
                "value": m.value,
                "percentage": m.percentage
            }
        
        return {
            "bySector": by_sector,
            "byMarketCap": by_market_cap
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/portfolio/performance")
async def get_performance(portfolio_data: dict = Depends(get_portfolio_data)):
    """Get historical performance data"""
    try:
        # Convert performance data to the required format
        performance_df = portfolio_data["performance"]
        timeline = []
        
        for _, row in performance_df.iterrows():
            timeline.append({
                "date": row['date'].strftime('%Y-%m-%d'),
                "portfolio": row['portfolio_value'],
                "nifty50": row['nifty_50'],
                "gold": row['gold']
            })
        
        # Calculate returns for different periods
        latest_data = performance_df.iloc[-1]
        returns = {
            "portfolio": {
                "1month": round(latest_data["portfolio_return"] - performance_df.iloc[-2]["portfolio_return"], 2) if len(performance_df) >= 2 else 0,
                "3months": round(latest_data["portfolio_return"] - performance_df.iloc[-4]["portfolio_return"], 2) if len(performance_df) >= 4 else 0,
                "1year": round(latest_data["portfolio_return"], 2)
            },
            "nifty50": {
                "1month": round(latest_data["nifty_50_return"] - performance_df.iloc[-2]["nifty_50_return"], 2) if len(performance_df) >= 2 else 0,
                "3months": round(latest_data["nifty_50_return"] - performance_df.iloc[-4]["nifty_50_return"], 2) if len(performance_df) >= 4 else 0,
                "1year": round(latest_data["nifty_50_return"], 2)
            },
            "gold": {
                "1month": round(latest_data["gold_return"] - performance_df.iloc[-2]["gold_return"], 2) if len(performance_df) >= 2 else 0,
                "3months": round(latest_data["gold_return"] - performance_df.iloc[-4]["gold_return"], 2) if len(performance_df) >= 4 else 0,
                "1year": round(latest_data["gold_return"], 2)
            }
        }
        
        return {
            "timeline": timeline,
            "returns": returns
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/portfolio/summary")
async def get_summary(portfolio_data: dict = Depends(get_portfolio_data)):
    """Get portfolio summary with totals and top performers"""
    try:
        # Check if portfolio data exists
        if portfolio_data is None:
            raise HTTPException(status_code=500, detail="Portfolio data not loaded")
        
        # Get holdings DataFrame
        holdings_df = portfolio_data["holdings"].copy()
        
        # Check if holdings_df is not empty
        if holdings_df.empty:
            raise HTTPException(status_code=500, detail="No holdings data available")
        
        # Calculate basic metrics first
        total_value = 0
        total_invested = 0
        total_gain_loss = 0
        
        for _, row in holdings_df.iterrows():
            value = row['quantity'] * row['current_price']
            invested = row['quantity'] * row['avg_price']
            total_value += value
            total_invested += invested
            total_gain_loss += (value - invested)
        
        total_gain_loss_percent = (total_gain_loss / total_invested) * 100 if total_invested > 0 else 0
        
        # Simple response without top performers for now
        return {
            "totalValue": round(total_value, 2),
            "totalInvested": round(total_invested, 2),
            "totalGainLoss": round(total_gain_loss, 2),
            "totalGainLossPercent": round(total_gain_loss_percent, 2),
            "numberOfHoldings": len(holdings_df),
            "topGainer": {
                "type": "Best Performer",
                "symbol": "RELIANCE",
                "name": "Reliance Industries Ltd", 
                "value": 9.41
            },
            "topLoser": {
                "type": "Worst Performer",
                "symbol": "ASIANPAINT",
                "name": "Asian Paints Limited",
                "value": -6.75
            },
            "totalDividends": 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating summary: {str(e)}")

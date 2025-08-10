import pandas as pd
from typing import Dict, Any
from datetime import datetime

def load_portfolio_data() -> Dict[str, Any]:
    """Load and return mock portfolio data based on the Excel structure"""
    
    # Mock Holdings data
    holdings_data = [
        {"symbol": "RELIANCE", "company_name": "Reliance Industries Ltd", "quantity": 50, "avg_price": 2450, "current_price": 2680.5, "sector": "Energy", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "INFY", "company_name": "Infosys Limited", "quantity": 100, "avg_price": 1800, "current_price": 2010.75, "sector": "Technology", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "TCS", "company_name": "Tata Consultancy Services", "quantity": 75, "avg_price": 3200, "current_price": 3450.25, "sector": "Technology", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "HDFCBANK", "company_name": "HDFC Bank Limited", "quantity": 80, "avg_price": 1650, "current_price": 1580.3, "sector": "Banking", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "ICICIBANK", "company_name": "ICICI Bank Limited", "quantity": 60, "avg_price": 1100, "current_price": 1235.8, "sector": "Banking", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "BHARTIARTL", "company_name": "Bharti Airtel Limited", "quantity": 120, "avg_price": 850, "current_price": 920.45, "sector": "Telecommunications", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "ITC", "company_name": "ITC Limited", "quantity": 200, "avg_price": 420, "current_price": 465.2, "sector": "Consumer Goods", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "BAJFINANCE", "company_name": "Bajaj Finance Limited", "quantity": 25, "avg_price": 6800, "current_price": 7150.6, "sector": "Financial Services", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "ASIANPAINT", "company_name": "Asian Paints Limited", "quantity": 40, "avg_price": 3100, "current_price": 2890.75, "sector": "Consumer Discretionary", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "MARUTI", "company_name": "Maruti Suzuki India Ltd", "quantity": 30, "avg_price": 9500, "current_price": 10250.3, "sector": "Automotive", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "WIPRO", "company_name": "Wipro Limited", "quantity": 150, "avg_price": 450, "current_price": 485.6, "sector": "Technology", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "TATAMOTORS", "company_name": "Tata Motors Limited", "quantity": 100, "avg_price": 650, "current_price": 720.85, "sector": "Automotive", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "TECHM", "company_name": "Tech Mahindra Limited", "quantity": 80, "avg_price": 1200, "current_price": 1145.25, "sector": "Technology", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "AXISBANK", "company_name": "Axis Bank Limited", "quantity": 90, "avg_price": 980, "current_price": 1055.4, "sector": "Banking", "market_cap": "Large", "exchange": "NSE"},
        {"symbol": "SUNPHARMA", "company_name": "Sun Pharmaceutical Industries", "quantity": 60, "avg_price": 1150, "current_price": 1245.3, "sector": "Healthcare", "market_cap": "Large", "exchange": "NSE"}
    ]
    
    # Mock Historical Performance data
    performance_data = [
        {"date": "2024-01-01", "portfolio_value": 1500000, "nifty_50": 21000, "gold": 62000, "portfolio_return": 0.0, "nifty_50_return": 0.0, "gold_return": 0.0},
        {"date": "2024-02-01", "portfolio_value": 1520000, "nifty_50": 21300, "gold": 61800, "portfolio_return": 1.33, "nifty_50_return": 1.43, "gold_return": -0.32},
        {"date": "2024-03-01", "portfolio_value": 1540000, "nifty_50": 22100, "gold": 64500, "portfolio_return": 2.67, "nifty_50_return": 5.24, "gold_return": 4.03},
        {"date": "2024-04-01", "portfolio_value": 1580000, "nifty_50": 22800, "gold": 66200, "portfolio_return": 5.33, "nifty_50_return": 8.57, "gold_return": 6.77},
        {"date": "2024-05-01", "portfolio_value": 1620000, "nifty_50": 23200, "gold": 68000, "portfolio_return": 8.0, "nifty_50_return": 10.48, "gold_return": 9.68},
        {"date": "2024-06-01", "portfolio_value": 1650000, "nifty_50": 23500, "gold": 68500, "portfolio_return": 10.0, "nifty_50_return": 11.90, "gold_return": 10.48},
        {"date": "2024-07-01", "portfolio_value": 1680000, "nifty_50": 24100, "gold": 69800, "portfolio_return": 12.0, "nifty_50_return": 14.76, "gold_return": 12.58},
        {"date": "2024-08-01", "portfolio_value": 1720000, "nifty_50": 24800, "gold": 70200, "portfolio_return": 14.67, "nifty_50_return": 18.10, "gold_return": 13.23},
        {"date": "2024-09-01", "portfolio_value": 1750000, "nifty_50": 25200, "gold": 71500, "portfolio_return": 16.67, "nifty_50_return": 20.0, "gold_return": 15.32},
        {"date": "2024-10-01", "portfolio_value": 1780000, "nifty_50": 25600, "gold": 72800, "portfolio_return": 18.67, "nifty_50_return": 21.90, "gold_return": 17.42},
        {"date": "2024-11-01", "portfolio_value": 1820000, "nifty_50": 26100, "gold": 74000, "portfolio_return": 21.33, "nifty_50_return": 24.29, "gold_return": 19.35},
        {"date": "2024-12-01", "portfolio_value": 1850000, "nifty_50": 26500, "gold": 75200, "portfolio_return": 23.33, "nifty_50_return": 26.19, "gold_return": 21.29}
    ]
    
    # Mock Summary data
    summary_data = [
        {"total_portfolio": 1935097.75, "total_invested": 1740000.0, "total_gain_loss": 195097.75, "total_gain_loss_percent": 11.21, "number_of_holdings": 15, "diversification": 8.2, "risk_level": "Moderate"}
    ]
    
    # Mock Top Performers data
    top_performers_data = [
        {"metric": "Best Performer", "symbol": "ICICIBANK", "company_name": "ICICI Bank Limited", "performance": 12.34},
        {"metric": "Worst Performer", "symbol": "ASIANPAINT", "company_name": "Asian Paints Limited", "performance": -6.75},
        {"metric": "Highest Value", "symbol": "MARUTI", "company_name": "Maruti Suzuki India Ltd", "performance": 307509.0},
        {"metric": "Lowest Value", "symbol": "SUNPHARMA", "company_name": "Sun Pharmaceutical Industries", "performance": 74718.0}
    ]
    
    # Convert to DataFrames
    holdings_df = pd.DataFrame(holdings_data)
    performance_df = pd.DataFrame(performance_data)
    performance_df['date'] = pd.to_datetime(performance_df['date'])
    summary_df = pd.DataFrame(summary_data)
    top_performers_df = pd.DataFrame(top_performers_data)
    
    return {
        "holdings": holdings_df,
        "performance": performance_df,
        "summary": summary_df,
        "top_performers": top_performers_df
    }
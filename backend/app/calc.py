import pandas as pd
from typing import Dict, List
from backend.app.models import Holding, SectorAllocation, MarketCapAllocation, PerformancePoint, TopPerformer, PortfolioSummary

def calculate_holdings_metrics(holdings_df: pd.DataFrame) -> List[Holding]:
    """Calculate holding metrics with gain/loss"""
    holdings = []
    
    for _, row in holdings_df.iterrows():
        value = row['quantity'] * row['current_price']
        gain_loss = value - (row['quantity'] * row['avg_price'])
        gain_loss_percent = (gain_loss / (row['quantity'] * row['avg_price'])) * 100 if row['avg_price'] > 0 else 0
        
        holding = Holding(
            symbol=row['symbol'],
            name=row['company_name'],  # Map company_name to name
            quantity=row['quantity'],
            avgPrice=round(row['avg_price'], 2),  # Map avg_price to avgPrice
            currentPrice=round(row['current_price'], 2),  # Map current_price to currentPrice
            sector=row['sector'],
            marketCap=row['market_cap'],  # Map market_cap to marketCap
            value=round(value, 2),
            gainLoss=round(gain_loss, 2),  # Map gain_loss to gainLoss
            gainLossPercent=round(gain_loss_percent, 2)  # Map gain_loss_percent to gainLossPercent
        )
        holdings.append(holding)
    
    return holdings

def calculate_sector_allocation(holdings_df: pd.DataFrame) -> List[SectorAllocation]:
    """Calculate sector-wise allocation"""
    holdings_df['value'] = holdings_df['quantity'] * holdings_df['current_price']
    total_value = holdings_df['value'].sum()
    
    sector_groups = holdings_df.groupby('sector').agg({
        'value': 'sum'
    }).reset_index()
    
    allocations = []
    for _, row in sector_groups.iterrows():
        percentage = (row['value'] / total_value) * 100
        allocation = SectorAllocation(
            sector=row['sector'],
            value=round(row['value'], 2),
            percentage=round(percentage, 2)
        )
        allocations.append(allocation)
    
    return sorted(allocations, key=lambda x: x.value, reverse=True)

def calculate_market_cap_allocation(holdings_df: pd.DataFrame) -> List[MarketCapAllocation]:
    """Calculate market cap allocation"""
    holdings_df['value'] = holdings_df['quantity'] * holdings_df['current_price']
    total_value = holdings_df['value'].sum()
    
    cap_groups = holdings_df.groupby('market_cap').agg({
        'value': 'sum'
    }).reset_index()
    
    allocations = []
    for _, row in cap_groups.iterrows():
        percentage = (row['value'] / total_value) * 100
        allocation = MarketCapAllocation(
            marketCap=row['market_cap'],
            value=round(row['value'], 2),
            percentage=round(percentage, 2)
        )
        allocations.append(allocation)
    
    return sorted(allocations, key=lambda x: x.value, reverse=True)

def calculate_performance_data(performance_df: pd.DataFrame) -> List[PerformancePoint]:
    """Calculate performance timeline"""
    performance_data = []
    
    for _, row in performance_df.iterrows():
        point = PerformancePoint(
            date=row['date'],
            portfolio_value=round(row['portfolio_value'], 2),
            nifty_50=round(row['nifty_50'], 2),
            gold=round(row['gold'], 2),
            portfolio_return=round(row['portfolio_return'], 2),
            nifty_50_return=round(row['nifty_50_return'], 2),
            gold_return=round(row['gold_return'], 2)
        )
        performance_data.append(point)
    
    return performance_data

def calculate_portfolio_summary(holdings_df: pd.DataFrame, summary_df: pd.DataFrame, top_performers_df: pd.DataFrame) -> PortfolioSummary:
    """Calculate portfolio summary metrics"""
    # Get summary metrics
    summary_row = summary_df.iloc[0]
    
    # Calculate top performers
    top_performers = []
    for _, row in top_performers_df.iterrows():
        performer = TopPerformer(
            metric=row['metric'],
            symbol=row['symbol'],
            company_name=row['company_name'],
            value=row['performance']
        )
        top_performers.append(performer)
    
    return PortfolioSummary(
        total_portfolio_value=round(summary_row['total_portfolio'], 2),
        total_invested=round(summary_row['total_invested'], 2),
        total_gain_loss=round(summary_row['total_gain_loss'], 2),
        total_gain_loss_percent=round(summary_row['total_gain_loss_percent'], 2),
        number_of_holdings=summary_row['number_of_holdings'],
        diversification_score=summary_row['diversification'],
        risk_level=summary_row['risk_level'],
        top_performers=top_performers
    )
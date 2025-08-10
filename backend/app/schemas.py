from typing import List, Dict
from pydantic import BaseModel
from backend.app.models import Holding, SectorAllocation, MarketCapAllocation, PerformancePoint, PortfolioSummary

class HoldingsResponse(BaseModel):
    holdings: List[Holding]

class AllocationResponse(BaseModel):
    bySector: Dict[str, Dict[str, float]]
    byMarketCap: Dict[str, Dict[str, float]]

class PerformanceResponse(BaseModel):
    timeline: List[PerformancePoint]
    returns: Dict[str, Dict[str, float]]

class SummaryResponse(BaseModel):
    summary: PortfolioSummary
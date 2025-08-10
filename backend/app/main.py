from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.v1.portfolio import router as portfolio_router
from backend.app.data_loader import load_portfolio_data
import uvicorn

app = FastAPI(
    title="WealthManager Portfolio Analytics API",
    description="Portfolio analytics dashboard backend",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load portfolio data on startup
portfolio_data = None

@app.on_event("startup")
async def startup_event():
    global portfolio_data
    try:
        portfolio_data = load_portfolio_data()
        print("Portfolio data loaded successfully")
    except Exception as e:
        print(f"Error loading portfolio data: {e}")
        portfolio_data = None

# Include routers
app.include_router(portfolio_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "WealthManager Portfolio Analytics API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
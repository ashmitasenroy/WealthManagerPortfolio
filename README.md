# Portfolio Analytics Dashboard - WealthManager.online Assignment

**Full-Stack Developer Intern Assignment Submission**

## 🚀 Project Overview

A comprehensive portfolio analytics dashboard built with **FastAPI backend** and **React TypeScript frontend**, providing real-time portfolio insights and analytics for Indian stock market investments.

**Live URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📋 Assignment Requirements Completed

### ✅ Backend API - 4 Core Endpoints

1. **GET /api/portfolio/holdings** - Complete list of stock investments
2. **GET /api/portfolio/allocation** - Portfolio allocation by sector and market cap
3. **GET /api/portfolio/performance** - Historical performance data and comparisons
4. **GET /api/portfolio/summary** - Portfolio summary with key metrics

### ✅ Frontend Features

- 📊 Interactive dashboard with real-time data visualization
- 💰 Portfolio overview cards showing total value, gains/losses, holdings count
- 📈 Holdings table with detailed stock information
- 🔄 Sector allocation charts
- 🏆 Top performers/losers analysis
- 📱 Professional dark theme with responsive design
- Interactive charts and tables

## Project Structure

```
project/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models.py       # Pydantic models
│   │   ├── schemas.py      # API schemas
│   │   ├── calc.py         # Business logic
│   │   ├── data_loader.py  # Mock data loader
│   │   └── api/v1/         # API routes
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── api/           # API client
├── docker-compose.yml      # Docker configuration
└── start_servers.bat      # Server startup script
```

## Quick Start

### Option 1: Using the Batch Script
1. Ensure Python and Node.js are installed
2. Double-click `start_servers.bat`
3. Backend will start at http://localhost:8000
4. Frontend will start at http://localhost:3000

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
pip install fastapi uvicorn pandas openpyxl starlette python-multipart
cd ..
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Option 3: Quick Test
1. Start the backend (see above)
2. Open `test_dashboard.html` in your browser
3. View portfolio data with simple interface

## API Endpoints

- `GET /` - API information
- `GET /api/portfolio/holdings` - Get all holdings with metrics
- `GET /api/portfolio/allocation` - Get sector and market cap allocation
- `GET /api/portfolio/performance` - Get historical performance data
- `GET /api/portfolio/summary` - Get portfolio summary and top performers

## Docker Support

```bash
docker-compose up --build
```

This will start both backend and frontend in containers.

## Development

The project uses mock data for demonstration. The data loader (`backend/app/data_loader.py`) provides sample Indian stock market portfolio data.

### Technologies Used

#### Backend
- FastAPI - Modern, fast web framework
- Pydantic - Data validation
- Pandas - Data manipulation
- Uvicorn - ASGI server

#### Frontend
- React 18 - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- React Query - Data fetching
- Vite - Build tool
- Recharts - Charts library

## Troubleshooting

1. **Backend import errors**: Ensure you're running from the project root directory
2. **Frontend vite errors**: Install dependencies with `npm install` in frontend directory
3. **CORS issues**: Backend is configured to allow all origins in development
4. **Port conflicts**: Change ports in docker-compose.yml or start scripts if needed

## Fixed Issues

✅ Added missing `__init__.py` files for Python modules
✅ Updated import paths for backend modules
✅ Created proper frontend configuration files
✅ Fixed Python package dependencies
✅ Added proper CORS configuration
✅ Created data directory structure
✅ Added startup scripts for easy deployment

## Project Overview

This project implements a complete portfolio management system that loads portfolio data and provides analytics through a modern web dashboard. The system includes real-time portfolio tracking, sector allocation analysis, performance comparison, and detailed holdings management.

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pandas** - Data manipulation and analysis
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and caching
- **TanStack Table** - Table component with sorting/filtering
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library

## Features

### Backend API Endpoints
- `GET /api/portfolio/holdings` - Returns all holdings with computed metrics
- `GET /api/portfolio/allocation` - Sector and market cap allocation breakdown  
- `GET /api/portfolio/performance` - Historical performance vs benchmarks
- `GET /api/portfolio/summary` - Portfolio summary with key metrics

### Frontend Dashboard
- **Overview Cards** - Total value, gain/loss, holdings count, risk level
- **Allocation Charts** - Interactive donut and bar charts for sector/market cap distribution
- **Performance Tracking** - Line chart comparing portfolio vs Nifty 50 vs Gold
- **Holdings Table** - Sortable, searchable table with color-coded gains/losses
- **Top Performers** - Best/worst performers and portfolio analytics
- **Responsive Design** - Mobile-friendly across all screen sizes

## Setup & Installation

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend will start on `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### Environment Variables

**Backend:**
- `EXCEL_PATH` - Path to Excel data file (optional, uses mock data by default)

**Frontend:**
- `VITE_API_BASE_URL` - Backend API URL (defaults to http://localhost:8000/api)

## API Documentation

### Holdings Endpoint
**GET** `/api/portfolio/holdings`

Returns detailed holdings data with calculated metrics:
```json
{
  "holdings": [
    {
      "symbol": "RELIANCE",
      "company_name": "Reliance Industries Ltd",
      "quantity": 50,
      "avg_price": 2450.0,
      "current_price": 2680.5,
      "sector": "Energy",
      "market_cap": "Large",
      "exchange": "NSE",
      "value": 134025.0,
      "gain_loss": 11525.0,
      "gain_loss_percent": 9.39
    }
  ],
  "total_count": 15
}
```

### Allocation Endpoint  
**GET** `/api/portfolio/allocation`

Returns sector and market cap allocation:
```json
{
  "sector_allocation": [
    {
      "sector": "Technology",
      "value": 624303.75,
      "percentage": 32.25,
      "holdings_count": 4
    }
  ],
  "market_cap_allocation": [
    {
      "market_cap": "Large",
      "value": 1935097.75,
      "percentage": 100.0,
      "holdings_count": 15
    }
  ]
}
```

### Performance Endpoint
**GET** `/api/portfolio/performance`

Returns historical performance data:
```json
{
  "performance_data": [
    {
      "date": "2024-01-01",
      "portfolio_value": 1500000.0,
      "nifty_50": 21000.0,
      "gold": 62000.0,
      "portfolio_return": 0.0,
      "nifty_50_return": 0.0,
      "gold_return": 0.0
    }
  ],
  "returns": {
    "1_month": 2.33,
    "3_months": 8.67,
    "1_year": 23.33
  }
}
```

### Summary Endpoint
**GET** `/api/portfolio/summary`

Returns portfolio summary with key metrics:
```json
{
  "summary": {
    "total_portfolio_value": 1935097.75,
    "total_invested": 1740000.0,
    "total_gain_loss": 195097.75,
    "total_gain_loss_percent": 11.21,
    "number_of_holdings": 15,
    "diversification_score": 8.2,
    "risk_level": "Moderate",
    "top_performers": [
      {
        "metric": "Best Performer",
        "symbol": "ICICIBANK",
        "company_name": "ICICI Bank Limited",
        "value": 12.34
      }
    ]
  }
}
```

## Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend  
npm run test
```

## Deployment

The application is designed for easy deployment to cloud platforms:

**Backend:** Deploy to Render, Railway, or Heroku
**Frontend:** Deploy to Vercel, Netlify, or similar platforms

Make sure to set the appropriate environment variables for production deployment.

## Project Structure

```
/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── api/v1/portfolio.py  # API endpoints
│   │   ├── models.py            # Pydantic models
│   │   ├── schemas.py           # Response schemas
│   │   ├── calc.py              # Business logic and calculations
│   │   └── data_loader.py       # Data loading utilities
│   ├── requirements.txt         # Python dependencies
│   └── tests/                   # Backend tests
├── frontend/
│   ├── src/
│   │   ├── api/client.ts        # API client
│   │   ├── pages/Dashboard.tsx  # Main dashboard page
│   │   ├── components/          # React components
│   │   └── App.tsx              # Root component
│   ├── package.json             # Node.js dependencies
│   └── tailwind.config.js       # Tailwind configuration
└── README.md
```

## Demo Features

The dashboard showcases:
1. **Real-time Portfolio Tracking** - Live updates of portfolio value and performance
2. **Interactive Charts** - Hover effects and tooltips on all visualizations  
3. **Advanced Table Features** - Sorting, searching, and filtering capabilities
4. **Responsive Design** - Optimized for desktop, tablet, and mobile devices
5. **Professional Styling** - Clean, modern UI inspired by financial platforms
6. **Performance Analytics** - Comprehensive comparison with market benchmarks
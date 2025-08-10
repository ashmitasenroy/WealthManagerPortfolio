# Clean Project Structure

## Project Root
```
portfolio-analytics-dashboard/
├── .gitignore
├── .venv/                    # Python virtual environment
├── README.md                 # Project documentation
├── docker-compose.yml        # Docker deployment configuration
├── backend/                  # FastAPI backend
└── frontend/                 # React TypeScript frontend
```

## Backend Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── models.py            # Pydantic models
│   ├── schemas.py           # API schemas
│   ├── calc.py              # Business logic calculations
│   ├── data_loader.py       # Data loading utilities
│   └── api/
│       └── v1/
│           ├── __init__.py
│           └── portfolio.py # Portfolio API endpoints
├── Dockerfile               # Backend Docker configuration
└── requirements.txt         # Python dependencies
```

## Frontend Structure
```
frontend/
├── public/                  # Static assets
├── src/
│   ├── api/
│   │   └── client.ts       # API client for backend communication
│   ├── data/
│   │   └── portfolioData.ts # Static/fallback data
│   ├── App.tsx             # Main dashboard component
│   ├── main.tsx            # React entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # TypeScript definitions
├── .env                    # Environment variables
├── Dockerfile              # Frontend Docker configuration
├── index.html              # HTML template
├── package.json            # Node.js dependencies
├── package-lock.json       # Dependency lock file
├── tailwind.config.js      # TailwindCSS configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint configuration
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # App-specific TypeScript config
└── tsconfig.node.json      # Node-specific TypeScript config
```

## Removed Files
The following unnecessary files were removed to clean up the project:

### Frontend Cleanup
- `src/components/` (unused component files)
- `src/pages/` (unused page files)
- `index2.html` (duplicate)
- `test-simple.html` (test file)
- `test.html` (test file)
- `start-frontend.bat` (redundant script)
- `vite.config.minimal.ts` (unused config)
- `vite.config.ts.backup` (backup file)

### Root Cleanup
- `start-frontend.bat` (redundant script)
- `start-frontend.sh` (redundant script)
- `start_servers.bat` (redundant script)
- `test_dashboard.html` (test file)
- `RUNNING_STATUS.md` (status file)
- `data/` (unused directory)

### Backend Cleanup
- `tests/` (empty test directory)
- `__init__.py` (unnecessary in root)
- `__pycache__/` (Python cache directories)

### Build Artifacts
- `.vite/` (Vite cache)
- All `__pycache__` directories

## Result
- **Clean, minimal structure** with only essential files
- **All functionality preserved** - both frontend and backend work perfectly
- **Easy to understand** project organization
- **Production ready** with Docker configurations
- **Assignment ready** for WealthManager.online submission

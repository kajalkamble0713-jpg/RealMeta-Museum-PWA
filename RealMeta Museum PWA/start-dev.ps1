# RealMeta Museum PWA - Development Startup Script (PowerShell)

Write-Host "🚀 Starting RealMeta Museum PWA Development Environment" -ForegroundColor Green
Write-Host ""

# Check if .env files exist
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Frontend .env not found, creating from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Backend .env not found, creating from example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
}

# Check if MongoDB is running
Write-Host "🔍 Checking MongoDB..." -ForegroundColor Cyan
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
    Write-Host "⚠️  MongoDB not running. Starting with Docker..." -ForegroundColor Yellow
    docker run -d -p 27017:27017 --name realmeta-mongo mongo:7.0
}
else {
    Write-Host "✅ MongoDB ready" -ForegroundColor Green
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
}

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
}

# Start backend in background
Write-Host "🔧 Starting backend server..." -ForegroundColor Cyan
Set-Location backend
Start-Process npm -ArgumentList "run", "dev" -NoNewWindow
Set-Location ..

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend
Write-Host "🎨 Starting frontend development server..." -ForegroundColor Cyan
npm run dev

# Reveal.me Startup Script for Windows/WSL2
# This script automates the initial setup and startup process

Write-Host "🚀 Starting Reveal.me Platform Setup..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ .env file created. Please edit it with your secure passwords!" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANT: Update the passwords in .env before continuing!" -ForegroundColor Red
        Read-Host "Press Enter to continue after updating .env"
    } else {
        Write-Host "❌ env.example not found!" -ForegroundColor Red
        exit 1
    }
}

# Check if Docker is running
Write-Host "🔍 Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first!" -ForegroundColor Red
    exit 1
}

# Create data directories if they don't exist
Write-Host "📁 Creating data directories..." -ForegroundColor Yellow
$directories = @("data/postgres", "data/spiderfoot", "data/reports")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created $dir" -ForegroundColor Green
    } else {
        Write-Host "✅ $dir already exists" -ForegroundColor Green
    }
}

# Start services
Write-Host "🐳 Starting Docker Compose services..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Service URLs:" -ForegroundColor Cyan
    Write-Host "   Backend API: http://localhost:8000" -ForegroundColor White
    Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
    Write-Host "   SpiderFoot: http://localhost:8080" -ForegroundColor White
    Write-Host "   PostgreSQL: localhost:5432" -ForegroundColor White
    Write-Host "   Redis: localhost:6379" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Check service status with: docker-compose ps" -ForegroundColor Yellow
    Write-Host "📋 View logs with: docker-compose logs -f" -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to start services!" -ForegroundColor Red
    Write-Host "Check the logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
} 
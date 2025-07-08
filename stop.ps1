# Reveal.me Stop Script for Windows/WSL2
# This script stops all Reveal.me services

Write-Host "🛑 Stopping Reveal.me Platform Services..." -ForegroundColor Yellow

# Stop all services
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All services stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to stop services!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "💡 To start services again, run: .\start.ps1" -ForegroundColor Cyan
Write-Host "💡 To remove volumes as well, run: docker-compose down -v" -ForegroundColor Cyan 
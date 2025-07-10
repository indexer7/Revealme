#!/usr/bin/env bash

# Reveal.me Bootstrap Script
# Sets up the project environment and starts services

set -e  # Exit on any error

echo "🚀 Setting up Reveal.me..."

# Copy environment template if .env doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env from template..."
    cp env.example .env
    echo "⚠️  Please edit .env with your secure passwords and configuration"
else
    echo "✅ .env already exists"
fi

# Create data directories
echo "📁 Creating data directories..."
mkdir -p data/postgres data/spiderfoot data/reports

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

echo "✅ Setup complete!"
echo ""
echo "🌐 Service URLs:"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo "  - SpiderFoot: http://localhost:8080"
echo ""
echo "📊 Check service status: docker-compose ps"
echo "📋 View logs: docker-compose logs -f" 
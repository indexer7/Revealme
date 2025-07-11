# Reveal.me - OSINT-Driven Cyber-Risk Assessment Platform

An automated OSINT-driven web application that assesses and scores an organization's external cyber-risk posture.

## 🚀 Quick Start

### On macOS / Linux
```bash
git clone https://github.com/indexer7/Revealme.git
cd Revealme
cp .env.example .env
scripts/bootstrap.sh
```

### On Windows
```powershell
git clone https://github.com/indexer7/Revealme.git
cd Revealme
cp .env.example .env
scripts/bootstrap.ps1
```

## 🏗️ Architecture

### Services

- **PostgreSQL** (Port 5432): Primary database for storing assessment data
- **Redis** (Port 6379): Message broker for Celery tasks and caching
- **FastAPI Backend** (Port 8000): REST API for the application
- **Celery Worker**: Background task processing for OSINT scans
- **SpiderFoot** (Port 8080): OSINT data collection engine

### Network

All services communicate via the `revealme-net` bridge network, ensuring secure inter-service communication.

## 📁 Project Structure

```
Reveal.Me/
├── docker-compose.yml          # Main orchestration file
├── env.example                 # Environment template
├── .env                        # Environment variables (create from template)
├── data/                       # Persistent data storage
│   ├── postgres/              # PostgreSQL data
│   ├── spiderfoot/            # SpiderFoot data
│   └── reports/               # Generated reports
├── backend/                    # FastAPI backend
│   └── tests/                  # Test suite
└── scripts/                    # Utility scripts
```

## 🔧 Development Workflow

### Starting Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# View logs
docker-compose logs -f backend
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Rebuilding Services
```bash
# Rebuild specific service
docker-compose build backend

# Rebuild and restart
docker-compose up -d --build backend
```

## 👤 User Management

To create a new user (with a properly-hashed password) directly in the database, use the management script:

```bash
docker-compose exec backend python app/create_user.py alice@example.com "P@ssw0rd!" --role admin
```

- The default role is `viewer` if not specified.
- This script uses the app's own hash_password (from app.utils.security) and AsyncSession (from app.db.session) for safe user creation.

## 🌐 Service URLs

- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **SpiderFoot**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔒 Security Notes

- Change all default passwords in `.env`
- Use strong, unique passwords for production
- Never commit `.env` file to version control
- Consider using Docker secrets for production deployments

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5432, 6379, 8000, and 8080 are available
2. **Permission issues**: Run Docker commands with appropriate permissions

### Health Checks

All services include health checks. Monitor with:
```bash
docker-compose ps
```

### Logs

View service logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend

# Follow logs
docker-compose logs -f worker
```

## 📝 Next Steps

1. Complete FastAPI backend implementation
2. Set up the frontend (to be defined)
3. Implement OSINT connectors
4. Develop scoring algorithms
5. Build report generation system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## 📄 License

[Add your license information here] 
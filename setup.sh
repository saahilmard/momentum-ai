#!/bin/bash

# Momentum AI - Setup Script
# This script sets up the entire Momentum AI platform

set -e  # Exit on error

echo "======================================"
echo "Momentum AI - Setup Script"
echo "======================================"
echo ""

# Check for Docker
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✓ Docker and Docker Compose found"
    USE_DOCKER=true
else
    echo "⚠ Docker not found. Will use manual setup."
    USE_DOCKER=false
fi

# Function for Docker setup
setup_docker() {
    echo ""
    echo "Setting up with Docker..."
    echo ""

    # Start services
    echo "Starting services..."
    docker-compose up -d

    # Wait for services to be ready
    echo "Waiting for services to start..."
    sleep 10

    # Initialize database
    echo "Initializing database..."
    docker-compose exec -T backend python -c "from app.core.database import init_db; init_db()" || true

    echo ""
    echo "======================================"
    echo "✓ Setup Complete!"
    echo "======================================"
    echo ""
    echo "Services:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo ""
    echo "Next steps:"
    echo "  1. Visit http://localhost:3000"
    echo "  2. Check API docs at http://localhost:8000/docs"
    echo "  3. See docs/QUICKSTART.md for examples"
    echo ""
}

# Function for manual setup
setup_manual() {
    echo ""
    echo "Manual setup requires:"
    echo "  - Python 3.11+"
    echo "  - Node.js 18+"
    echo "  - PostgreSQL 15+"
    echo ""

    read -p "Continue with manual setup? (y/n) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi

    # Backend setup
    echo ""
    echo "Setting up backend..."
    cd backend

    # Create virtual environment
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi

    # Activate virtual environment
    source venv/bin/activate || . venv/Scripts/activate

    # Install dependencies
    echo "Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt

    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        cp .env.example .env
        echo "⚠ Please edit backend/.env with your database credentials"
    fi

    cd ..

    # Frontend setup
    echo ""
    echo "Setting up frontend..."
    cd frontend

    # Install dependencies
    echo "Installing Node dependencies..."
    npm install

    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating frontend .env file..."
        echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
    fi

    cd ..

    echo ""
    echo "======================================"
    echo "✓ Setup Complete!"
    echo "======================================"
    echo ""
    echo "To start the services:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  python -c 'from app.core.database import init_db; init_db()'  # First time only"
    echo "  uvicorn app.main:app --reload"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
}

# Main setup
if [ "$USE_DOCKER" = true ]; then
    setup_docker
else
    setup_manual
fi

echo "For more information, see:"
echo "  - README.md"
echo "  - docs/QUICKSTART.md"
echo "  - docs/MATHEMATICS.md"
echo ""
echo "Happy forecasting! 🚀"

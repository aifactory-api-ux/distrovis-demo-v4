#!/bin/bash
set -e

echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

echo "Building and starting services..."
docker-compose up --build -d

echo "Waiting for services to be healthy..."
sleep 10

echo ""
echo "Services are now running:"
echo "  - Frontend: http://localhost:3000"
echo "  - API: http://localhost:8001"
echo "  - Health check: http://localhost:8001/health"
echo ""
echo "Run 'docker-compose logs -f' to see logs"
echo "Run 'docker-compose down' to stop services"

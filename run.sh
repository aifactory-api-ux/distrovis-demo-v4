#!/bin/bash
set -e

echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "Building and starting services..."
docker-compose up --build -d

echo "Waiting for services to be healthy..."
sleep 30

echo "Checking service health..."
docker-compose ps

echo ""
echo "=========================================="
echo "Services are running!"
echo "Frontend: http://localhost:5173"
echo "API Gateway (Kong): http://localhost:8000"
echo "Health Check: http://localhost:8000/health"
echo "=========================================="
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
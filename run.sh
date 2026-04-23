#!/bin/bash
set -e

echo "=== DistroViz Startup Script ==="

if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "Building and starting all services..."

if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

echo ""
echo "Waiting for services to be healthy..."

sleep 10

echo ""
echo "=== Service Status ==="
if docker compose version &> /dev/null; then
    docker compose ps
else
    docker-compose ps
fi

echo ""
echo "=== Access Points ==="
echo "Frontend:     http://localhost:3000"
echo "Auth Service: http://localhost:8001"
echo "Order Service: http://localhost:8002"
echo "Plant Service: http://localhost:8003"
echo "Distribution:  http://localhost:8004"
echo "Order Worker:  http://localhost:8005"
echo "RabbitMQ:      http://localhost:15672 (guest/guest)"
echo ""
echo "Login credentials:"
echo "  Email:    admin@distroviz.com"
echo "  Password: password123"
echo ""
echo "To view logs: docker compose logs -f [service-name]"
echo "To stop:     docker compose down"
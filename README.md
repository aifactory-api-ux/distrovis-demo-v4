# DistroViz - Distribution Visualization Dashboard

A comprehensive distribution management system featuring a React dashboard, multiple Node.js microservices, PostgreSQL database, Redis cache, and RabbitMQ message broker.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend Services**: Node.js 20 + Express + TypeScript
  - auth-service (port 8001)
  - order-service (port 8002)
  - plant-service (port 8003)
  - distribution-service (port 8004)
  - order-worker (port 8005)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Message Broker**: RabbitMQ 3.12

## Quick Start

```bash
./run.sh
```

This will build and start all services. Access the dashboard at http://localhost:3000

## Login Credentials

- Email: admin@distroviz.com
- Password: password123

## API Endpoints

### Auth Service (port 8001)

- `POST /auth/login` - Login with email and password
- `GET /auth/me` - Get current user info (Bearer token required)

### Order Service (port 8002)

- `POST /orders` - Create a new order (Bearer token required)
- `GET /orders` - List all orders (Bearer token required)
- `GET /orders/:id` - Get order by ID (Bearer token required)
- `GET /kpi` - Get KPI data (Bearer token required)

### Plant Service (port 8003)

- `GET /plants` - List all plants (Bearer token required)

### Distribution Service (port 8004)

- `GET /distribution-centers` - List all distribution centers (Bearer token required)

## Development

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 15 (if running locally)
- Redis 7 (if running locally)
- RabbitMQ 3.12 (if running locally)

### Local Development

1. Install dependencies for each service:
```bash
cd backend/auth-service && npm install
cd backend/order-service && npm install
cd backend/plant-service && npm install
cd backend/distribution-service && npm install
cd backend/order-worker && npm install
cd frontend && npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run database migrations:
```bash
./backend/scripts/migrate.sh
./backend/scripts/seed.sh
```

4. Start services:
```bash
# Terminal 1: Start auth-service
cd backend/auth-service && npm run dev

# Terminal 2: Start order-service
cd backend/order-service && npm run dev

# Terminal 3: Start plant-service
cd backend/plant-service && npm run dev

# Terminal 4: Start distribution-service
cd backend/distribution-service && npm run dev

# Terminal 5: Start order-worker
cd backend/order-worker && npm run dev

# Terminal 6: Start frontend
cd frontend && npm run dev
```

## Docker

Build all services:
```bash
docker compose build
```

Run all services:
```bash
docker compose up -d
```

View logs:
```bash
docker compose logs -f [service-name]
```

Stop all services:
```bash
docker compose down
```

## Testing

Run tests for each service:
```bash
cd [service-directory] && npm test
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
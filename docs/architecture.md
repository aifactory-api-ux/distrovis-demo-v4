# DistroViz Architecture

## System Overview

DistroViz is a microservices-based distribution visualization system consisting of:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│                    (React + TypeScript)                          │
│                       Port: 3000                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Kong)                          │
│                        Port: 8000                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ auth-service  │    │ order-service │    │ plant-service │
│   Port: 8001  │    │   Port: 8002  │    │   Port: 8003  │
└───────────────┘    └───────┬───────┘    └───────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        order-worker                              │
│                      (RabbitMQ Consumer)                          │
│                        Port: 8005                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Message Broker (RabbitMQ)                      │
│                          Port: 5672                              │
└─────────────────────────────────────────────────────────────────┘
```

## Services

### Frontend
- **Technology**: React 18 + TypeScript + Vite
- **Purpose**: User interface for dashboard, order management, and visualization
- **Dependencies**: Redux Toolkit for state management, Recharts for charts

### Auth Service (Port 8001)
- **Technology**: Node.js + Express + TypeScript
- **Purpose**: User authentication and authorization
- **Endpoints**:
  - POST /auth/login
  - GET /auth/me
- **Dependencies**: PostgreSQL, Redis, JWT

### Order Service (Port 8002)
- **Technology**: Node.js + Express + TypeScript
- **Purpose**: Order CRUD operations and KPI calculations
- **Endpoints**:
  - POST /orders
  - GET /orders
  - GET /orders/:id
  - GET /kpi
- **Dependencies**: PostgreSQL, Redis, RabbitMQ

### Plant Service (Port 8003)
- **Technology**: Node.js + Express + TypeScript
- **Purpose**: Plant catalog management
- **Endpoints**:
  - GET /plants
- **Dependencies**: PostgreSQL, Redis

### Distribution Service (Port 8004)
- **Technology**: Node.js + Express + TypeScript
- **Purpose**: Distribution center catalog management
- **Endpoints**:
  - GET /distribution-centers
- **Dependencies**: PostgreSQL, Redis

### Order Worker (Port 8005)
- **Technology**: Node.js + TypeScript
- **Purpose**: Consumes order events from RabbitMQ and updates inventory
- **Dependencies**: PostgreSQL, RabbitMQ

## Data Flow

1. **Order Creation**:
   - User creates order via frontend
   - Frontend sends POST to order-service
   - Order is saved to PostgreSQL
   - Event is published to RabbitMQ
   - Order worker consumes event and updates inventory

2. **Dashboard Loading**:
   - Frontend fetches KPI data from order-service
   - Frontend fetches plants from plant-service
   - Frontend fetches distribution centers from distribution-service
   - All data is combined in the Redux store

## Database Schema

### Users
- id (UUID)
- email (VARCHAR)
- password_hash (VARCHAR)
- role (ENUM: admin, operator, viewer)

### Plants
- id (UUID)
- name (VARCHAR)
- location (VARCHAR)

### Distribution Centers
- id (UUID)
- name (VARCHAR)
- address (VARCHAR)

### Orders
- id (UUID)
- user_id (UUID, FK)
- plant_id (UUID, FK)
- distribution_center_id (UUID, FK)
- status (ENUM: pending, processing, completed, cancelled)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Order Items
- id (UUID)
- order_id (UUID, FK)
- product_name (VARCHAR)
- quantity (INTEGER)
- unit_price (DECIMAL)

## Infrastructure

### PostgreSQL (Port 5432)
- Primary data store
- Stores users, plants, distribution centers, orders, and order items

### Redis (Port 6379)
- Session storage
- Caching layer

### RabbitMQ (Port 5672)
- Message broker for order events
- Enables asynchronous processing

## Security

- JWT-based authentication
- Bearer token required for protected endpoints
- Password hashing for user credentials
- CORS configuration for API gateway
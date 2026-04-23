# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Node.js v20.11.1
  - Express.js v4.18.2
  - TypeScript v5.2.2
  - PostgreSQL v15
  - Redis v7
  - RabbitMQ v3.12
- **Frontend**
  - React v18.2.0
  - TypeScript v5.2.2
- **API Gateway**
  - Kong v3.4
- **Containerization & Orchestration**
  - Docker v24
  - Docker Compose v2.20
  - Kubernetes v1.28
- **Other**
  - dotenv v16.3.1 (backend)
  - pg v8.11.1 (backend)
  - ioredis v5.3.2 (backend)
  - amqplib v0.10.3 (backend)
  - axios v1.6.2 (frontend)
  - react-router-dom v6.16.0 (frontend)
  - @reduxjs/toolkit v1.9.5 (frontend)
  - react-redux v8.1.2 (frontend)

---

## 2. DATA CONTRACTS

### TypeScript Interfaces (Backend & Frontend)

#### User

```typescript
export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'operator' | 'viewer';
}
```

#### Plant

```typescript
export interface Plant {
  id: string;
  name: string;
  location: string;
}
```

#### DistributionCenter

```typescript
export interface DistributionCenter {
  id: string;
  name: string;
  address: string;
}
```

#### Order

```typescript
export interface Order {
  id: string;
  user_id: string;
  plant_id: string;
  distribution_center_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  items: OrderItem[];
}
```

#### OrderItem

```typescript
export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}
```

#### AuthRequest

```typescript
export interface AuthRequest {
  email: string;
  password: string;
}
```

#### AuthResponse

```typescript
export interface AuthResponse {
  token: string;
  user: User;
}
```

#### CreateOrderRequest

```typescript
export interface CreateOrderRequest {
  plant_id: string;
  distribution_center_id: string;
  items: {
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];
}
```

#### CreateOrderResponse

```typescript
export interface CreateOrderResponse {
  order: Order;
}
```

#### OrderListResponse

```typescript
export interface OrderListResponse {
  orders: Order[];
}
```

#### KPIResponse

```typescript
export interface KPIResponse {
  total_units: number;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
}
```

---

## 3. API ENDPOINTS

### Auth Service

#### POST /auth/login

- **Request Body:** `AuthRequest`
- **Response:** `AuthResponse`

#### GET /auth/me

- **Headers:** `Authorization: Bearer <token>`
- **Response:** `User`

---

### Order Service

#### POST /orders

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `CreateOrderRequest`
- **Response:** `CreateOrderResponse`
- **Status:** 201 Created

#### GET /orders

- **Headers:** `Authorization: Bearer <token>`
- **Response:** `OrderListResponse`
- **Status:** 200 OK

#### GET /orders/:id

- **Headers:** `Authorization: Bearer <token>`
- **Response:** `Order`
- **Status:** 200 OK

#### GET /kpi

- **Headers:** `Authorization: Bearer <token>`
- **Response:** `KPIResponse`
- **Status:** 200 OK

---

### Plant Service

#### GET /plants

- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ plants: Plant[] }`
- **Status:** 200 OK

---

### Distribution Center Service

#### GET /distribution-centers

- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ distribution_centers: DistributionCenter[] }`
- **Status:** 200 OK

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service             | Listening Port | Path                        |
|---------------------|---------------|-----------------------------|
| auth-service        | 8001          | backend/auth-service/       |
| order-service       | 8002          | backend/order-service/      |
| plant-service       | 8003          | backend/plant-service/      |
| distribution-service| 8004          | backend/distribution-service/|
| order-worker        | 8005          | backend/order-worker/       |

### SHARED MODULES

| Shared path         | Imported by services                                         |
|---------------------|-------------------------------------------------------------|
| backend/shared/     | auth-service, order-service, plant-service, distribution-service, order-worker |

---

### FILE TREE

```
.
├── docker-compose.yml                # Multi-service orchestration (Postgres, Redis, RabbitMQ, Kong, all services)
├── .env.example                     # Template for all required environment variables
├── .gitignore                       # Ignore node_modules, build, .env, etc.
├── README.md                        # Project overview and setup instructions
├── run.sh                           # Root-level startup script for local dev
├── backend/
│   ├── shared/                      # Shared TypeScript models, utils, and types
│   │   ├── models/
│   │   │   ├── user.ts              # User interface
│   │   │   ├── plant.ts             # Plant interface
│   │   │   ├── distributionCenter.ts# DistributionCenter interface
│   │   │   ├── order.ts             # Order and OrderItem interfaces
│   │   ├── types/
│   │   │   ├── auth.ts              # AuthRequest, AuthResponse interfaces
│   │   │   ├── kpi.ts               # KPIResponse interface
│   │   ├── utils/
│   │   │   ├── jwt.ts               # JWT encode/decode helpers
│   │   │   ├── db.ts                # DB connection helpers
│   ├── auth-service/
│   │   ├── Dockerfile               # Dockerfile for auth-service (EXPOSE 8001)
│   │   ├── src/
│   │   │   ├── index.ts             # Express entry point
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts          # /auth/login, /auth/me endpoints
│   │   │   ├── controllers/
│   │   │   │   ├── authController.ts# Auth logic
│   │   │   ├── services/
│   │   │   │   ├── userService.ts   # User DB logic
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts# JWT validation
│   │   │   ├── config/
│   │   │   │   ├── index.ts         # Service config
│   │   │   ├── app.ts               # Express app setup
│   │   ├── package.json             # Service dependencies
│   │   ├── tsconfig.json            # TypeScript config
│   ├── order-service/
│   │   ├── Dockerfile               # Dockerfile for order-service (EXPOSE 8002)
│   │   ├── src/
│   │   │   ├── index.ts             # Express entry point
│   │   │   ├── routes/
│   │   │   │   ├── orders.ts        # /orders endpoints
│   │   │   │   ├── kpi.ts           # /kpi endpoint
│   │   │   ├── controllers/
│   │   │   │   ├── orderController.ts# Order logic
│   │   │   │   ├── kpiController.ts # KPI logic
│   │   │   ├── services/
│   │   │   │   ├── orderService.ts  # Order DB logic
│   │   │   │   ├── kpiService.ts    # KPI calculations
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts# JWT validation
│   │   │   ├── config/
│   │   │   │   ├── index.ts         # Service config
│   │   │   ├── app.ts               # Express app setup
│   │   ├── package.json             # Service dependencies
│   │   ├── tsconfig.json            # TypeScript config
│   ├── plant-service/
│   │   ├── Dockerfile               # Dockerfile for plant-service (EXPOSE 8003)
│   │   ├── src/
│   │   │   ├── index.ts             # Express entry point
│   │   │   ├── routes/
│   │   │   │   ├── plants.ts        # /plants endpoint
│   │   │   ├── controllers/
│   │   │   │   ├── plantController.ts# Plant logic
│   │   │   ├── services/
│   │   │   │   ├── plantService.ts  # Plant DB logic
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts# JWT validation
│   │   │   ├── config/
│   │   │   │   ├── index.ts         # Service config
│   │   │   ├── app.ts               # Express app setup
│   │   ├── package.json             # Service dependencies
│   │   ├── tsconfig.json            # TypeScript config
│   ├── distribution-service/
│   │   ├── Dockerfile               # Dockerfile for distribution-service (EXPOSE 8004)
│   │   ├── src/
│   │   │   ├── index.ts             # Express entry point
│   │   │   ├── routes/
│   │   │   │   ├── distributionCenters.ts # /distribution-centers endpoint
│   │   │   ├── controllers/
│   │   │   │   ├── distributionController.ts # DistributionCenter logic
│   │   │   ├── services/
│   │   │   │   ├── distributionService.ts # DistributionCenter DB logic
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts# JWT validation
│   │   │   ├── config/
│   │   │   │   ├── index.ts         # Service config
│   │   │   ├── app.ts               # Express app setup
│   │   ├── package.json             # Service dependencies
│   │   ├── tsconfig.json            # TypeScript config
│   ├── order-worker/
│   │   ├── Dockerfile               # Dockerfile for order-worker (EXPOSE 8005)
│   │   ├── src/
│   │   │   ├── index.ts             # Worker entry point
│   │   │   ├── worker/
│   │   │   │   ├── orderConsumer.ts # RabbitMQ consumer for order.created
│   │   │   ├── services/
│   │   │   │   ├── inventoryService.ts # Inventory update logic
│   │   │   ├── config/
│   │   │   │   ├── index.ts         # Worker config
│   │   ├── package.json             # Worker dependencies
│   │   ├── tsconfig.json            # TypeScript config
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_init.sql         # Initial schema
│   │   ├── seed/
│   │   │   ├── seed.sql             # Seed data
│   ├── scripts/
│   │   ├── migrate.sh               # DB migration script
│   │   ├── seed.sh                  # DB seed script
├── frontend/
│   ├── Dockerfile                   # Dockerfile for frontend
│   ├── public/
│   │   ├── index.html               # HTML entry point
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Root component
│   │   ├── api/
│   │   │   ├── auth.ts              # Auth API client
│   │   │   ├── orders.ts            # Orders API client
│   │   │   ├── kpi.ts               # KPI API client
│   │   │   ├── plants.ts            # Plants API client
│   │   │   ├── distributionCenters.ts # DistributionCenters API client
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Auth state hook
│   │   │   ├── useOrders.ts         # Orders state hook
│   │   │   ├── useKPI.ts            # KPI state hook
│   │   │   ├── usePlants.ts         # Plants state hook
│   │   │   ├── useDistributionCenters.ts # DistributionCenters state hook
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.tsx    # Login form component
│   │   │   ├── Orders/
│   │   │   │   ├── OrderList.tsx    # Order list component
│   │   │   │   ├── OrderForm.tsx    # Order creation form
│   │   │   ├── KPI/
│   │   │   │   ├── KPIDashboard.tsx # KPI dashboard
│   │   │   ├── Plants/
│   │   │   │   ├── PlantSelect.tsx  # Plant selector
│   │   │   ├── DistributionCenters/
│   │   │   │   ├── DistributionCenterSelect.tsx # Distribution center selector
│   │   ├── store/
│   │   │   ├── index.ts             # Redux store setup
│   │   │   ├── authSlice.ts         # Auth state slice
│   │   │   ├── ordersSlice.ts       # Orders state slice
│   │   │   ├── kpiSlice.ts          # KPI state slice
│   │   │   ├── plantsSlice.ts       # Plants state slice
│   │   │   ├── distributionCentersSlice.ts # DistributionCenters state slice
│   │   ├── types/
│   │   │   ├── index.ts             # Shared frontend types
│   ├── package.json                 # Frontend dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── .env.example                 # Frontend env vars template
│   ├── README.md                    # Frontend-specific docs
│   ├── start.sh                     # Frontend startup script
```

---

## 5. ENVIRONMENT VARIABLES

| Name                        | Type    | Description                                         | Example Value                |
|-----------------------------|---------|-----------------------------------------------------|------------------------------|
| POSTGRES_HOST               | string  | PostgreSQL hostname                                 | postgres                     |
| POSTGRES_PORT               | number  | PostgreSQL port                                     | 5432                         |
| POSTGRES_DB                 | string  | PostgreSQL database name                            | distroviz                    |
| POSTGRES_USER               | string  | PostgreSQL username                                 | distroviz_user               |
| POSTGRES_PASSWORD           | string  | PostgreSQL password                                 | supersecret                  |
| REDIS_HOST                  | string  | Redis hostname                                      | redis                        |
| REDIS_PORT                  | number  | Redis port                                          | 6379                         |
| RABBITMQ_HOST               | string  | RabbitMQ hostname                                   | rabbitmq                     |
| RABBITMQ_PORT               | number  | RabbitMQ port                                       | 5672                         |
| JWT_SECRET                  | string  | Secret for JWT signing                              | myjwtsecret                  |
| AUTH_SERVICE_PORT           | number  | Auth service port                                   | 8001                         |
| ORDER_SERVICE_PORT          | number  | Order service port                                  | 8002                         |
| PLANT_SERVICE_PORT          | number  | Plant service port                                  | 8003                         |
| DISTRIBUTION_SERVICE_PORT   | number  | Distribution service port                           | 8004                         |
| ORDER_WORKER_PORT           | number  | Order worker port                                   | 8005                         |
| KONG_ADMIN_URL              | string  | Kong admin API URL                                  | http://kong:8001             |
| KONG_PROXY_URL              | string  | Kong proxy URL                                      | http://kong:8000             |
| FRONTEND_PORT               | number  | Frontend dev server port                            | 3000                         |
| REACT_APP_API_URL           | string  | Frontend base API URL (proxied via Kong)            | http://localhost:8000        |

---

## 6. IMPORT CONTRACTS

### Backend Shared Models

- `from 'backend/shared/models/user' import User`
- `from 'backend/shared/models/plant' import Plant`
- `from 'backend/shared/models/distributionCenter' import DistributionCenter`
- `from 'backend/shared/models/order' import Order, OrderItem`
- `from 'backend/shared/types/auth' import AuthRequest, AuthResponse`
- `from 'backend/shared/types/kpi' import KPIResponse`
- `from 'backend/shared/utils/jwt' import signJWT, verifyJWT`
- `from 'backend/shared/utils/db' import getDbConnection`

### Auth Service

- `from 'src/controllers/authController' import login, getMe`
- `from 'src/services/userService' import findUserByEmail, createUser`
- `from 'src/middleware/authMiddleware' import requireAuth`

### Order Service

- `from 'src/controllers/orderController' import createOrder, listOrders, getOrderById`
- `from 'src/controllers/kpiController' import getKPI`
- `from 'src/services/orderService' import insertOrder, fetchOrders, fetchOrderById`
- `from 'src/services/kpiService' import calculateKPI`
- `from 'src/middleware/authMiddleware' import requireAuth`

### Plant Service

- `from 'src/controllers/plantController' import listPlants`
- `from 'src/services/plantService' import fetchPlants`
- `from 'src/middleware/authMiddleware' import requireAuth`

### Distribution Service

- `from 'src/controllers/distributionController' import listDistributionCenters`
- `from 'src/services/distributionService' import fetchDistributionCenters`
- `from 'src/middleware/authMiddleware' import requireAuth`

### Order Worker

- `from 'src/worker/orderConsumer' import startOrderConsumer`
- `from 'src/services/inventoryService' import updateInventory`

### Frontend

- `import { useAuth } from './hooks/useAuth'`
- `import { useOrders } from './hooks/useOrders'`
- `import { useKPI } from './hooks/useKPI'`
- `import { usePlants } from './hooks/usePlants'`
- `import { useDistributionCenters } from './hooks/useDistributionCenters'`
- `import { Order, OrderItem, User, Plant, DistributionCenter, KPIResponse } from './types'`
- `import { LoginForm } from './components/Auth/LoginForm'`
- `import { OrderList } from './components/Orders/OrderList'`
- `import { OrderForm } from './components/Orders/OrderForm'`
- `import { KPIDashboard } from './components/KPI/KPIDashboard'`
- `import { PlantSelect } from './components/Plants/PlantSelect'`
- `import { DistributionCenterSelect } from './components/DistributionCenters/DistributionCenterSelect'`

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### React Hooks

- `useAuth() → { user: User | null, token: string | null, loading: boolean, error: string | null, login: (email: string, password: string) => Promise<void>, logout: () => void }`
- `useOrders() → { orders: Order[], loading: boolean, error: string | null, createOrder: (data: CreateOrderRequest) => Promise<Order>, fetchOrders: () => Promise<void> }`
- `useKPI() → { kpi: KPIResponse | null, loading: boolean, error: string | null, fetchKPI: () => Promise<void> }`
- `usePlants() → { plants: Plant[], loading: boolean, error: string | null, fetchPlants: () => Promise<void> }`
- `useDistributionCenters() → { distributionCenters: DistributionCenter[], loading: boolean, error: string | null, fetchDistributionCenters: () => Promise<void> }`

### Components

- `LoginForm` props: `{ onSubmit: (data: AuthRequest) => void, loading: boolean, error: string | null }`
- `OrderList` props: `{ orders: Order[], onSelect: (order: Order) => void }`
- `OrderForm` props: `{ plants: Plant[], distributionCenters: DistributionCenter[], onSubmit: (data: CreateOrderRequest) => void, loading: boolean }`
- `KPIDashboard` props: `{ kpi: KPIResponse | null, loading: boolean }`
- `PlantSelect` props: `{ plants: Plant[], value: string, onChange: (id: string) => void }`
- `DistributionCenterSelect` props: `{ distributionCenters: DistributionCenter[], value: string, onChange: (id: string) => void }`

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (all React components and hooks)
- **Backend files:** `.ts` (all Node.js/Express services)
- **Project language:** TypeScript (strict mode enabled everywhere)
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html` via `<script src="/src/main.tsx">`)
- **No `.jsx` or `.js` files are permitted in this project. All code must use `.ts` or `.tsx` extensions as appropriate.**
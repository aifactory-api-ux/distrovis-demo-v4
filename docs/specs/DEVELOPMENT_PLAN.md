# DEVELOPMENT PLAN: Distrovis demo v4

## 1. ARCHITECTURE OVERVIEW

**System Components:**
- **Frontend (React 18 + TypeScript):** Responsive dashboard for KPIs, order management, charts, and creation form.
- **Backend Microservices (Node.js 20 + Express.js + TypeScript):**
  - **auth-service:** (Port 8001) — User authentication (login, me)
  - **order-service:** (Port 8002) — Orders CRUD, KPIs, order listing
  - **plant-service:** (Port 8003) — Plant catalog
  - **distribution-service:** (Port 8004) — Distribution center catalog
  - **order-worker:** (Port 8005) — RabbitMQ consumer for order events, inventory updates
- **Shared Modules:** TypeScript interfaces, types, and utilities for cross-service consistency
- **Database:** PostgreSQL 15 (primary), initialized via SQL migration scripts
- **Cache:** Redis 7 (sessions, caching)
- **Message Broker:** RabbitMQ 3.12 (order events)
- **API Gateway:** Kong 3.4 (routing, CORS, security)
- **Containerization:** Docker, Docker Compose, Kubernetes manifests
- **Infrastructure:** Healthchecks, environment validation, structured logging, secure config

**Folder Structure:**
```
project-root/
├── frontend/
│   ├── src/
│   └── Dockerfile
├── backend/
│   ├── shared/
│   │   ├── models/
│   │   │   ├── user.ts
│   │   │   ├── plant.ts
│   │   │   ├── distributionCenter.ts
│   │   │   ├── order.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── kpi.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── db.ts
│   ├── auth-service/
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   ├── controllers/
│   │   │   │   ├── authController.ts
│   │   │   ├── services/
│   │   │   │   ├── userService.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts
│   │   │   ├── config/
│   │   │   │   ├── index.ts
│   ├── order-service/
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── routes/
│   │   │   │   ├── orders.ts
│   │   │   │   ├── kpi.ts
│   │   │   ├── controllers/
│   │   │   │   ├── orderController.ts
│   │   │   │   ├── kpiController.ts
│   │   │   ├── services/
│   │   │   │   ├── orderService.ts
│   │   │   │   ├── kpiService.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts
│   │   │   ├── config/
│   │   │   │   ├── index.ts
│   ├── plant-service/
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── routes/
│   │   │   │   ├── plants.ts
│   │   │   ├── controllers/
│   │   │   │   ├── plantController.ts
│   │   │   ├── services/
│   │   │   │   ├── plantService.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts
│   │   │   ├── config/
│   │   │   │   ├── index.ts
│   ├── distribution-service/
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── routes/
│   │   │   │   ├── distributionCenters.ts
│   │   │   ├── controllers/
│   │   │   │   ├── distributionController.ts
│   │   │   ├── services/
│   │   │   │   ├── distributionService.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts
│   │   │   ├── config/
│   │   │   │   ├── index.ts
│   ├── order-worker/
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── worker/
│   │   │   │   ├── orderConsumer.ts
│   │   │   ├── services/
│   │   │   │   ├── inventoryService.ts
│   │   │   ├── config/
│   │   │   │   ├── index.ts
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_init.sql
│   │   ├── seed/
│   │   │   ├── seed.sql
│   ├── scripts/
│   │   ├── migrate.sh
│   │   ├── seed.sh
├── docs/
│   ├── architecture.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── run.sh
├── README.md
```

**API Endpoints:**  
(See SPEC.md §3 for full details; all endpoints, request/response types, and headers are strictly enforced.)

## 2. ACCEPTANCE CRITERIA

1. **Dashboard displays real-time KPIs, charts, and paginated order table, all filterable by plant and order status, with loading indicators and error handling.**
2. **Order creation form validates input, submits to API, shows success/error notifications, and resets on success.**
3. **All backend services expose health endpoints, validate environment variables, use structured logging, and enforce input validation and error handling.**
4. **System runs end-to-end with `./run.sh`, all services healthy, frontend accessible, and all API endpoints functional.**
5. **Tests cover at least one happy-path and one error-case per endpoint/component.**

---

## TEAM SCOPE (MANDATORY — PARSED BY THE PIPELINE)

- **role-tl (technical_lead):** Foundation, shared types, config, DB schema
- **role-be (backend_developer):** Auth, Order, Plant, Distribution, Worker services
- **role-fe (frontend_developer):** React dashboard, forms, charts, state, API integration
- **role-devops (devops_support):** Infrastructure, orchestration, CI/CD, documentation

---

## 3. EXECUTABLE ITEMS

---

### ITEM 1: Foundation — shared types, interfaces, DB schemas, config

**Goal:**  
Establish all shared TypeScript interfaces, enums, types, and utility modules for cross-service use; define the complete PostgreSQL schema (SQL) for all entities; provide shared config and utility functions for DB and JWT; ensure all other items can import these modules.

**Files to create:**
- backend/shared/models/user.ts — User interface
- backend/shared/models/plant.ts — Plant interface
- backend/shared/models/distributionCenter.ts — DistributionCenter interface
- backend/shared/models/order.ts — Order and OrderItem interfaces
- backend/shared/types/auth.ts — AuthRequest, AuthResponse interfaces
- backend/shared/types/kpi.ts — KPIResponse interface
- backend/shared/utils/jwt.ts — JWT encode/decode helpers
- backend/shared/utils/db.ts — DB connection helpers (PostgreSQL, Redis)
- backend/shared/config/index.ts — Shared config, env validation, constants
- backend/database/migrations/001_init.sql — Full DB schema (User, Plant, DistributionCenter, Order, OrderItem, indexes, FKs)
- backend/database/seed/seed.sql — Seed data for all tables

**Tests required:**
- backend/shared/tests/models.test.ts — Validate all interfaces/types (compile-time)
- backend/shared/tests/utils.test.ts — Test JWT and DB helpers

**Dependencies:** None

**Validation:**  
- `tsc --noEmit` in backend/shared/ passes (type correctness)
- `psql < backend/database/migrations/001_init.sql` creates all tables and indexes without error
- `psql < backend/database/seed/seed.sql` populates tables with seed data

**Role:** role-tl (technical_lead)

---

### ITEM 2: Auth Service — login, me endpoints, JWT, user DB logic

**Goal:**  
Implement the authentication microservice with endpoints:
- POST /auth/login (body: AuthRequest, returns AuthResponse)
- GET /auth/me (JWT-protected, returns User)
- Healthcheck endpoint
- JWT validation middleware
- User DB logic (find by email, password hash check)
- Structured logging, env validation, error handling

**Files to create:**
- backend/auth-service/src/index.ts — HTTP server bootstrap (port 8001)
- backend/auth-service/src/app.ts — Express app setup, registers routers
- backend/auth-service/src/routes/auth.ts — /auth/login, /auth/me endpoints
- backend/auth-service/src/controllers/authController.ts — Auth logic
- backend/auth-service/src/services/userService.ts — User DB logic
- backend/auth-service/src/middleware/authMiddleware.ts — JWT validation
- backend/auth-service/src/config/index.ts — Service config/env
- backend/auth-service/Dockerfile — Multi-stage build, EXPOSE 8001, COPY ../shared ./shared, CMD: node dist/index.js
- backend/auth-service/package.json — Dependencies, scripts (start, build, test)
- backend/auth-service/tsconfig.json — TypeScript config (strict)
- backend/auth-service/tests/auth.test.ts — Tests: login success/failure, me endpoint, JWT validation

**Dependencies:** Item 1

**Validation:**  
- `npm run build && npm test` passes
- Service responds to /auth/login and /auth/me as per SPEC.md
- Healthcheck endpoint returns status

**Role:** role-be (backend_developer)

---

### ITEM 3: Order Service — orders CRUD, KPIs, filtering, RabbitMQ events

**Goal:**  
Implement the order management microservice with endpoints:
- POST /orders (JWT-protected, CreateOrderRequest → CreateOrderResponse, emits RabbitMQ event)
- GET /orders (JWT-protected, returns OrderListResponse, supports filtering by plant/status)
- GET /orders/:id (JWT-protected, returns Order)
- GET /kpi (JWT-protected, returns KPIResponse, supports filtering)
- Healthcheck endpoint
- Order DB logic, KPI calculations, RabbitMQ publisher
- Structured logging, env validation, error handling

**Files to create:**
- backend/order-service/src/index.ts — HTTP server bootstrap (port 8002)
- backend/order-service/src/app.ts — Express app setup, registers routers
- backend/order-service/src/routes/orders.ts — /orders endpoints
- backend/order-service/src/routes/kpi.ts — /kpi endpoint
- backend/order-service/src/controllers/orderController.ts — Order logic
- backend/order-service/src/controllers/kpiController.ts — KPI logic
- backend/order-service/src/services/orderService.ts — Order DB logic
- backend/order-service/src/services/kpiService.ts — KPI calculations
- backend/order-service/src/middleware/authMiddleware.ts — JWT validation
- backend/order-service/src/config/index.ts — Service config/env
- backend/order-service/Dockerfile — Multi-stage build, EXPOSE 8002, COPY ../shared ./shared, CMD: node dist/index.js
- backend/order-service/package.json — Dependencies, scripts
- backend/order-service/tsconfig.json — TypeScript config
- backend/order-service/tests/orders.test.ts — Tests: create order, list/filter, get by id, KPI, error cases

**Dependencies:** Item 1

**Validation:**  
- `npm run build && npm test` passes
- Service responds to all /orders and /kpi endpoints as per SPEC.md
- Healthcheck endpoint returns status

**Role:** role-be (backend_developer)

---

### ITEM 4: Plant Service — plant catalog endpoints

**Goal:**  
Implement the plant catalog microservice with endpoint:
- GET /plants (JWT-protected, returns { plants: Plant[] })
- Healthcheck endpoint
- Plant DB logic
- Structured logging, env validation, error handling

**Files to create:**
- backend/plant-service/src/index.ts — HTTP server bootstrap (port 8003)
- backend/plant-service/src/app.ts — Express app setup, registers routers
- backend/plant-service/src/routes/plants.ts — /plants endpoint
- backend/plant-service/src/controllers/plantController.ts — Plant logic
- backend/plant-service/src/services/plantService.ts — Plant DB logic
- backend/plant-service/src/middleware/authMiddleware.ts — JWT validation
- backend/plant-service/src/config/index.ts — Service config/env
- backend/plant-service/Dockerfile — Multi-stage build, EXPOSE 8003, COPY ../shared ./shared, CMD: node dist/index.js
- backend/plant-service/package.json — Dependencies, scripts
- backend/plant-service/tsconfig.json — TypeScript config
- backend/plant-service/tests/plants.test.ts — Tests: list plants, error cases

**Dependencies:** Item 1

**Validation:**  
- `npm run build && npm test` passes
- Service responds to /plants as per SPEC.md
- Healthcheck endpoint returns status

**Role:** role-be (backend_developer)

---

### ITEM 5: Distribution Center Service — distribution center catalog endpoints

**Goal:**  
Implement the distribution center catalog microservice with endpoint:
- GET /distribution-centers (JWT-protected, returns { distribution_centers: DistributionCenter[] })
- Healthcheck endpoint
- DistributionCenter DB logic
- Structured logging, env validation, error handling

**Files to create:**
- backend/distribution-service/src/index.ts — HTTP server bootstrap (port 8004)
- backend/distribution-service/src/app.ts — Express app setup, registers routers
- backend/distribution-service/src/routes/distributionCenters.ts — /distribution-centers endpoint
- backend/distribution-service/src/controllers/distributionController.ts — DistributionCenter logic
- backend/distribution-service/src/services/distributionService.ts — DistributionCenter DB logic
- backend/distribution-service/src/middleware/authMiddleware.ts — JWT validation
- backend/distribution-service/src/config/index.ts — Service config/env
- backend/distribution-service/Dockerfile — Multi-stage build, EXPOSE 8004, COPY ../shared ./shared, CMD: node dist/index.js
- backend/distribution-service/package.json — Dependencies, scripts
- backend/distribution-service/tsconfig.json — TypeScript config
- backend/distribution-service/tests/distributionCenters.test.ts — Tests: list distribution centers, error cases

**Dependencies:** Item 1

**Validation:**  
- `npm run build && npm test` passes
- Service responds to /distribution-centers as per SPEC.md
- Healthcheck endpoint returns status

**Role:** role-be (backend_developer)

---

### ITEM 6: Order Worker — RabbitMQ consumer, inventory update logic

**Goal:**  
Implement the order-worker microservice:
- Consumes order.created events from RabbitMQ
- Updates inventory (logic in inventoryService.ts)
- Healthcheck endpoint
- Structured logging, env validation, error handling

**Files to create:**
- backend/order-worker/src/index.ts — Worker entry point (port 8005)
- backend/order-worker/src/worker/orderConsumer.ts — RabbitMQ consumer for order.created
- backend/order-worker/src/services/inventoryService.ts — Inventory update logic
- backend/order-worker/src/config/index.ts — Worker config/env
- backend/order-worker/Dockerfile — Multi-stage build, EXPOSE 8005, COPY ../shared ./shared, CMD: node dist/index.js
- backend/order-worker/package.json — Dependencies, scripts
- backend/order-worker/tsconfig.json — TypeScript config
- backend/order-worker/tests/orderConsumer.test.ts — Tests: consume event, update inventory, error cases

**Dependencies:** Item 1

**Validation:**  
- `npm run build && npm test` passes
- Worker consumes events and updates inventory as expected
- Healthcheck endpoint returns status

**Role:** role-be (backend_developer)

---

### ITEM 7: Frontend — React dashboard, forms, charts, state, API integration

**Goal:**  
Implement the complete frontend application:
- Responsive dashboard with:
  - Header (DistroViz, subtitle, dark/light toggle)
  - Filters (plant, order status) — reloads KPIs, charts, table
  - 4 KPI cards (total units, completed orders, avg delivery days, fulfillment rate) with loading indicators
  - Line chart (units by month, last 6 months, tooltip)
  - Bar chart (volume by plant, colored, tooltip)
  - Paginated order table (10 rows, columns: plant, center, quantity, status badge, dispatch date, delivery date, alt row colors)
  - Order creation form (plant selector, center selector, quantity, status, dispatch date, delivery date optional)
  - Local/dynamic validation, error handling, success notifications, form reset
  - API error handling (toast), data preservation on error
  - Responsive design for desktop/tablet
- State management with Redux Toolkit
- API integration with axios
- Healthcheck endpoint (for container)
- Tests for all major components and flows

**Files to create:**
- frontend/src/main.tsx — React entry point
- frontend/src/App.tsx — Root component, layout, routing
- frontend/src/api/auth.ts — Auth API client
- frontend/src/api/orders.ts — Orders API client
- frontend/src/api/plants.ts — Plants API client
- frontend/src/api/distributionCenters.ts — DistributionCenters API client
- frontend/src/components/Header.tsx — Header with theme toggle
- frontend/src/components/Filters.tsx — Plant/status filters
- frontend/src/components/KPICards.tsx — 4 KPI cards
- frontend/src/components/LineChart.tsx — Trend chart
- frontend/src/components/BarChart.tsx — Volume by plant
- frontend/src/components/OrderTable.tsx — Paginated order table
- frontend/src/components/OrderForm.tsx — Order creation form
- frontend/src/components/Notification.tsx — Toast notifications
- frontend/src/store/index.ts — Redux store setup
- frontend/src/store/ordersSlice.ts — Orders state
- frontend/src/store/kpiSlice.ts — KPI state
- frontend/src/store/plantsSlice.ts — Plants state
- frontend/src/store/distributionCentersSlice.ts — DistributionCenters state
- frontend/Dockerfile — Multi-stage build, EXPOSE 80, healthcheck, ARG VITE_API_URL
- frontend/package.json — Dependencies, scripts
- frontend/tsconfig.json — TypeScript config
- frontend/tests/Header.test.tsx — Header tests
- frontend/tests/OrderForm.test.tsx — Form validation, submit, error
- frontend/tests/OrderTable.test.tsx — Table rendering, pagination
- frontend/tests/KPICards.test.tsx — KPI loading, error
- frontend/tests/Charts.test.tsx — Chart rendering, tooltips

**Dependencies:** Item 1

**Validation:**  
- `npm run build && npm test` passes
- App loads, all dashboard features work, forms validate, API errors handled
- Healthcheck endpoint returns status

**Role:** role-fe (frontend_developer)

---

### ITEM 8: Infrastructure & Deployment

**Goal:**  
Provide complete orchestration and documentation for local development and deployment:
- Docker Compose for all services (Postgres, Redis, RabbitMQ, Kong, all backend services, frontend)
- Healthchecks for every service
- depends_on with service_healthy
- .env.example with all variables and descriptions
- .gitignore, .dockerignore for all build artifacts and secrets
- run.sh: validates Docker, builds, starts, waits for healthy, prints access URL
- README.md: setup, run, test, endpoints, troubleshooting
- docs/architecture.md: system diagram, component descriptions

**Files to create:**
- docker-compose.yml
- .env.example
- .gitignore
- .dockerignore
- run.sh
- README.md
- docs/architecture.md

**Dependencies:** All previous items

**Validation:**  
- `./run.sh` completes without errors
- All services report healthy
- Frontend accessible at http://localhost:<frontend-port>
- All API endpoints functional

**Role:** role-devops (devops_support)

---
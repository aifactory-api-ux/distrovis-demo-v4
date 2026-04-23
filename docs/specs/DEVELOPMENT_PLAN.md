# DEVELOPMENT PLAN: Distrovis demo v4

## 1. ARCHITECTURE OVERVIEW

**Components:**
- **Frontend (React 18 + TypeScript 5):** SPA dashboard for KPIs, trends, order table, and order creation form. Responsive, dark/light theme, error handling, and filtering.
- **Backend (Node.js 20 + Express.js 4.18):** Single service (`pedido-service`) exposing REST endpoints for Catalogo, Pedido, Usuario, Notificacion. Uses PostgreSQL 15 (orders, catalog, users, notifications), Redis 7 (cache), RabbitMQ 3.12 (event: pedido_creado).
- **API Gateway (Kong 3.4):** Routes frontend and API requests to backend service.
- **Infrastructure:** Docker Compose for local orchestration, Kubernetes manifests (Terraform for AWS EKS, RDS, ElastiCache), GitHub Actions for CI/CD.

**Models:**
- **Catalogo, Pedido, PedidoItem, Usuario, Notificacion** (see SPEC.md §2 for exact fields).
- **DB Schema:** Tables for catalogo, pedido, pedido_item, usuario, notificacion (see SPEC.md §2).

**APIs:** (see SPEC.md §3)
- `/catalogo` (CRUD), `/pedidos` (CRUD), `/usuarios` (CRUD), `/notificaciones` (CRUD)

**Folder Structure:** (see SPEC.md §4)
- `frontend/` (SPA)
- `backend/pedido-service/` (Express service)
- `backend/shared/` (models, db, cache)
- `kong/` (gateway config)
- `terraform/` (infra as code)
- Root: `docker-compose.yml`, `.env.example`, `run.sh`, `README.md`, `.gitignore`

## 2. ACCEPTANCE CRITERIA

1. The dashboard displays 4 KPI cards, trend and volume charts, a paginated/filterable order table, and a creation form, all updating dynamically and responsively.
2. The backend exposes all endpoints as per SPEC.md, with correct data contracts, validation, error handling, and health checks; events are published to RabbitMQ on order creation.
3. The system runs locally with `./run.sh`, all services healthy, frontend accessible at `http://localhost:<frontend-port>`, and all API endpoints functional via Kong gateway.

---

## TEAM SCOPE (MANDATORY — PARSED BY THE PIPELINE)

- **Role:** role-tl (technical_lead)
- **Role:** role-be (backend_developer)
- **Role:** role-fe (frontend_developer)
- **Role:** role-devops (devops_support)

---

## 3. EXECUTABLE ITEMS

---

### ITEM 1: Foundation — shared types, interfaces, DB schemas, config

**Goal:**  
Create all shared code and configuration required by backend and frontend. This includes TypeScript interfaces for all data contracts, shared DB connection logic, Redis cache logic, and the complete SQL schema for PostgreSQL. All other items will import from these files.

**Files to create:**
- backend/shared/models.ts (create) — All TypeScript interfaces: Catalogo, Pedido, PedidoItem, Usuario, Notificacion (as per SPEC.md §2)
- backend/shared/db.ts (create) — Shared PostgreSQL connection logic (pooling, env validation)
- backend/shared/cache.ts (create) — Shared Redis cache logic (connection, get/set helpers)
- backend/pedido-service/src/config/db.ts (create) — Service-specific DB config (imports shared/db.ts)
- backend/pedido-service/src/config/redis.ts (create) — Service-specific Redis config (imports shared/cache.ts)
- backend/pedido-service/src/config/rabbitmq.ts (create) — RabbitMQ connection/config
- backend/pedido-service/src/config/env.ts (create) — Environment variable validation for all required vars
- backend/pedido-service/src/utils/validator.ts (create) — Input validation helpers (Joi/Zod schemas for all endpoints)
- backend/shared/db/schema.sql (create) — Complete PostgreSQL schema for all tables (catalogo, pedido, pedido_item, usuario, notificacion) with indexes and constraints as per SPEC.md §2

**Dependencies:** None

**Validation:**  
- All TypeScript files compile with `tsc --noEmit`.
- `schema.sql` can be applied to a fresh PostgreSQL 15 instance without errors.
- Running `node -r ts-node/register backend/shared/db.ts` connects to DB using env vars.

**Role:** role-tl (technical_lead)

---

### ITEM 2: Backend — Pedido Service (Express API: Catalogo, Pedido, Usuario, Notificacion, Events)

**Goal:**  
Implement the full Express.js backend service (`pedido-service`) exposing all endpoints as per SPEC.md §3 for Catalogo, Pedido, Usuario, Notificacion. Includes controllers, services, routes, error handling, event publishing to RabbitMQ, and health check endpoint.

**Files to create:**
- backend/pedido-service/src/app.ts (create) — Express app setup, registers all routers, error handler, health check
- backend/pedido-service/src/index.ts (create) — HTTP server bootstrap (reads PORT from env, starts app)
- backend/pedido-service/src/routes/catalogo.ts (create) — Catalogo endpoints (GET/POST/PUT/DELETE)
- backend/pedido-service/src/routes/pedido.ts (create) — Pedido endpoints (GET/POST/PUT/DELETE)
- backend/pedido-service/src/routes/usuario.ts (create) — Usuario endpoints (GET/POST/PUT/DELETE)
- backend/pedido-service/src/routes/notificacion.ts (create) — Notificacion endpoints (GET/POST/DELETE)
- backend/pedido-service/src/controllers/catalogoController.ts (create) — Catalogo logic
- backend/pedido-service/src/controllers/pedidoController.ts (create) — Pedido logic (publishes pedido_creado event)
- backend/pedido-service/src/controllers/usuarioController.ts (create) — Usuario logic
- backend/pedido-service/src/controllers/notificacionController.ts (create) — Notificacion logic
- backend/pedido-service/src/services/catalogoService.ts (create) — Catalogo DB/cache logic
- backend/pedido-service/src/services/pedidoService.ts (create) — Pedido DB/cache/event logic
- backend/pedido-service/src/services/usuarioService.ts (create) — Usuario DB/cache logic
- backend/pedido-service/src/services/notificacionService.ts (create) — Notificacion DB/cache logic
- backend/pedido-service/src/events/pedidoEvents.ts (create) — RabbitMQ publisher for pedido_creado
- backend/pedido-service/src/middleware/errorHandler.ts (create) — Centralized error handler (structured logging)
- backend/pedido-service/Dockerfile (create) — Multi-stage build, non-root, EXPOSE 8001, CMD: `node dist/index.js`
- backend/pedido-service/package.json (create) — All dependencies, scripts (build, start, dev)
- backend/pedido-service/tsconfig.json (create) — TypeScript config (strict mode, outDir: dist)

**Dependencies:** Item 1

**Validation:**  
- `docker build .` in `backend/pedido-service` succeeds.
- `docker run` exposes all endpoints on port 8001.
- `GET /health` returns `{status: "ok", service: "pedido-service", version: "<version>"}`.
- All endpoints respond as per SPEC.md, with correct validation and error handling.
- On POST /pedidos, a `pedido_creado` event is published to RabbitMQ.

**Role:** role-be (backend_developer)

---

### ITEM 3: Frontend — SPA Dashboard (React 18, TypeScript 5)

**Goal:**  
Implement the full SPA dashboard in React 18 + TypeScript 5. Includes: KPI cards, trend and volume charts, paginated/filterable order table, order creation form with validation, dark/light theme toggle, responsive layouts, error handling (API down, empty data), and project header.

**Files to create:**
- frontend/src/main.tsx (create) — React entry point (mounts App)
- frontend/src/App.tsx (create) — Root component, layout, theme provider, error boundary
- frontend/src/api/catalogoApi.ts (create) — API client for Catalogo endpoints
- frontend/src/api/pedidoApi.ts (create) — API client for Pedido endpoints
- frontend/src/api/usuarioApi.ts (create) — API client for Usuario endpoints
- frontend/src/api/notificacionApi.ts (create) — API client for Notificacion endpoints
- frontend/src/hooks/useCatalogo.ts (create) — Data fetching, caching, error state for Catalogo
- frontend/src/hooks/usePedidos.ts (create) — Data fetching, filtering, error state for Pedidos
- frontend/src/hooks/useUsuarios.ts (create) — Data fetching, error state for Usuarios
- frontend/src/hooks/useNotificaciones.ts (create) — Data fetching, error state for Notificaciones
- frontend/src/components/CatalogoList.tsx (create) — Catalogo list UI
- frontend/src/components/CatalogoForm.tsx (create) — Catalogo creation/edit form
- frontend/src/components/PedidoList.tsx (create) — Pedido table with pagination, filters, detail view
- frontend/src/components/PedidoForm.tsx (create) — Pedido creation form with validation, error handling
- frontend/src/components/UsuarioList.tsx (create) — Usuario list UI
- frontend/src/components/UsuarioForm.tsx (create) — Usuario creation/edit form
- frontend/src/components/NotificacionList.tsx (create) — Notificacion list UI
- frontend/src/components/NotificacionForm.tsx (create) — Notificacion creation form
- frontend/src/components/KPICards.tsx (create) — 4 KPI cards (total units, completed orders, avg delivery days, fulfillment rate)
- frontend/src/components/TrendChart.tsx (create) — Line chart for units/month (last 6 months)
- frontend/src/components/VolumeByPlantChart.tsx (create) — Bar chart for volume by plant
- frontend/src/components/Header.tsx (create) — Project name, subtitle, theme toggle
- frontend/src/components/ErrorBanner.tsx (create) — API down banner with retry
- frontend/src/types/models.ts (create) — All frontend TypeScript interfaces (mirrors backend/shared/models.ts)
- frontend/src/utils/format.ts (create) — Formatting helpers (dates, numbers)
- frontend/public/index.html (create) — HTML entry point
- frontend/Dockerfile (create) — Multi-stage build, non-root, EXPOSE 5173, CMD: `npm run preview` or `serve dist`
- frontend/package.json (create) — All dependencies, scripts (build, start, dev)
- frontend/tsconfig.json (create) — TypeScript config (strict mode, outDir: dist)

**Dependencies:** Item 1

**Validation:**  
- `docker build .` in `frontend` succeeds.
- `docker run` exposes the SPA at port 5173 (or as configured).
- All UI elements render and update as per acceptance criteria.
- API requests go through Kong gateway and display correct data/errors.

**Role:** role-fe (frontend_developer)

---

### ITEM 4: API Gateway — Kong Configuration

**Goal:**  
Configure Kong API Gateway to route all frontend and API requests to the correct backend service(s), with declarative YAML config and Dockerfile for Kong container.

**Files to create:**
- kong/kong.yml (create) — Declarative config for all routes/services (as per SPEC.md §4)
- kong/Dockerfile (create) — Kong container build (copies kong.yml, sets up plugins as needed)

**Dependencies:** Item 2, Item 3

**Validation:**  
- `docker build .` in `kong` succeeds.
- Kong routes `/api/*` to backend/pedido-service, `/` to frontend.
- Healthcheck endpoint for Kong responds with 200.

**Role:** role-devops (devops_support)

---

### ITEM 5: Infrastructure & Deployment

**Goal:**  
Provide complete local orchestration and documentation for the project. Includes Docker Compose for all services (with healthchecks and depends_on), environment variable template, run script, ignore files, and architecture docs.

**Files to create:**
- docker-compose.yml (create) — All services (frontend, backend/pedido-service, postgres, redis, rabbitmq, kong) with healthchecks and correct port mappings
- .env.example (create) — All required environment variables with descriptions and example values
- .gitignore (create) — Exclude node_modules, dist, .env, .DS_Store, logs, etc.
- .dockerignore (create) — Exclude node_modules, .git, dist, logs, etc.
- run.sh (create) — Checks Docker, builds images, starts all services, waits for healthy, prints access URL
- README.md (create) — Prerequisites, setup, run instructions, endpoints, troubleshooting
- docs/architecture.md (create) — System diagram, component descriptions, deployment notes
- terraform/main.tf (create) — Terraform config for AWS EKS, RDS, ElastiCache, etc.
- terraform/variables.tf (create) — Terraform variables
- terraform/outputs.tf (create) — Terraform outputs
- terraform/provider.tf (create) — AWS provider config

**Dependencies:** Items 1–4

**Validation:**  
- `./run.sh` completes without errors.
- All containers are healthy (`docker ps` shows healthy status).
- Frontend accessible at `http://localhost:<frontend-port>`.
- All API endpoints functional via Kong gateway.
- README instructions allow a new developer to run the project end-to-end.

**Role:** role-devops (devops_support)

---
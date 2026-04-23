# DEVELOPMENT PLAN: Distrovis demo v4

## 1. ARCHITECTURE OVERVIEW

**Components:**
- **Frontend:** React 18 + TypeScript (Vite), implements dashboard, KPIs, order table, creation form, responsive layout.
- **Backend:** FastAPI (Python 3.11), exposes REST API for KPIs, orders, plants, centers, users; uses SQLite (local, per constraints).
- **Database:** SQLite (local, file-based, per constraints).
- **Cache:** Redis 7 (for KPI caching).
- **Infrastructure:** Docker Compose for local orchestration, healthchecks, .env, run.sh, Kubernetes manifests for future deployment.
- **Shared:** TypeScript interfaces (frontend), Pydantic/SQLAlchemy models (backend), shared config/utilities.

**APIs (from SPEC.md):**
- `GET /api/kpis` → KPIResponse
- `GET /api/ordenes` → List[Orden]
- `POST /api/ordenes` → Orden
- `GET /api/plantas` → List[Planta]
- `GET /api/centros` → List[Centro]
- `GET /api/usuarios` → List[Usuario]

**Folder Structure:**
```
project-root/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── types/
│   │   └── main.tsx, App.tsx, index.html
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── backend/
│   ├── api-service/
│   │   ├── src/
│   │   │   ├── main.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── crud.py
│   │   │   ├── db.py
│   │   │   ├── cache.py
│   │   │   ├── dependencies.py
│   │   │   ├── config.py
│   │   │   └── api/
│   │   │       ├── __init__.py
│   │   │       └── endpoints.py
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── shared/
│       ├── __init__.py
│       ├── auth.py
│       └── utils.py
├── shared/
│   ├── types.ts
│   ├── config.ts
│   ├── utils.ts
│   ├── models.py
│   └── config.py
├── docs/
│   └── architecture.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── run.sh
└── README.md
```

## 2. ACCEPTANCE CRITERIA

1. **Dashboard displays KPIs, line/bar charts, and order table with real data, supporting filtering by plant and order status.**
2. **Order creation form allows valid orders to be created, with validation and error handling, and updates dashboard on success.**
3. **Database initializes with seed data (plants, centers, users, orders) if empty on first run.**
4. **All endpoints respond per SPEC.md, with correct status codes, schemas, and error handling.**
5. **Frontend is fully responsive per requirements, with correct layouts for desktop, tablet, and mobile.**
6. **All services start via `./run.sh`, pass healthchecks, and are accessible at documented URLs.**
7. **Tests cover at least one happy-path and one error-path per endpoint/component.**

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
Create all shared code and contracts for the project, including:
- TypeScript interfaces for frontend (Planta, Centro, Usuario, Orden, KPIResponse)
- Shared config and utility functions for frontend (env, helpers)
- Pydantic and SQLAlchemy models for backend (Planta, Centro, Usuario, Orden, KPIResponse)
- Shared config and utility functions for backend (env, helpers)
- Complete DB schema for SQLite (DDL with indexes)

**Files to create:**
- shared/types.ts (create) — All TypeScript interfaces and enums for Planta, Centro, Usuario, Orden, KPIResponse
- shared/config.ts (create) — Frontend shared config (API URL, env validation)
- shared/utils.ts (create) — Frontend shared utility functions (date formatting, etc.)
- shared/models.py (create) — All Pydantic and SQLAlchemy models for Planta, Centro, Usuario, Orden, KPIResponse, enums for order status
- shared/config.py (create) — Backend shared config (env validation, constants)
- backend/api-service/src/db/schema.sql (create) — Complete SQLite schema with indexes for all tables

**Tests required:**
- backend/api-service/tests/test_models.py: test model creation, validation, and relationships
- frontend/tests/types.test.ts: test TypeScript type guards and utility functions

**Dependencies:** None

**Validation:**  
- Run `pytest backend/api-service/tests/test_models.py` — all tests pass  
- Run `npm test` in frontend — all type and utility tests pass

**Role:** role-tl (technical_lead)

---

### ITEM 2: Backend — FastAPI API service (endpoints, business logic, seed data, caching)

**Goal:**  
Implement the FastAPI backend service with all endpoints and business logic:
- Expose all endpoints per SPEC.md (`/api/kpis`, `/api/ordenes` GET/POST, `/api/plantas`, `/api/centros`, `/api/usuarios`)
- Implement business logic for KPIs, filtering, and order creation (with validation)
- Seed database with initial data if empty on startup
- Use Redis for KPI caching
- Structured logging, error handling, healthcheck endpoint
- Use models/config from shared/
- Tests for all endpoints (happy/error paths)

**Files to create:**
- backend/api-service/src/main.py (create) — FastAPI app entry point, includes startup event for seed data, healthcheck
- backend/api-service/src/models.py (create) — SQLAlchemy models (import from shared/models.py)
- backend/api-service/src/schemas.py (create) — Pydantic schemas (import from shared/models.py)
- backend/api-service/src/crud.py (create) — CRUD operations for all entities
- backend/api-service/src/api/endpoints.py (create) — All API route definitions
- backend/api-service/src/db.py (create) — DB session/engine setup, uses schema.sql
- backend/api-service/src/cache.py (create) — Redis cache logic for KPIs
- backend/api-service/src/dependencies.py (create) — Dependency injection for DB, cache
- backend/api-service/src/config.py (create) — Env var validation, settings (import from shared/config.py)
- backend/api-service/Dockerfile (create) — Multi-stage build, EXPOSE 8001, CMD: uvicorn src.main:app --host 0.0.0.0 --port 8001
- backend/api-service/requirements.txt (create) — All Python dependencies (fastapi, sqlalchemy, aioredis, pydantic, etc.)
- backend/api-service/tests/test_api.py (create) — Pytest: test all endpoints (happy/error paths), seed data, caching

**Dependencies:** Item 1

**Validation:**  
- Run `pytest backend/api-service/tests/test_api.py` — all tests pass  
- Build and run Docker image, hit `/api/kpis` and `/api/ordenes` — correct data returned

**Role:** role-be (backend_developer)

---

### ITEM 3: Frontend — React app (dashboard, forms, hooks, API clients, responsive UI)

**Goal:**  
Implement the React frontend with all required features:
- Dashboard page: KPIs in cards, line/bar charts (trend/volume), order table with filters and pagination
- Order creation form with validation, error handling, and notifications
- Responsive layout per requirements (desktop/tablet/mobile)
- API clients for all endpoints, React hooks for data fetching
- Use TypeScript interfaces from shared/
- Tests for components, hooks, and forms

**Files to create:**
- frontend/src/main.tsx (create) — React entry point
- frontend/src/App.tsx (create) — Root component, routing/layout
- frontend/src/api/kpiApi.ts (create) — API client for KPIs
- frontend/src/api/ordenApi.ts (create) — API client for ordenes
- frontend/src/api/plantaApi.ts (create) — API client for plantas
- frontend/src/api/centroApi.ts (create) — API client for centros
- frontend/src/api/usuarioApi.ts (create) — API client for usuarios
- frontend/src/hooks/useKpis.ts (create) — React hook for KPIs
- frontend/src/hooks/useOrdenes.ts (create) — React hook for ordenes
- frontend/src/hooks/usePlantas.ts (create) — React hook for plantas
- frontend/src/hooks/useCentros.ts (create) — React hook for centros
- frontend/src/hooks/useUsuarios.ts (create) — React hook for usuarios
- frontend/src/components/Dashboard.tsx (create) — Dashboard visualization (KPIs, charts, filters)
- frontend/src/components/OrdenList.tsx (create) — Order table with pagination/filters
- frontend/src/components/OrdenForm.tsx (create) — Order creation form with validation
- frontend/src/components/PlantaList.tsx (create) — List of plantas (for selectors)
- frontend/src/components/CentroList.tsx (create) — List of centros (for selectors)
- frontend/src/components/UsuarioList.tsx (create) — List of usuarios (for selectors)
- frontend/src/types/models.ts (create) — TypeScript interfaces (import from shared/types.ts)
- frontend/src/index.html (create) — HTML entry point
- frontend/Dockerfile (create) — Multi-stage build, EXPOSE 3000, production-ready
- frontend/vite.config.ts (create) — Vite config (API proxy, env)
- frontend/tsconfig.json (create) — TypeScript config (strict mode)
- frontend/package.json (create) — NPM dependencies, scripts
- frontend/tests/Dashboard.test.tsx (create) — Test dashboard rendering, filtering, loading
- frontend/tests/OrdenForm.test.tsx (create) — Test form validation, submission, error handling
- frontend/tests/OrdenList.test.tsx (create) — Test table rendering, pagination, filtering

**Dependencies:** Item 1

**Validation:**  
- Run `npm test` — all tests pass  
- Build and run Docker image, access dashboard at `localhost:3000`, verify all features

**Role:** role-fe (frontend_developer)

---

### ITEM 4: Infrastructure & Deployment

**Goal:**  
Provide complete orchestration and documentation for local development:
- Docker Compose for all services (backend, frontend, redis)
- Healthchecks and startup order (DB/Redis → backend → frontend)
- .env.example with all required variables and descriptions
- .gitignore, .dockerignore for clean repo/builds
- run.sh script: checks Docker, builds, starts, waits for healthy, prints access URL
- README.md: setup, run, test, endpoints, troubleshooting
- docs/architecture.md: system/component diagram, flow, and description

**Files to create:**
- docker-compose.yml (create) — All services, healthchecks, depends_on, correct ports
- .env.example (create) — All variables with descriptions and example values
- .gitignore (create) — Exclude node_modules, dist, .env, __pycache__, *.pyc, etc.
- .dockerignore (create) — Exclude node_modules, .git, *.log, dist
- run.sh (create) — Validates Docker, builds, starts, waits healthy, prints URL
- README.md (create) — Prerequisites, clone, run, test, endpoints, troubleshooting
- docs/architecture.md (create) — System diagram and component descriptions

**Dependencies:** Items 1, 2, 3

**Validation:**  
- Run `./run.sh` — all services start, healthchecks pass, dashboard accessible at `localhost:3000`, API at `localhost:8001`
- All endpoints respond, frontend works, seed data present

**Role:** role-devops (devops_support)

---
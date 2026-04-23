# SPEC.md

## 1. TECHNOLOGY STACK

- **Frontend**
  - React 18.2.0
  - TypeScript 5.2.2
  - Vite 4.4.9

- **Backend**
  - Python 3.11
  - FastAPI 0.103.0
  - Uvicorn 0.23.2
  - SQLAlchemy 2.0.19
  - aioredis 2.0.1

- **Database**
  - PostgreSQL 15

- **Cache**
  - Redis 7

- **API Gateway**
  - Kong 3.4

- **Authentication**
  - Keycloak 22.0.1

- **Containerization & Orchestration**
  - Docker 24.0.5
  - docker-compose 2.21.0
  - Kubernetes 1.27

- **Other**
  - Node.js 20.10.0

---

## 2. DATA CONTRACTS

### Python (FastAPI) — Pydantic Models

```python
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List

class Planta(BaseModel):
    id: int
    nombre: str
    ubicacion: str

class Centro(BaseModel):
    id: int
    nombre: str
    ubicacion: str

class Usuario(BaseModel):
    id: int
    nombre: str
    email: EmailStr

class Orden(BaseModel):
    id: int
    planta_id: int
    centro_id: int
    usuario_id: int
    estado: str
    unidades: int
    fecha_creacion: date
    fecha_entrega: date

class KPIResponse(BaseModel):
    total_ordenes: int
    total_unidades: int
    ordenes_pendientes: int
    ordenes_entregadas: int
    despachos_por_planta: List[dict]  # [{'planta_id': int, 'total_despachos': int}]
    despachos_por_centro: List[dict]  # [{'centro_id': int, 'total_despachos': int}]
```

### TypeScript (Frontend) — Interface Definitions

```typescript
export interface Planta {
  id: number;
  nombre: string;
  ubicacion: string;
}

export interface Centro {
  id: number;
  nombre: string;
  ubicacion: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface Orden {
  id: number;
  planta_id: number;
  centro_id: number;
  usuario_id: number;
  estado: string;
  unidades: number;
  fecha_creacion: string; // ISO date
  fecha_entrega: string;  // ISO date
}

export interface KPIResponse {
  total_ordenes: number;
  total_unidades: number;
  ordenes_pendientes: number;
  ordenes_entregadas: number;
  despachos_por_planta: { planta_id: number; total_despachos: number }[];
  despachos_por_centro: { centro_id: number; total_despachos: number }[];
}
```

---

## 3. API ENDPOINTS

### 1. Get KPIs for Dashboard

- **Method:** GET
- **Path:** `/api/kpis`
- **Request Body:** _None_
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `KPIResponse` (see above)

### 2. List Ordenes

- **Method:** GET
- **Path:** `/api/ordenes`
- **Request Body:** _None_
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `List[Orden]`

### 3. Create Orden

- **Method:** POST
- **Path:** `/api/ordenes`
- **Request Body:**
  ```json
  {
    "planta_id": 1,
    "centro_id": 2,
    "usuario_id": 3,
    "estado": "pendiente",
    "unidades": 100,
    "fecha_creacion": "2024-06-01",
    "fecha_entrega": "2024-06-05"
  }
  ```
  - **Schema:** All fields except `id` (auto-generated)
- **Response:**
  - **Status:** 201 Created
  - **Schema:** `Orden`

### 4. List Plantas

- **Method:** GET
- **Path:** `/api/plantas`
- **Request Body:** _None_
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `List[Planta]`

### 5. List Centros

- **Method:** GET
- **Path:** `/api/centros`
- **Request Body:** _None_
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `List[Centro]`

### 6. List Usuarios

- **Method:** GET
- **Path:** `/api/usuarios`
- **Request Body:** _None_
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `List[Usuario]`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service         | Listening Port | Path                      |
|-----------------|---------------|---------------------------|
| api-service     | 8001          | backend/api-service/      |

### FILE TREE

```
.
├── docker-compose.yml                # Orchestrates all services (backend, frontend, db, redis, kong, keycloak)
├── .env.example                     # Template for environment variables
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root-level startup script
├── backend/
│   ├── api-service/
│   │   ├── Dockerfile               # Dockerfile for FastAPI service (EXPOSE 8001)
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── models.py                # SQLAlchemy models
│   │   ├── schemas.py               # Pydantic schemas
│   │   ├── crud.py                  # CRUD operations
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints.py         # API route definitions
│   │   ├── db.py                    # Database session and engine
│   │   ├── cache.py                 # Redis cache logic
│   │   ├── dependencies.py          # Dependency injection (auth, db, cache)
│   │   ├── config.py                # Settings from environment variables
│   │   └── requirements.txt         # Python dependencies
│   └── shared/
│       ├── __init__.py
│       ├── auth.py                  # Keycloak/JWT utilities
│       └── utils.py                 # Shared utility functions
├── frontend/
│   ├── Dockerfile                   # Dockerfile for React app
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json                 # NPM dependencies
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Root component
│   │   ├── api/
│   │   │   ├── kpiApi.ts            # API client for KPIs
│   │   │   ├── ordenApi.ts          # API client for ordenes
│   │   │   ├── plantaApi.ts         # API client for plantas
│   │   │   ├── centroApi.ts         # API client for centros
│   │   │   ├── usuarioApi.ts        # API client for usuarios
│   │   ├── hooks/
│   │   │   ├── useKpis.ts           # React hook for KPIs
│   │   │   ├── useOrdenes.ts        # React hook for ordenes
│   │   │   ├── usePlantas.ts        # React hook for plantas
│   │   │   ├── useCentros.ts        # React hook for centros
│   │   │   ├── useUsuarios.ts       # React hook for usuarios
│   │   ├── components/
│   │   │   ├── Dashboard.tsx        # Dashboard visualization
│   │   │   ├── OrdenList.tsx        # List of ordenes
│   │   │   ├── OrdenForm.tsx        # Form to create orden
│   │   │   ├── PlantaList.tsx       # List of plantas
│   │   │   ├── CentroList.tsx       # List of centros
│   │   │   ├── UsuarioList.tsx      # List of usuarios
│   │   ├── types/
│   │   │   ├── models.ts            # TypeScript interfaces (Planta, Centro, Orden, Usuario, KPIResponse)
│   │   └── index.html               # HTML entry point
├── kong/
│   ├── kong.yml                     # Kong declarative config
│   └── Dockerfile                   # Kong Dockerfile
├── keycloak/
│   ├── Dockerfile                   # Keycloak Dockerfile
│   └── realm-export.json            # Keycloak realm config
├── k8s/
│   ├── api-service-deployment.yaml  # Kubernetes deployment for backend
│   ├── frontend-deployment.yaml     # Kubernetes deployment for frontend
│   ├── postgres-deployment.yaml     # Kubernetes deployment for PostgreSQL
│   ├── redis-deployment.yaml        # Kubernetes deployment for Redis
│   ├── kong-deployment.yaml         # Kubernetes deployment for Kong
│   ├── keycloak-deployment.yaml     # Kubernetes deployment for Keycloak
│   └── namespace.yaml               # Kubernetes namespace definition
```

---

## 5. ENVIRONMENT VARIABLES

| Name                    | Type   | Description                                         | Example Value                |
|-------------------------|--------|-----------------------------------------------------|-----------------------------|
| POSTGRES_HOST           | string | PostgreSQL host                                     | postgres                    |
| POSTGRES_PORT           | int    | PostgreSQL port                                     | 5432                        |
| POSTGRES_DB             | string | PostgreSQL database name                            | distroviz                   |
| POSTGRES_USER           | string | PostgreSQL username                                 | distroviz                   |
| POSTGRES_PASSWORD       | string | PostgreSQL password                                 | secretpassword              |
| REDIS_HOST              | string | Redis host                                          | redis                       |
| REDIS_PORT              | int    | Redis port                                          | 6379                        |
| REDIS_DB                | int    | Redis database index                                | 0                           |
| REDIS_PASSWORD          | string | Redis password (optional)                           |                             |
| KEYCLOAK_URL            | string | Keycloak server URL                                 | http://keycloak:8080        |
| KEYCLOAK_REALM          | string | Keycloak realm name                                 | distroviz                   |
| KEYCLOAK_CLIENT_ID      | string | Keycloak client ID                                  | distroviz-frontend          |
| KEYCLOAK_CLIENT_SECRET  | string | Keycloak client secret                              | <client-secret>             |
| API_PORT                | int    | Port for FastAPI backend                            | 8001                        |
| FRONTEND_PORT           | int    | Port for React frontend                             | 3000                        |
| KONG_ADMIN_URL          | string | Kong admin API URL                                  | http://kong:8001            |
| KONG_PROXY_URL          | string | Kong proxy URL                                      | http://kong:8000            |
| JWT_PUBLIC_KEY          | string | JWT public key for backend validation               | -----BEGIN PUBLIC KEY-----  |
| NODE_ENV                | string | Node.js environment                                 | development                 |

---

## 6. IMPORT CONTRACTS

### Backend (Python/FastAPI)

- `from schemas import Planta, Centro, Usuario, Orden, KPIResponse`
- `from crud import get_ordenes, create_orden, get_plantas, get_centros, get_usuarios, get_kpis`
- `from db import get_db_session`
- `from cache import get_cache, set_cache`
- `from shared.auth import verify_jwt, get_current_user`
- `from config import settings`

### Frontend (React/TypeScript)

- `import { Planta, Centro, Usuario, Orden, KPIResponse } from '../types/models'`
- `import { useKpis } from '../hooks/useKpis'`
- `import { useOrdenes } from '../hooks/useOrdenes'`
- `import { usePlantas } from '../hooks/usePlantas'`
- `import { useCentros } from '../hooks/useCentros'`
- `import { useUsuarios } from '../hooks/useUsuarios'`
- `import { getKpis } from '../api/kpiApi'`
- `import { getOrdenes, createOrden } from '../api/ordenApi'`
- `import { getPlantas } from '../api/plantaApi'`
- `import { getCentros } from '../api/centroApi'`
- `import { getUsuarios } from '../api/usuarioApi'`

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### React Hooks

- `useKpis() → { kpis: KPIResponse | null, loading: boolean, error: string | null, refresh: () => void }`
- `useOrdenes() → { ordenes: Orden[], loading: boolean, error: string | null, createOrden: (data: Omit<Orden, 'id'>) => Promise<void> }`
- `usePlantas() → { plantas: Planta[], loading: boolean, error: string | null }`
- `useCentros() → { centros: Centro[], loading: boolean, error: string | null }`
- `useUsuarios() → { usuarios: Usuario[], loading: boolean, error: string | null }`

### Reusable Components

- `Dashboard` props: `{ kpis: KPIResponse | null, loading: boolean }`
- `OrdenList` props: `{ ordenes: Orden[], loading: boolean }`
- `OrdenForm` props: `{ onSubmit: (data: Omit<Orden, 'id'>) => void, loading: boolean }`
- `PlantaList` props: `{ plantas: Planta[], loading: boolean }`
- `CentroList` props: `{ centros: Centro[], loading: boolean }`
- `UsuarioList` props: `{ usuarios: Usuario[], loading: boolean }`

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `frontend/src/index.html`)

---

**All field names, types, and API contracts must be used verbatim as specified above. All service ports, Dockerfile EXPOSE, and CMD must match the PORT TABLE. All shared modules in `backend/shared/` must be copied into every backend service image. All React hooks and component props must use the exact names and signatures as listed.**
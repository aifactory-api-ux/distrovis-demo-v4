# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Node.js 20
  - Express.js 4.18
  - TypeScript 5
  - PostgreSQL 15 (AWS RDS PostgreSQL)
  - Redis 7 (AWS ElastiCache Redis)
  - RabbitMQ 3.12
- **Frontend**
  - React 18
  - TypeScript 5
- **Infrastructure**
  - Docker 24
  - Kubernetes 1.28 (AWS EKS)
  - Kong API Gateway 3.4
  - Terraform 1.6
  - GitHub Actions

---

## 2. DATA CONTRACTS

### TypeScript Interfaces (Backend & Frontend)

```typescript
// Catalogo
export interface Catalogo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

// Pedido
export interface Pedido {
  id: number;
  usuario_id: number;
  fecha: string; // ISO date string (YYYY-MM-DD)
  estado: string;
  total: number;
  items: PedidoItem[];
}

// PedidoItem (relation between Pedido and Catalogo)
export interface PedidoItem {
  catalogo_id: number;
  cantidad: number;
  precio_unitario: number;
}

// Usuario
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

// Notificacion
export interface Notificacion {
  id: number;
  pedido_id: number;
  tipo: string;
  mensaje: string;
  fecha_envio: string; // ISO datetime string
}
```

### PostgreSQL Table Schemas

- **catalogo**
  - id: SERIAL PRIMARY KEY
  - nombre: VARCHAR(255) NOT NULL
  - descripcion: TEXT NOT NULL
  - precio: NUMERIC(12,2) NOT NULL
  - stock: INTEGER NOT NULL

- **pedido**
  - id: SERIAL PRIMARY KEY
  - usuario_id: INTEGER NOT NULL REFERENCES usuario(id)
  - fecha: DATE NOT NULL
  - estado: VARCHAR(50) NOT NULL
  - total: NUMERIC(12,2) NOT NULL

- **pedido_item**
  - pedido_id: INTEGER NOT NULL REFERENCES pedido(id)
  - catalogo_id: INTEGER NOT NULL REFERENCES catalogo(id)
  - cantidad: INTEGER NOT NULL
  - precio_unitario: NUMERIC(12,2) NOT NULL
  - PRIMARY KEY (pedido_id, catalogo_id)

- **usuario**
  - id: SERIAL PRIMARY KEY
  - nombre: VARCHAR(255) NOT NULL
  - email: VARCHAR(255) NOT NULL UNIQUE
  - rol: VARCHAR(50) NOT NULL

- **notificacion**
  - id: SERIAL PRIMARY KEY
  - pedido_id: INTEGER NOT NULL REFERENCES pedido(id)
  - tipo: VARCHAR(50) NOT NULL
  - mensaje: TEXT NOT NULL
  - fecha_envio: TIMESTAMP NOT NULL

---

## 3. API ENDPOINTS

### Catalogo

- **GET /catalogo**
  - Response: `Catalogo[]`

- **GET /catalogo/:id**
  - Response: `Catalogo`

- **POST /catalogo**
  - Request body:
    ```json
    {
      "nombre": "string",
      "descripcion": "string",
      "precio": number,
      "stock": number
    }
    ```
  - Response: `Catalogo`

- **PUT /catalogo/:id**
  - Request body:
    ```json
    {
      "nombre": "string",
      "descripcion": "string",
      "precio": number,
      "stock": number
    }
    ```
  - Response: `Catalogo`

- **DELETE /catalogo/:id**
  - Response: `{ "success": boolean }`

### Pedido

- **GET /pedidos**
  - Response: `Pedido[]`

- **GET /pedidos/:id**
  - Response: `Pedido`

- **POST /pedidos**
  - Request body:
    ```json
    {
      "usuario_id": number,
      "fecha": "YYYY-MM-DD",
      "estado": "string",
      "total": number,
      "items": [
        {
          "catalogo_id": number,
          "cantidad": number,
          "precio_unitario": number
        }
      ]
    }
    ```
  - Response: `Pedido`

- **PUT /pedidos/:id**
  - Request body:
    ```json
    {
      "estado": "string"
    }
    ```
  - Response: `Pedido`

- **DELETE /pedidos/:id**
  - Response: `{ "success": boolean }`

### Usuario

- **GET /usuarios**
  - Response: `Usuario[]`

- **GET /usuarios/:id**
  - Response: `Usuario`

- **POST /usuarios**
  - Request body:
    ```json
    {
      "nombre": "string",
      "email": "string",
      "rol": "string"
    }
    ```
  - Response: `Usuario`

- **PUT /usuarios/:id**
  - Request body:
    ```json
    {
      "nombre": "string",
      "email": "string",
      "rol": "string"
    }
    ```
  - Response: `Usuario`

- **DELETE /usuarios/:id**
  - Response: `{ "success": boolean }`

### Notificacion

- **GET /notificaciones**
  - Response: `Notificacion[]`

- **GET /notificaciones/:id**
  - Response: `Notificacion`

- **POST /notificaciones**
  - Request body:
    ```json
    {
      "pedido_id": number,
      "tipo": "string",
      "mensaje": "string",
      "fecha_envio": "YYYY-MM-DDTHH:MM:SSZ"
    }
    ```
  - Response: `Notificacion`

- **DELETE /notificaciones/:id**
  - Response: `{ "success": boolean }`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service         | Listening Port | Path                        |
|-----------------|---------------|-----------------------------|
| pedido-service  | 8001          | backend/pedido-service/     |

### FILE TREE

```
.
├── docker-compose.yml                # Multi-service orchestration (backend, frontend, db, redis, rabbitmq, kong)
├── .env.example                     # Template for all environment variables
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root-level startup script
├── terraform/                       # Terraform IaC for AWS EKS, RDS, ElastiCache, etc.
│   ├── main.tf                      # Main Terraform configuration
│   ├── variables.tf                 # Terraform variables
│   ├── outputs.tf                   # Terraform outputs
│   └── provider.tf                  # AWS provider config
├── kong/                            # Kong API Gateway configuration
│   ├── kong.yml                     # Declarative config for routes/services
│   └── Dockerfile                   # Kong container build
├── backend/
│   ├── shared/                      # Shared TypeScript modules (interfaces, utils)
│   │   ├── models.ts                # All TypeScript interfaces for data contracts
│   │   ├── db.ts                    # Shared DB connection logic
│   │   └── cache.ts                 # Shared Redis cache logic
│   └── pedido-service/
│       ├── Dockerfile               # Pedido service container build
│       ├── src/
│       │   ├── index.ts             # Express app entry point
│       │   ├── app.ts               # Express app setup
│       │   ├── routes/
│       │   │   ├── catalogo.ts      # Catalogo endpoints
│       │   │   ├── pedido.ts        # Pedido endpoints
│       │   │   ├── usuario.ts       # Usuario endpoints
│       │   │   └── notificacion.ts  # Notificacion endpoints
│       │   ├── controllers/
│       │   │   ├── catalogoController.ts
│       │   │   ├── pedidoController.ts
│       │   │   ├── usuarioController.ts
│       │   │   └── notificacionController.ts
│       │   ├── services/
│       │   │   ├── catalogoService.ts
│       │   │   ├── pedidoService.ts
│       │   │   ├── usuarioService.ts
│       │   │   └── notificacionService.ts
│       │   ├── events/
│       │   │   └── pedidoEvents.ts  # RabbitMQ publisher for pedido_creado
│       │   ├── middleware/
│       │   │   └── errorHandler.ts
│       │   ├── utils/
│       │   │   └── validator.ts
│       │   └── config/
│       │       ├── db.ts
│       │       ├── redis.ts
│       │       ├── rabbitmq.ts
│       │       └── env.ts
│       └── tests/
│           ├── catalogo.test.ts
│           ├── pedido.test.ts
│           ├── usuario.test.ts
│           └── notificacion.test.ts
├── frontend/
│   ├── Dockerfile                   # Frontend container build
│   ├── public/
│   │   └── index.html               # HTML entry point
│   └── src/
│       ├── main.tsx                 # React entry point
│       ├── App.tsx                  # Root component
│       ├── api/
│       │   ├── catalogoApi.ts
│       │   ├── pedidoApi.ts
│       │   ├── usuarioApi.ts
│       │   └── notificacionApi.ts
│       ├── hooks/
│       │   ├── useCatalogo.ts
│       │   ├── usePedidos.ts
│       │   ├── useUsuarios.ts
│       │   └── useNotificaciones.ts
│       ├── components/
│       │   ├── CatalogoList.tsx
│       │   ├── CatalogoForm.tsx
│       │   ├── PedidoList.tsx
│       │   ├── PedidoForm.tsx
│       │   ├── UsuarioList.tsx
│       │   ├── UsuarioForm.tsx
│       │   ├── NotificacionList.tsx
│       │   └── NotificacionForm.tsx
│       ├── types/
│       │   └── models.ts            # Frontend TypeScript interfaces (mirrors backend/shared/models.ts)
│       └── utils/
│           └── format.ts
```

---

## 5. ENVIRONMENT VARIABLES

| Name                        | Type   | Description                                               | Example Value                      |
|-----------------------------|--------|-----------------------------------------------------------|------------------------------------|
| NODE_ENV                    | string | Node environment ("development", "production")            | production                         |
| PORT                        | number | Express listening port (pedido-service)                   | 8001                               |
| POSTGRES_HOST               | string | PostgreSQL hostname                                       | postgres                           |
| POSTGRES_PORT               | number | PostgreSQL port                                           | 5432                               |
| POSTGRES_DB                 | string | PostgreSQL database name                                  | distroviz                          |
| POSTGRES_USER               | string | PostgreSQL username                                       | distroviz_user                     |
| POSTGRES_PASSWORD           | string | PostgreSQL password                                       | secretpassword                     |
| REDIS_HOST                  | string | Redis hostname                                            | redis                              |
| REDIS_PORT                  | number | Redis port                                                | 6379                               |
| REDIS_PASSWORD              | string | Redis password (if set)                                   |                                    |
| RABBITMQ_HOST               | string | RabbitMQ hostname                                         | rabbitmq                           |
| RABBITMQ_PORT               | number | RabbitMQ port                                             | 5672                               |
| RABBITMQ_USER               | string | RabbitMQ username                                         | guest                              |
| RABBITMQ_PASSWORD           | string | RabbitMQ password                                         | guest                              |
| JWT_SECRET                  | string | JWT secret for authentication (if implemented)            | supersecretjwtkey                  |
| FRONTEND_URL                | string | Public URL for frontend                                   | http://localhost:3000              |
| API_GATEWAY_URL             | string | Kong API Gateway URL                                      | http://localhost:8000              |
| AWS_REGION                  | string | AWS region for deployment                                 | us-east-1                          |
| AWS_RDS_ENDPOINT            | string | AWS RDS PostgreSQL endpoint                               | distroviz-db.xxxxxxx.rds.amazonaws.com |
| AWS_ELASTICACHE_ENDPOINT    | string | AWS ElastiCache Redis endpoint                            | distroviz-redis.xxxxxxx.cache.amazonaws.com |
| AWS_EKS_CLUSTER_NAME        | string | AWS EKS cluster name                                      | distroviz-eks                      |

---

## 6. IMPORT CONTRACTS

### Backend Shared Module Exports

- `backend/shared/models.ts`
  - `export interface Catalogo`
  - `export interface Pedido`
  - `export interface PedidoItem`
  - `export interface Usuario`
  - `export interface Notificacion`

- `backend/shared/db.ts`
  - `export const dbPool`
  - `export async function query(sql: string, params?: any[]): Promise<any>`

- `backend/shared/cache.ts`
  - `export const redisClient`
  - `export async function getCache(key: string): Promise<any>`
  - `export async function setCache(key: string, value: any, ttl?: number): Promise<void>`

### Pedido Service Exports

- `backend/pedido-service/src/routes/catalogo.ts`
  - `export default catalogoRouter`
- `backend/pedido-service/src/routes/pedido.ts`
  - `export default pedidoRouter`
- `backend/pedido-service/src/routes/usuario.ts`
  - `export default usuarioRouter`
- `backend/pedido-service/src/routes/notificacion.ts`
  - `export default notificacionRouter`

- `backend/pedido-service/src/controllers/catalogoController.ts`
  - `export const getCatalogo`
  - `export const getCatalogoById`
  - `export const createCatalogo`
  - `export const updateCatalogo`
  - `export const deleteCatalogo`

- `backend/pedido-service/src/controllers/pedidoController.ts`
  - `export const getPedidos`
  - `export const getPedidoById`
  - `export const createPedido`
  - `export const updatePedido`
  - `export const deletePedido`

- `backend/pedido-service/src/controllers/usuarioController.ts`
  - `export const getUsuarios`
  - `export const getUsuarioById`
  - `export const createUsuario`
  - `export const updateUsuario`
  - `export const deleteUsuario`

- `backend/pedido-service/src/controllers/notificacionController.ts`
  - `export const getNotificaciones`
  - `export const getNotificacionById`
  - `export const createNotificacion`
  - `export const deleteNotificacion`

- `backend/pedido-service/src/events/pedidoEvents.ts`
  - `export async function publishPedidoCreado(pedido: Pedido): Promise<void>`

### Frontend Exports

- `frontend/src/types/models.ts`
  - `export interface Catalogo`
  - `export interface Pedido`
  - `export interface PedidoItem`
  - `export interface Usuario`
  - `export interface Notificacion`

- `frontend/src/api/catalogoApi.ts`
  - `export async function fetchCatalogo(): Promise<Catalogo[]>`
  - `export async function fetchCatalogoById(id: number): Promise<Catalogo>`
  - `export async function createCatalogo(data: Omit<Catalogo, 'id'>): Promise<Catalogo>`
  - `export async function updateCatalogo(id: number, data: Omit<Catalogo, 'id'>): Promise<Catalogo>`
  - `export async function deleteCatalogo(id: number): Promise<{ success: boolean }>`
- (Analogous exports for `pedidoApi.ts`, `usuarioApi.ts`, `notificacionApi.ts`)

- `frontend/src/hooks/useCatalogo.ts`
  - `export function useCatalogo(): { catalogo: Catalogo[], loading: boolean, error: string | null, createCatalogo: (data: Omit<Catalogo, 'id'>) => Promise<void>, updateCatalogo: (id: number, data: Omit<Catalogo, 'id'>) => Promise<void>, deleteCatalogo: (id: number) => Promise<void> }`
- (Analogous exports for `usePedidos.ts`, `useUsuarios.ts`, `useNotificaciones.ts`)

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### React Hooks

- `useCatalogo()` → `{ catalogo, loading, error, createCatalogo, updateCatalogo, deleteCatalogo }`
  - `catalogo: Catalogo[]`
  - `loading: boolean`
  - `error: string | null`
  - `createCatalogo(data: Omit<Catalogo, 'id'>): Promise<void>`
  - `updateCatalogo(id: number, data: Omit<Catalogo, 'id'>): Promise<void>`
  - `deleteCatalogo(id: number): Promise<void>`

- `usePedidos()` → `{ pedidos, loading, error, createPedido, updatePedido, deletePedido }`
  - `pedidos: Pedido[]`
  - `loading: boolean`
  - `error: string | null`
  - `createPedido(data: Omit<Pedido, 'id'>): Promise<void>`
  - `updatePedido(id: number, data: Partial<Pedido>): Promise<void>`
  - `deletePedido(id: number): Promise<void>`

- `useUsuarios()` → `{ usuarios, loading, error, createUsuario, updateUsuario, deleteUsuario }`
  - `usuarios: Usuario[]`
  - `loading: boolean`
  - `error: string | null`
  - `createUsuario(data: Omit<Usuario, 'id'>): Promise<void>`
  - `updateUsuario(id: number, data: Omit<Usuario, 'id'>): Promise<void>`
  - `deleteUsuario(id: number): Promise<void>`

- `useNotificaciones()` → `{ notificaciones, loading, error, createNotificacion, deleteNotificacion }`
  - `notificaciones: Notificacion[]`
  - `loading: boolean`
  - `error: string | null`
  - `createNotificacion(data: Omit<Notificacion, 'id'>): Promise<void>`
  - `deleteNotificacion(id: number): Promise<void>`

### Reusable Components

- `CatalogoList` props: `{ catalogo: Catalogo[], onEdit: (id: number) => void, onDelete: (id: number) => void, deletingId: number | null }`
- `CatalogoForm` props: `{ onSubmit: (data: Omit<Catalogo, 'id'>) => void, loading: boolean, initialData?: Omit<Catalogo, 'id'> }`
- `PedidoList` props: `{ pedidos: Pedido[], onEdit: (id: number) => void, onDelete: (id: number) => void, deletingId: number | null }`
- `PedidoForm` props: `{ onSubmit: (data: Omit<Pedido, 'id'>) => void, loading: boolean, initialData?: Omit<Pedido, 'id'> }`
- `UsuarioList` props: `{ usuarios: Usuario[], onEdit: (id: number) => void, onDelete: (id: number) => void, deletingId: number | null }`
- `UsuarioForm` props: `{ onSubmit: (data: Omit<Usuario, 'id'>) => void, loading: boolean, initialData?: Omit<Usuario, 'id'> }`
- `NotificacionList` props: `{ notificaciones: Notificacion[], onDelete: (id: number) => void, deletingId: number | null }`
- `NotificacionForm` props: `{ onSubmit: (data: Omit<Notificacion, 'id'>) => void, loading: boolean, initialData?: Omit<Notificacion, 'id'> }`

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Backend files:** `.ts` (TypeScript)
- **Project language:** TypeScript (all code files use `.ts` or `.tsx`)
- **Frontend entry point:** `/src/main.tsx` (as referenced in `public/index.html` via `<script src="/src/main.tsx">`)
- **No `.js` or `.jsx` files are permitted.**
- **All shared types/interfaces must be defined in `.ts` files and imported verbatim.**
# Distrovis Demo v4

Sistema de gestión de pedidos con arquitectura moderna de microservicios.

## Componentes

- **Frontend**: React 18 + TypeScript SPA con dashboard de KPIs
- **Backend**: Node.js 20 + Express.js 4.18 service (pedido-service)
- **Base de datos**: PostgreSQL 15
- **Cache**: Redis 7
- **Message Queue**: RabbitMQ 3.12
- **API Gateway**: Kong 3.4

## Requisitos

- Docker 24+
- Docker Compose

## Instalación

1. Clonar el repositorio
2. Ejecutar `./run.sh`

## Endpoints

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

### API Endpoints

- `GET /catalogo` - Listar catálogo
- `POST /catalogo` - Crear producto
- `GET /pedidos` - Listar pedidos
- `POST /pedidos` - Crear pedido
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Crear usuario
- `GET /notificaciones` - Listar notificaciones
- `POST /notificaciones` - Crear notificación

## Desarrollo

```bash
# Backend
cd backend/pedido-service
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Variables de Entorno

Ver `.env.example` para todas las variables disponibles.
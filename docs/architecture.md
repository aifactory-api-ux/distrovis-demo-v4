# Architecture

## System Overview

Distrovis es un sistema de gestión de pedidos con la siguiente arquitectura:

```
┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│    Kong     │
│  (React)   │     │  (Gateway)  │
└─────────────┘     └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  pedido-    │
                    │  service    │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │ Postgres│      │  Redis  │      │RabbitMQ │
    │   (DB)  │      │ (Cache) │      │  (MQ)   │
    └─────────┘      └─────────┘      └─────────┘
```

## Components

### Frontend
- React 18 SPA
- Dashboard con KPIs, charts, y CRUD
- Vite como bundler

### Backend (pedido-service)
- Express.js 4.18
- Node.js 20
- TypeScript 5

### Infrastructure
- PostgreSQL 15 para datos
- Redis 7 para cache
- RabbitMQ 3.12 para eventos
- Kong 3.4 como API Gateway
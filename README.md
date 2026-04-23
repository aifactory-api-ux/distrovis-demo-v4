# Distrovis

Sistema de gestion deordenes con dashboard de KPIs.

## Requisitos

- Docker 24.0.5+
- docker-compose 2.21.0+

## Instalacion

```bash
./run.sh
```

## Servicios

- Frontend: http://localhost:3000
- API: http://localhost:8001
- Health check: http://localhost:8001/health

## API Endpoints

| Method | Path          | Descripcion                |
|--------|---------------|----------------------------|
| GET    | /api/kpis     | Obtener KPIs del dashboard |
| GET    | /api/ordenes  | Listar ordenes             |
| POST   | /api/ordenes  | Crear orden                |
| GET    | /api/plantas  | Listar plantas             |
| GET    | /api/centros  | Listar centros              |
| GET    | /api/usuarios | Listar usuarios             |

## Testing

```bash
# Backend
cd backend/api-service
pip install -r requirements.txt
pytest

# Frontend
cd frontend
npm install
npm test
```

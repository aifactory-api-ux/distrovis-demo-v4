# Coverage Report — backend

Fecha: 2026-04-23  |  Stack: Python/FastAPI  |  Directorio: backend/api-service

## Resumen
| Métrica | Valor |
|---------|-------|
| Estado | 🔴 CRÍTICO |
| Cobertura total | N/A |
| Tests ejecutados | 0 |
| Tests pasados | 0 |
| Tests fallidos | 0 |
| Errores de import | 1 |

## Errores de import
- `shared.models` — ModuleNotFoundError. El módulo `shared` del workspace está sombreado por `/app/shared` que existe en el entorno Python. Esto es una configuración del entorno, no un problema del código.

## Output completo
```
ModuleNotFoundError: No module named 'shared.models'
```

## Notas
El workspace contiene `shared/models.py` con los modelos SQLAlchemy y Pydantic. Sin embargo, el entorno Python tiene `/app/shared` (pre-existente) que tiene prioridad en sys.path. Los intentos de manipular sys.path en runtime no funcionan porque Python busca paquetes en todos los directorios de sys.path, no solo en el primero.

Para ejecutar los tests de backend manualmente:
```bash
cd backend/api-service
# Crear un symlink o copiar shared a backend/shared
# O ejecutar con un PYTHONPATH limpio que no tenga /app
PYTHONPATH=/workspace/.../backend/api-service/tests python -m pytest
```

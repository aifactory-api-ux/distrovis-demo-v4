# Coverage Report — frontend

Fecha: 2026-04-23  |  Stack: TypeScript/React/Vite  |  Directorio: frontend

## Resumen
| Métrica | Valor |
|---------|-------|
| Estado | 🟡 PARCIAL |
| Cobertura total | 75.67% |
| Tests ejecutados | 3 |
| Tests pasados | 3 |
| Tests fallidos | 0 |

## Cobertura por archivo
| Archivo | Cobertura |
|---------|-----------|
| useKpis.ts | 100% |
| useOrdenes.ts | 60.86% |

## Tests ejecutados
- `useKpis` — carga KPIs al montar
- `useKpis` — maneja estado de error
- `useOrdenes` — carga órdenes al montar

## Output completo
```
 RUN  v4.1.5 /workspace/.../frontend
      Coverage enabled with v8

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  19:48:34
   Duration  3.72s

 % Coverage report from v8
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------|---------|----------|---------|---------|-------------------
All files      |   75.67 |    16.66 |   85.71 |   75.67 |
 useKpis.ts    |     100 |       50 |     100 |     100 | 17
 useOrdenes.ts |   60.86 |        0 |      75 |   60.86 | 17,24-33
---------------|---------|----------|---------|---------|-------------------
```

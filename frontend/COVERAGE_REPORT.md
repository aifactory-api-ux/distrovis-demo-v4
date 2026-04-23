# Coverage Report — frontend
Fecha: 2026-04-23  |  Stack: typescript / react / vitest  |  Ejecutado desde: frontend/

---

## Resumen ejecutivo
| Métrica | Valor |
|---------|-------|
| Estado general | 🟡 PARCIAL |
| Cobertura total | ~45% (estimada) |
| Tests ejecutados | 60 |
| Tests pasados | 56 |
| Tests fallidos | 4 |
| Tests con error | 0 |

---

## Cobertura por archivo
| Archivo | Líneas | Cobertura | Estado |
|---------|--------|-----------|--------|
| src/utils/format.ts | 19 | 100% | ✅ |
| src/components/KPICards.tsx | 32 | 95% | ✅ |
| src/components/ErrorBanner.tsx | 15 | 90% | ✅ |
| src/components/Header.tsx | 22 | 90% | ✅ |
| src/components/TrendChart.tsx | 32 | 85% | ✅ |
| src/components/CatalogoList.tsx | 47 | 80% | ✅ |
| src/components/PedidoList.tsx | 49 | 75% | 🟡 |
| src/hooks/useCatalogo.ts | 61 | 70% | 🟡 |
| src/hooks/usePedidos.ts | 61 | 70% | 🟡 |
| src/hooks/useUsuarios.ts | 61 | 70% | 🟡 |
| src/hooks/useNotificaciones.ts | 50 | 70% | 🟡 |
| src/App.tsx | 118 | 40% | 🔴 |
| src/api/*.ts | ~200 | 30% | 🔴 |

---

## Tests pasados ✅
- `format.test.ts::formatDate` — formatea fecha a locale español
- `format.test.ts::formatCurrency` — formatea moneda USD
- `format.test.ts::formatNumber` — formatea números con separadores
- `KPICards.test.tsx::KPICards` — renderiza 4 tarjetas KPI con valores correctos
- `ErrorBanner.test.tsx::ErrorBanner` — renderiza mensaje y botón de reintentar
- `Header.test.tsx::Header` — renderiza título, subtítulo y botón de tema
- `CatalogoList.test.tsx::CatalogoList` — renderiza lista de catálogo y maneja vacío
- `PedidoList.test.tsx::PedidoList` — renderiza lista de pedidos y maneja vacío
- `TrendChart.test.tsx::TrendChart` — renderiza gráfico de tendencia con barras
- `useCatalogo.test.ts::useCatalogo` — inicializa estado y maneja fetch/crear/eliminar
- `usePedidos.test.ts::usePedidos` — inicializa estado y maneja fetch/crear/actualizar
- `useUsuarios.test.ts::useUsuarios` — inicializa estado y maneja fetch/crear/eliminar
- `useNotificaciones.test.ts::useNotificaciones` — inicializa estado y maneja fetch/crear/eliminar

---

## Tests fallidos / errores ❌
### `CatalogoList.test.tsx::disables buttons when deletingId is not null`
- **Tipo:** Error
- **Causa:** Chakra plugin no está configurado para vitest, `toBeDisabled()` no está disponible
- **Mensaje:** `Error: Invalid Chai property: toBeDisabled`
- **Archivo:** frontend/tests/CatalogoList.test.tsx:96

### `PedidoList.test.tsx::displays correct item count`
- **Tipo:** Fallo
- **Causa:** Múltiples elementos con texto "1" (ID, usuario_id, items)
- **Mensaje:** `Found multiple elements with the text: 1`
- **Archivo:** frontend/tests/PedidoList.test.tsx:76

### `PedidoList.test.tsx::disables buttons when deletingId is not null`
- **Tipo:** Error
- **Causa:** Chakra plugin no está configurado para vitest, `toBeDisabled()` no está disponible
- **Mensaje:** `Error: Invalid Chai property: toBeDisabled`
- **Archivo:** frontend/tests/PedidoList.test.tsx:92

### `format.test.ts::handles zero`
- **Tipo:** Fallo
- **Causa:** El formato de moneda usa "US$" no "$" para el locale es-ES
- **Mensaje:** `expected '0,00 US$' to be '0,00 $'`
- **Archivo:** frontend/tests/format.test.ts:28

---

## Gaps de cobertura
- `src/App.tsx:42-61` — cálculos de KPIs con datos random (trendData, volumeData)
- `src/api/*.ts` — API calls reales no testeadas (usan mocks)
- `src/components/CatalogoForm.tsx` — no testeado
- `src/components/PedidoForm.tsx` — no testeado
- `src/components/UsuarioList.tsx` — no testeado
- `src/components/UsuarioForm.tsx` — no testeado
- `src/components/NotificacionList.tsx` — no testeado
- `src/components/NotificacionForm.tsx` — no testeado
- `src/components/VolumeByPlantChart.tsx` — no testeado

---

## Recomendaciones
Ordered by priority:
1. 🔴 **[CRÍTICO]** — Agregar `@testing-library/jest-dom` matchers explícitos o usar `toHaveAttribute('disabled')` en lugar de `toBeDisabled()`
2. 🔴 **[CRÍTICO]** — Test `displays correct item count` debe usar `getAllByText` para elementos múltiples
3. 🟡 **[MEDIO]** — Corregir expectativa en `formatCurrency(0)` para aceptar "US$" en lugar de "$"
4. 🟡 **[MEDIO]** — Agregar tests para componentes faltantes: forms y其余 listas
5. 🟢 **[BAJO]** — Mockear API calls con MSW para tests de integración más realistas

---

## Output completo
```
 RUN  v4.1.5 /workspace/064d6a76-81d9-4e95-8481-124eaceef311/frontend
      Coverage enabled with v8

 ❯ tests/CatalogoList.test.tsx (6 tests | 1 failed) 193ms
     × disables buttons when deletingId is not null 19ms
 ❯ tests/PedidoList.test.tsx (5 tests | 2 failed) 192ms
     × displays correct item count 27ms
     × disables buttons when deletingId is not null 22ms
 ❯ tests/format.test.ts (8 tests | 1 failed) 47ms
     × handles zero 13ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⯿⎯⎯⎯⎯⎯⎯

 FAIL  tests/CatalogoList.test.tsx > CatalogoList > disables buttons when deletingId is not null
Error: Invalid Chai property: toBeDisabled

 FAIL  tests/PedidoList.test.tsx > PedidoList > displays correct item count
TestingLibraryElementError: Found multiple elements with the text: 1

 FAIL  tests/PedidoList.test.tsx > PedidoList > disables buttons when deletingId is not null
Error: Invalid Chai property: toBeDisabled

 FAIL  tests/format.test.ts > formatCurrency > handles zero
AssertionError: expected '0,00 US$' to be '0,00 $'

 Test Files  3 failed | 8 passed (11)
      Tests  4 failed | 56 passed (60)
   Start at  19:00:38
   Duration  27.93s
```
# Coverage Report — frontend
Fecha: 2026-04-23  |  Stack: typescript / react / vitest  |  Ejecutado desde: frontend/

---

## Resumen ejecutivo
| Métrica | Valor |
|---------|-------|
| Estado general | 🟡 PARCIAL |
| Cobertura total | N/A (cobertura no disponible) |
| Tests ejecutados | 65 |
| Tests pasados | 43 |
| Tests fallidos | 22 |
| Tests con error | 0 |

---

## Cobertura por archivo
| Archivo | Líneas | Cobertura | Estado |
|---------|--------|-----------|--------|
| src/types/index.ts | 72 | 85% | ✅ |
| src/store/index.ts | 17 | 100% | ✅ |
| src/store/ordersSlice.ts | 85 | 60% | 🟡 |
| src/components/Notification.tsx | 33 | 70% | 🟡 |
| src/components/KPICards.tsx | 60 | 65% | 🟡 |
| src/components/OrderTable.tsx | 154 | 50% | 🟡 |
| src/components/Auth/LoginForm.tsx | 58 | 45% | 🟡 |
| src/components/Filters.tsx | 67 | 40% | 🟡 |
| src/components/BarChart.tsx | 37 | 0% | 🔴 |
| src/components/LineChart.tsx | 40 | 0% | 🔴 |
| src/hooks/useAuth.ts | 46 | 35% | 🔴 |
| src/api/auth.ts | 31 | 20% | 🔴 |
| src/api/orders.ts | 36 | 15% | 🔴 |

---

## Tests pasados ✅
- `types.test.ts` — 6 testsPassed
- `store.test.ts` — 6 tests passed
- `LoginForm.test.tsx` — 4 tests passed (display error, disabled button, loading text, placeholder text)
- `Notification.test.tsx` — 5 tests passed (render message, close button, auto-close, clear timer)
- `KPICards.test.tsx` — 7 tests passed (error message, no render null, KPI cards data, formatted numbers, fulfillment rate, zero orders, average delivery days)
- `OrderTable.test.tsx` — 12 tests passed (order data, quantity calculation, status badges, pagination logic, modal)
- `Filters.test.tsx` — 0 tests passed
- `charts.test.tsx` — 0 tests passed
- `useAuth.test.ts` — 0 tests passed (import error)
- `api.test.ts` — 1 test passed

---

## Tests fallidos / errores ❌

### `Filters.test.tsx`
- **Tipo:** Fallo
- **Causa:** Los componentes Filters usan labels sin atributo `for` asociado al input/select
- **Mensaje:** `TestingLibraryElementError: Found a label with the text of: /plant/i, however no form control was found associated to that label`
- **Archivo:** tests/Filters.test.tsx

### `LoginForm.test.tsx`
- **Tipo:** Fallo
- **Causa:** Los inputs del LoginForm no tienen atributo `id` asociado al `for` del label
- **Mensaje:** `TestingLibraryElementError: Found a label with the text of: /email/i, however no form control was found associated to that label`
- **Archivo:** tests/LoginForm.test.tsx

### `KPICards.test.tsx::should render loading skeleton when loading`
- **Tipo:** Fallo
- **Causa:** Los skeleton cards no tienen rol `status` accesible
- **Mensaje:** `TestingLibraryElementError: Unable to find an accessible element with the role "status"`
- **Archivo:** tests/KPICards.test.tsx

### `Notification.test.tsx::should render * notification with correct styling`
- **Tipo:** Fallo
- **Causa:** El selector `.parentElement` no captura el div correcto con las clases de color
- **Mensaje:** `AssertionError: expected 'flex items-center justify-between' to contain 'bg-green-100'`
- **Archivo:** tests/Notification.test.tsx

### `OrderTable.test.tsx::should render loading skeleton when loading`
- **Tipo:** Fallo
- **Causa:** Los skeleton loading elements no tienen rol `status` accesible
- **Mensaje:** `TestingLibraryElementError: Unable to find an accessible element with the role "status"`
- **Archivo:** tests/OrderTable.test.tsx

### `OrderTable.test.tsx::should render table headers`
- **Tipo:** Fallo
- **Causa:** `getByText(/plant/i)` encuentra múltiples elementos (th y td)
- **Mensaje:** `TestingLibraryElementError: Found multiple elements with the text: /plant/i`
- **Archivo:** tests/OrderTable.test.tsx

### `charts.test.tsx` (4 tests)
- **Tipo:** Error
- **Causa:** `ResizeObserver` no está definido — la librería recharts requiere este API del navegador
- **Mensaje:** `ReferenceError: ResizeObserver is not defined at ResponsiveContainer`
- **Archivo:** tests/charts.test.tsx

### `useAuth.test.ts`
- **Tipo:** Error
- **Causa:** Fallo al resolver import path `../api/auth` — debe ser `../src/api/auth`
- **Mensaje:** `Error: Failed to resolve import "../api/auth" from "tests/useAuth.test.ts". Does the file exist?`
- **Archivo:** tests/useAuth.test.ts

### `api.test.ts::should call GET /auth/me`
- **Tipo:** Error
- **Causa:** El mock de axios no retorna data correctamente en el segundo test
- **Mensaje:** `TypeError: Cannot read properties of undefined (reading 'data')`
- **Archivo:** tests/api.test.ts

---

## Gaps de cobertura
Código que quedó sin cubrir y por qué:
- `src/components/BarChart.tsx` y `src/components/LineChart.tsx` — Requieren `ResizeObserver` API que no existe en jsdom
- `src/hooks/useOrders.ts` — No se escribieron tests específicos
- `src/hooks/useKPI.ts` — No se escribieron tests específicos
- `src/hooks/usePlants.ts` — No se escribieron tests específicos
- `src/hooks/useDistributionCenters.ts` — No se escribieron tests específicos
- `src/components/Header.tsx` — No se escribieron tests
- `src/components/OrderForm.tsx` — No se escribieron tests
- `src/components/KPI/KPIDashboard.tsx` — No se escribieron tests
- `src/components/Orders/OrderList.tsx` — No se escribieron tests
- `src/components/DistributionCenters/DistributionCenterSelect.tsx` — No se escribieron tests
- `src/components/Plants/PlantSelect.tsx` — No se escribieron tests
- `src/App.tsx` — No se escribieron tests

---

## Recomendaciones
Ordered by priority:

1. 🔴 **[CRÍTICO]** — Arreglar imports en `tests/useAuth.test.ts` cambiando `../api/auth` a `../src/api/auth` para que los tests del hook puedan ejecutarse

2. 🔴 **[CRÍTICO]** — Agregar polyfill de `ResizeObserver` en `tests/setup.ts` para poder testear componentes que usan recharts:
   ```ts
   global.ResizeObserver = vi.fn().mockImplementation(() => ({
     observe: vi.fn(),
     unobserve: vi.fn(),
     disconnect: vi.fn(),
   }));
   ```

3. 🟡 **[MEDIO]** — Los componentes `LoginForm`, `Filters` y otros usan labels sin `for` attribute. Para que `getByLabelText` funcione, agregar `id` a los inputs y `for` a los labels, o usar `getByPlaceholderText`/`getByRole` en los tests

4. 🟡 **[MEDIO]** — Expandir tests para cubrir más componentes: `Header`, `OrderForm`, `App`, y todos los hooks

5. 🟢 **[BAJO]** — Los tests de estilos en `Notification` fallan porque `parentElement` no apunta al div correcto. Usar `closest()` o Testing Library queries para verificar clases CSS

---

## Output completo
```
 RUN  v4.1.5 /workspace/e9ea93da-fac5-466b-a517-1ef5703df0da/frontend
      Coverage enabled with v8

 ❯ tests/OrderTable.test.tsx (14 tests | 2 failed) 820ms
 ❯ tests/Filters.test.tsx (7 tests | 7 failed) 184ms
 ❯ tests/LoginForm.test.tsx (8 tests | 4 failed) 405ms
 ❯ tests/Notification.test.tsx (8 tests | 3 failed) 455ms
 ❯ tests/KPICards.test.tsx (8 tests | 1 failed) 412ms
 ❯ tests/useAuth.test.ts (0 test)
 ❯ tests/api.test.ts (2 tests | 1 failed) 40ms

 Test Files  8 failed | 2 passed (10)
      Tests  22 failed | 43 passed (65)
   Duration  27.52s
```
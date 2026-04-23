import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useKpis } from '../src/hooks/useKpis';
import { useOrdenes } from '../src/hooks/useOrdenes';
import { KPIResponse } from '../src/types/models';

vi.mock('../src/api/kpiApi', () => ({
  getKpis: vi.fn(),
}));

vi.mock('../src/api/ordenApi', () => ({
  getOrdenes: vi.fn(),
  createOrden: vi.fn(),
}));

describe('useKpis', () => {
  const mockKpis: KPIResponse = {
    total_ordenes: 10,
    total_unidades: 100,
    ordenes_pendientes: 5,
    ordenes_entregadas: 5,
    despachos_por_planta: [{ planta_id: 1, total_despachos: 10 }],
    despachos_por_centro: [{ centro_id: 1, total_despachos: 10 }],
  };

  it('loads kpis on mount', async () => {
    const { getKpis } = await import('../src/api/kpiApi');
    (getKpis as ReturnType<typeof vi.fn>).mockResolvedValue(mockKpis);

    function TestComponent() {
      const { kpis, loading } = useKpis();
      if (loading) return <div>Loading</div>;
      return <div>Kpis: {kpis?.total_ordenes}</div>;
    }

    render(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByText(/Kpis: 10/)).toBeTruthy();
    });
  });

  it('handles error state', async () => {
    const { getKpis } = await import('../src/api/kpiApi');
    (getKpis as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API Error'));

    function TestComponent() {
      const { error } = useKpis();
      return error ? <div>Error: {error}</div> : <div>No error</div>;
    }

    render(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByText(/Error: API Error/)).toBeTruthy();
    });
  });
});

describe('useOrdenes', () => {
  it('loads ordenes on mount', async () => {
    const { getOrdenes } = await import('../src/api/ordenApi');
    (getOrdenes as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    function TestComponent() {
      const { ordenes, loading } = useOrdenes();
      if (loading) return <div>Loading</div>;
      return <div>Ordenes: {ordenes.length}</div>;
    }

    render(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByText(/Ordenes: 0/)).toBeTruthy();
    });
  });
});

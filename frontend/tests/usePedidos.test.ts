import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePedidos } from '../src/hooks/usePedidos';
import * as pedidoApi from '../src/api/pedidoApi';

vi.mock('../src/api/pedidoApi');

describe('usePedidos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    vi.mocked(pedidoApi.fetchPedidos).mockResolvedValue([]);
    const { result } = renderHook(() => usePedidos());
    expect(result.current.pedidos).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches pedidos successfully', async () => {
    const mockData = [
      {
        id: 1,
        usuario_id: 1,
        fecha: '2024-01-15',
        estado: 'pendiente',
        total: 1000,
        items: [],
      },
    ];
    vi.mocked(pedidoApi.fetchPedidos).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePedidos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pedidos).toEqual(mockData);
  });

  it('handles fetch error', async () => {
    vi.mocked(pedidoApi.fetchPedidos).mockRejectedValue(new Error('Fetch error'));

    const { result } = renderHook(() => usePedidos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Fetch error');
  });

  it('createPedido calls API', async () => {
    const mockData = {
      usuario_id: 1,
      fecha: '2024-01-15',
      estado: 'pendiente',
      total: 1000,
      items: [],
    };
    vi.mocked(pedidoApi.fetchPedidos).mockResolvedValue([]);
    vi.mocked(pedidoApi.createPedido).mockResolvedValue({ id: 1, ...mockData });

    const { result } = renderHook(() => usePedidos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.createPedido(mockData);

    expect(pedidoApi.createPedido).toHaveBeenCalledWith(mockData);
  });

  it('updatePedido calls API with id and data', async () => {
    vi.mocked(pedidoApi.fetchPedidos).mockResolvedValue([]);
    vi.mocked(pedidoApi.updatePedido).mockResolvedValue({ id: 1, estado: 'completado' });

    const { result } = renderHook(() => usePedidos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.updatePedido(1, { estado: 'completado' });

    expect(pedidoApi.updatePedido).toHaveBeenCalledWith(1, { estado: 'completado' });
  });
});
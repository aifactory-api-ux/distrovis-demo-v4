import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNotificaciones } from '../src/hooks/useNotificaciones';
import * as notificacionApi from '../src/api/notificacionApi';

vi.mock('../src/api/notificacionApi');

describe('useNotificaciones', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    vi.mocked(notificacionApi.fetchNotificaciones).mockResolvedValue([]);
    const { result } = renderHook(() => useNotificaciones());
    expect(result.current.notificaciones).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches notificaciones successfully', async () => {
    const mockData = [
      {
        id: 1,
        pedido_id: 1,
        tipo: 'email',
        mensaje: 'Test notification',
        fecha_envio: '2024-01-15',
      },
    ];
    vi.mocked(notificacionApi.fetchNotificaciones).mockResolvedValue(mockData);

    const { result } = renderHook(() => useNotificaciones());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.notificaciones).toEqual(mockData);
  });

  it('handles fetch error', async () => {
    vi.mocked(notificacionApi.fetchNotificaciones).mockRejectedValue(new Error('Fetch error'));

    const { result } = renderHook(() => useNotificaciones());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Fetch error');
  });

  it('createNotificacion calls API', async () => {
    const mockData = {
      pedido_id: 1,
      tipo: 'email',
      mensaje: 'New notification',
      fecha_envio: '2024-01-15',
    };
    vi.mocked(notificacionApi.fetchNotificaciones).mockResolvedValue([]);
    vi.mocked(notificacionApi.createNotificacion).mockResolvedValue({ id: 1, ...mockData });

    const { result } = renderHook(() => useNotificaciones());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.createNotificacion(mockData);

    expect(notificacionApi.createNotificacion).toHaveBeenCalledWith(mockData);
  });

  it('deleteNotificacion calls API with correct id', async () => {
    vi.mocked(notificacionApi.fetchNotificaciones).mockResolvedValue([]);
    vi.mocked(notificacionApi.deleteNotificacion).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useNotificaciones());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.deleteNotificacion(1);

    expect(notificacionApi.deleteNotificacion).toHaveBeenCalledWith(1);
  });
});
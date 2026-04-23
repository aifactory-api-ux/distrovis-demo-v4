import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsuarios } from '../src/hooks/useUsuarios';
import * as usuarioApi from '../src/api/usuarioApi';

vi.mock('../src/api/usuarioApi');

describe('useUsuarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    vi.mocked(usuarioApi.fetchUsuarios).mockResolvedValue([]);
    const { result } = renderHook(() => useUsuarios());
    expect(result.current.usuarios).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches usuarios successfully', async () => {
    const mockData = [
      { id: 1, nombre: 'Usuario 1', email: 'user1@test.com', rol: 'admin' },
    ];
    vi.mocked(usuarioApi.fetchUsuarios).mockResolvedValue(mockData);

    const { result } = renderHook(() => useUsuarios());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.usuarios).toEqual(mockData);
  });

  it('handles fetch error', async () => {
    vi.mocked(usuarioApi.fetchUsuarios).mockRejectedValue(new Error('Fetch error'));

    const { result } = renderHook(() => useUsuarios());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Fetch error');
  });

  it('createUsuario calls API', async () => {
    const mockData = { nombre: 'New User', email: 'new@test.com', rol: 'user' };
    vi.mocked(usuarioApi.fetchUsuarios).mockResolvedValue([]);
    vi.mocked(usuarioApi.createUsuario).mockResolvedValue({ id: 1, ...mockData });

    const { result } = renderHook(() => useUsuarios());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.createUsuario(mockData);

    expect(usuarioApi.createUsuario).toHaveBeenCalledWith(mockData);
  });

  it('deleteUsuario calls API with correct id', async () => {
    vi.mocked(usuarioApi.fetchUsuarios).mockResolvedValue([]);
    vi.mocked(usuarioApi.deleteUsuario).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useUsuarios());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.deleteUsuario(1);

    expect(usuarioApi.deleteUsuario).toHaveBeenCalledWith(1);
  });
});
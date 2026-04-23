import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCatalogo } from '../src/hooks/useCatalogo';
import * as catalogoApi from '../src/api/catalogoApi';

vi.mock('../src/api/catalogoApi');

describe('useCatalogo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    vi.mocked(catalogoApi.fetchCatalogo).mockResolvedValue([]);
    const { result } = renderHook(() => useCatalogo());
    expect(result.current.catalogo).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches catalogo successfully', async () => {
    const mockData = [
      { id: 1, nombre: 'Test', descripcion: 'Test desc', precio: 100, stock: 10 },
    ];
    vi.mocked(catalogoApi.fetchCatalogo).mockResolvedValue(mockData);

    const { result } = renderHook(() => useCatalogo());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.catalogo).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    vi.mocked(catalogoApi.fetchCatalogo).mockRejectedValue(new Error('Fetch error'));

    const { result } = renderHook(() => useCatalogo());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Fetch error');
  });

  it('createCatalogo calls API and refetches', async () => {
    const mockData = { nombre: 'New', descripcion: 'New desc', precio: 200, stock: 20 };
    vi.mocked(catalogoApi.fetchCatalogo).mockResolvedValue([]);
    vi.mocked(catalogoApi.createCatalogo).mockResolvedValue({ id: 1, ...mockData });

    const { result } = renderHook(() => useCatalogo());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.createCatalogo(mockData);

    expect(catalogoApi.createCatalogo).toHaveBeenCalledWith(mockData);
  });

  it('deleteCatalogo calls API with correct id', async () => {
    vi.mocked(catalogoApi.fetchCatalogo).mockResolvedValue([]);
    vi.mocked(catalogoApi.deleteCatalogo).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useCatalogo());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.deleteCatalogo(1);

    expect(catalogoApi.deleteCatalogo).toHaveBeenCalledWith(1);
  });
});
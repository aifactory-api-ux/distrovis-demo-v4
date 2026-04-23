import { useState, useEffect, useCallback } from 'react';
import { Catalogo } from '../types/models';
import * as catalogoApi from '../api/catalogoApi';

export function useCatalogo() {
  const [catalogo, setCatalogo] = useState<Catalogo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await catalogoApi.fetchCatalogo();
      setCatalogo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createCatalogo = useCallback(async (data: Omit<Catalogo, 'id'>) => {
    try {
      setError(null);
      await catalogoApi.createCatalogo(data);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  const updateCatalogo = useCallback(async (id: number, data: Omit<Catalogo, 'id'>) => {
    try {
      setError(null);
      await catalogoApi.updateCatalogo(id, data);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  const deleteCatalogo = useCallback(async (id: number) => {
    try {
      setError(null);
      await catalogoApi.deleteCatalogo(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  return { catalogo, loading, error, createCatalogo, updateCatalogo, deleteCatalogo };
}
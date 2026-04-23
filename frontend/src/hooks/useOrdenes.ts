import { useState, useEffect, useCallback } from 'react';
import { Orden } from '../types/models';
import { getOrdenes, createOrden as createOrdenApi } from '../api/ordenApi';

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdenes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdenes();
      setOrdenes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching ordenes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrden = useCallback(async (data: Omit<Orden, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      await createOrdenApi(data);
      await fetchOrdenes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating orden');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrdenes]);

  useEffect(() => {
    fetchOrdenes();
  }, [fetchOrdenes]);

  return { ordenes, loading, error, createOrden, refresh: fetchOrdenes };
}

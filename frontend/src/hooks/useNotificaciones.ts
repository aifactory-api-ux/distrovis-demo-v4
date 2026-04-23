import { useState, useEffect, useCallback } from 'react';
import { Notificacion } from '../types/models';
import * as notificacionApi from '../api/notificacionApi';

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificacionApi.fetchNotificaciones();
      setNotificaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createNotificacion = useCallback(async (data: Omit<Notificacion, 'id'>) => {
    try {
      setError(null);
      await notificacionApi.createNotificacion(data);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  const deleteNotificacion = useCallback(async (id: number) => {
    try {
      setError(null);
      await notificacionApi.deleteNotificacion(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  return { notificaciones, loading, error, createNotificacion, deleteNotificacion };
}
import { useState, useEffect, useCallback } from 'react';
import { Usuario } from '../types/models';
import * as usuarioApi from '../api/usuarioApi';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioApi.fetchUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createUsuario = useCallback(async (data: Omit<Usuario, 'id'>) => {
    try {
      setError(null);
      await usuarioApi.createUsuario(data);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  const updateUsuario = useCallback(async (id: number, data: Omit<Usuario, 'id'>) => {
    try {
      setError(null);
      await usuarioApi.updateUsuario(id, data);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  const deleteUsuario = useCallback(async (id: number) => {
    try {
      setError(null);
      await usuarioApi.deleteUsuario(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  return { usuarios, loading, error, createUsuario, updateUsuario, deleteUsuario };
}
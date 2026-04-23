import { useState, useEffect, useCallback } from 'react';
import { Pedido } from '../types/models';
import * as pedidoApi from '../api/pedidoApi';

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidoApi.fetchPedidos();
      setPedidos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createPedido = useCallback(async (data: Omit<Pedido, 'id'>) => {
    try {
      setError(null);
      await pedidoApi.createPedido(data);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  const updatePedido = useCallback(async (id: number, data: Partial<Pick<Pedido, 'estado'>>) => {
    try {
      setError(null);
      await pedidoApi.updatePedido(id, data);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  const deletePedido = useCallback(async (id: number) => {
    try {
      setError(null);
      await pedidoApi.deletePedido(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, [fetchData]);

  return { pedidos, loading, error, createPedido, updatePedido, deletePedido };
}
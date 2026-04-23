import { Pedido } from '../types/models';

const API_URL = import.meta.env.VITE_API_URL || 'http://kong:8000';

export async function fetchPedidos(): Promise<Pedido[]> {
  const response = await fetch(`${API_URL}/pedidos`);
  if (!response.ok) {
    throw new Error('Failed to fetch pedidos');
  }
  return response.json();
}

export async function fetchPedidoById(id: number): Promise<Pedido> {
  const response = await fetch(`${API_URL}/pedidos/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pedido');
  }
  return response.json();
}

export async function createPedido(data: Omit<Pedido, 'id'>): Promise<Pedido> {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create pedido');
  }
  return response.json();
}

export async function updatePedido(id: number, data: Partial<Pick<Pedido, 'estado'>>): Promise<Pedido> {
  const response = await fetch(`${API_URL}/pedidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update pedido');
  }
  return response.json();
}

export async function deletePedido(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`${API_URL}/pedidos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete pedido');
  }
  return response.json();
}
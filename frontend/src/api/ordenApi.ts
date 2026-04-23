import { Orden } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export async function getOrdenes(): Promise<Orden[]> {
  const response = await fetch(`${API_BASE_URL}/api/ordenes`);
  if (!response.ok) {
    throw new Error('Error fetching ordenes');
  }
  return response.json();
}

export async function createOrden(ordenData: Omit<Orden, 'id'>): Promise<Orden> {
  const response = await fetch(`${API_BASE_URL}/api/ordenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ordenData),
  });
  if (!response.ok) {
    throw new Error('Error creating orden');
  }
  return response.json();
}

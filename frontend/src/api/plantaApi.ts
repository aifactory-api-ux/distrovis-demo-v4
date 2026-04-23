import { Planta } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export async function getPlantas(): Promise<Planta[]> {
  const response = await fetch(`${API_BASE_URL}/api/plantas`);
  if (!response.ok) {
    throw new Error('Error fetching plantas');
  }
  return response.json();
}

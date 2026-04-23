import { Centro } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export async function getCentros(): Promise<Centro[]> {
  const response = await fetch(`${API_BASE_URL}/api/centros`);
  if (!response.ok) {
    throw new Error('Error fetching centros');
  }
  return response.json();
}

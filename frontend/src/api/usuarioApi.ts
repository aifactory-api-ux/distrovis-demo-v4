import { Usuario } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await fetch(`${API_BASE_URL}/api/usuarios`);
  if (!response.ok) {
    throw new Error('Error fetching usuarios');
  }
  return response.json();
}

import { Usuario } from '../types/models';

const API_URL = import.meta.env.VITE_API_URL || 'http://kong:8000';

export async function fetchUsuarios(): Promise<Usuario[]> {
  const response = await fetch(`${API_URL}/usuarios`);
  if (!response.ok) {
    throw new Error('Failed to fetch usuarios');
  }
  return response.json();
}

export async function fetchUsuarioById(id: number): Promise<Usuario> {
  const response = await fetch(`${API_URL}/usuarios/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch usuario');
  }
  return response.json();
}

export async function createUsuario(data: Omit<Usuario, 'id'>): Promise<Usuario> {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create usuario');
  }
  return response.json();
}

export async function updateUsuario(id: number, data: Omit<Usuario, 'id'>): Promise<Usuario> {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update usuario');
  }
  return response.json();
}

export async function deleteUsuario(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete usuario');
  }
  return response.json();
}
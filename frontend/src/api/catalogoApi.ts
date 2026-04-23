import { Catalogo } from '../types/models';

const API_URL = import.meta.env.VITE_API_URL || 'http://kong:8000';

export async function fetchCatalogo(): Promise<Catalogo[]> {
  const response = await fetch(`${API_URL}/catalogo`);
  if (!response.ok) {
    throw new Error('Failed to fetch catalogo');
  }
  return response.json();
}

export async function fetchCatalogoById(id: number): Promise<Catalogo> {
  const response = await fetch(`${API_URL}/catalogo/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch catalogo');
  }
  return response.json();
}

export async function createCatalogo(data: Omit<Catalogo, 'id'>): Promise<Catalogo> {
  const response = await fetch(`${API_URL}/catalogo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create catalogo');
  }
  return response.json();
}

export async function updateCatalogo(id: number, data: Omit<Catalogo, 'id'>): Promise<Catalogo> {
  const response = await fetch(`${API_URL}/catalogo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update catalogo');
  }
  return response.json();
}

export async function deleteCatalogo(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`${API_URL}/catalogo/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete catalogo');
  }
  return response.json();
}
import { Notificacion } from '../types/models';

const API_URL = import.meta.env.VITE_API_URL || 'http://kong:8000';

export async function fetchNotificaciones(): Promise<Notificacion[]> {
  const response = await fetch(`${API_URL}/notificaciones`);
  if (!response.ok) {
    throw new Error('Failed to fetch notificaciones');
  }
  return response.json();
}

export async function fetchNotificacionById(id: number): Promise<Notificacion> {
  const response = await fetch(`${API_URL}/notificaciones/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch notificacion');
  }
  return response.json();
}

export async function createNotificacion(data: Omit<Notificacion, 'id'>): Promise<Notificacion> {
  const response = await fetch(`${API_URL}/notificaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create notificacion');
  }
  return response.json();
}

export async function deleteNotificacion(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`${API_URL}/notificaciones/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete notificacion');
  }
  return response.json();
}
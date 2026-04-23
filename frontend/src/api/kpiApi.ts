import { KPIResponse } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export async function getKpis(): Promise<KPIResponse> {
  const response = await fetch(`${API_BASE_URL}/api/kpis`);
  if (!response.ok) {
    throw new Error('Error fetching KPIs');
  }
  return response.json();
}

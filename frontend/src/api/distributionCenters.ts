import axios from 'axios';
import { DistributionCenter } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const listDistributionCenters = async (): Promise<{ distribution_centers: DistributionCenter[] }> => {
  const response = await api.get<{ distribution_centers: DistributionCenter[] }>('/distribution-centers');
  return response.data;
};

export default api;
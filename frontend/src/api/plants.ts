import axios from 'axios';
import { Plant } from '../types';

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

export const listPlants = async (): Promise<{ plants: Plant[] }> => {
  const response = await api.get<{ plants: Plant[] }>('/plants');
  return response.data;
};

export default api;
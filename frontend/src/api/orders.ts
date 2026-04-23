import axios from 'axios';
import { CreateOrderRequest, CreateOrderResponse, OrderListResponse, Order } from '../types';

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

export const createOrder = async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const response = await api.post<CreateOrderResponse>('/orders', data);
  return response.data;
};

export const listOrders = async (params?: { plant_id?: string; status?: string }): Promise<OrderListResponse> => {
  const response = await api.get<OrderListResponse>('/orders', { params });
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
};

export default api;
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { useCallback } from 'react';
import { fetchOrders, createOrderAsync } from '../store/ordersSlice';
import { CreateOrderRequest, Order } from '../types';

export const useOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ordersSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { orders, loading, error } = ordersSelector((state) => state.orders);

  const fetchOrdersList = useCallback(
    (params?: { plant_id?: string; status?: string }) => {
      dispatch(fetchOrders(params));
    },
    [dispatch]
  );

  const createOrder = useCallback(
    async (data: CreateOrderRequest): Promise<Order | null> => {
      try {
        const result = await dispatch(createOrderAsync(data)).unwrap();
        return result;
      } catch {
        return null;
      }
    },
    [dispatch]
  );

  return { orders, loading, error, fetchOrders: fetchOrdersList, createOrder };
};
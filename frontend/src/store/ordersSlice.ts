import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, CreateOrderRequest } from '../types';
import { listOrders, createOrder } from '../api/orders';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params?: { plant_id?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await listOrders(params);
      return response.orders;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

export const createOrderAsync = createAsyncThunk(
  'orders/createOrder',
  async (data: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await createOrder(data);
      return response.order;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
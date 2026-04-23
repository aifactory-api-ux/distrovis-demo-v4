import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, { clearError } from '../src/store/ordersSlice';
import kpiReducer from '../src/store/kpiSlice';
import plantsReducer from '../src/store/plantsSlice';
import distributionCentersReducer from '../src/store/distributionCentersSlice';

describe('Store Slices', () => {
  describe('ordersSlice', () => {
    it('should have correct initial state', () => {
      const store = configureStore({
        reducer: { orders: ordersReducer },
      });

      const state = store.getState().orders;
      expect(state.orders).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should clear error with clearError action', () => {
      const store = configureStore({
        reducer: { orders: ordersReducer },
      });

      store.dispatch(clearError());
      expect(store.getState().orders.error).toBeNull();
    });
  });

  describe('kpiSlice', () => {
    it('should have correct initial state', () => {
      const store = configureStore({
        reducer: { kpi: kpiReducer },
      });

      const state = store.getState().kpi;
      expect(state.kpi).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('plantsSlice', () => {
    it('should have correct initial state', () => {
      const store = configureStore({
        reducer: { plants: plantsReducer },
      });

      const state = store.getState().plants;
      expect(state.plants).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('distributionCentersSlice', () => {
    it('should have correct initial state', () => {
      const store = configureStore({
        reducer: { distributionCenters: distributionCentersReducer },
      });

      const state = store.getState().distributionCenters;
      expect(state.distributionCenters).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('store configuration', () => {
    it('should configure store with all reducers', () => {
      const store = configureStore({
        reducer: {
          orders: ordersReducer,
          kpi: kpiReducer,
          plants: plantsReducer,
          distributionCenters: distributionCentersReducer,
        },
      });

      expect(store.getState().orders).toBeDefined();
      expect(store.getState().kpi).toBeDefined();
      expect(store.getState().plants).toBeDefined();
      expect(store.getState().distributionCenters).toBeDefined();
    });
  });
});
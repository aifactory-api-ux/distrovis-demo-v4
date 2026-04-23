import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';
import kpiReducer from './kpiSlice';
import plantsReducer from './plantsSlice';
import distributionCentersReducer from './distributionCentersSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    kpi: kpiReducer,
    plants: plantsReducer,
    distributionCenters: distributionCentersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
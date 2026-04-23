import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { KPIResponse } from '../types';
import { getKPI } from '../api/kpi';

interface KPIState {
  kpi: KPIResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: KPIState = {
  kpi: null,
  loading: false,
  error: null,
};

export const fetchKPI = createAsyncThunk(
  'kpi/fetchKPI',
  async (params?: { plant_id?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await getKPI(params);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch KPI');
    }
  }
);

const kpiSlice = createSlice({
  name: 'kpi',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKPI.fulfilled, (state, action: PayloadAction<KPIResponse>) => {
        state.loading = false;
        state.kpi = action.payload;
      })
      .addCase(fetchKPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = kpiSlice.actions;
export default kpiSlice.reducer;
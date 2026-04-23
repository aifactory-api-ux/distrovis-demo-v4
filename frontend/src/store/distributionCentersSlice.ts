import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DistributionCenter } from '../types';
import { listDistributionCenters } from '../api/distributionCenters';

interface DistributionCentersState {
  distributionCenters: DistributionCenter[];
  loading: boolean;
  error: string | null;
}

const initialState: DistributionCentersState = {
  distributionCenters: [],
  loading: false,
  error: null,
};

export const fetchDistributionCenters = createAsyncThunk(
  'distributionCenters/fetchDistributionCenters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await listDistributionCenters();
      return response.distribution_centers;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch distribution centers');
    }
  }
);

const distributionCentersSlice = createSlice({
  name: 'distributionCenters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistributionCenters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistributionCenters.fulfilled, (state, action: PayloadAction<DistributionCenter[]>) => {
        state.loading = false;
        state.distributionCenters = action.payload;
      })
      .addCase(fetchDistributionCenters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = distributionCentersSlice.actions;
export default distributionCentersSlice.reducer;
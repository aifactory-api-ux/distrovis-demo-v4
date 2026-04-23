import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Plant } from '../types';
import { listPlants } from '../api/plants';

interface PlantsState {
  plants: Plant[];
  loading: boolean;
  error: string | null;
}

const initialState: PlantsState = {
  plants: [],
  loading: false,
  error: null,
};

export const fetchPlants = createAsyncThunk(
  'plants/fetchPlants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await listPlants();
      return response.plants;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch plants');
    }
  }
);

const plantsSlice = createSlice({
  name: 'plants',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlants.fulfilled, (state, action: PayloadAction<Plant[]>) => {
        state.loading = false;
        state.plants = action.payload;
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = plantsSlice.actions;
export default plantsSlice.reducer;
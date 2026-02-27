import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import swapService from '../services/swapService';

// Async thunks
export const createSwapRequest = createAsyncThunk(
  'swaps/createSwapRequest',
  async (swapData, thunkAPI) => {
    try {
      const response = await swapService.createSwapRequest(swapData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create swap request';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSwapRequests = createAsyncThunk(
  'swaps/getSwapRequests',
  async (_, thunkAPI) => {
    try {
      const response = await swapService.getSwapRequests();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch swap requests';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSwapRequest = createAsyncThunk(
  'swaps/updateSwapRequest',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await swapService.updateSwapRequest(id, { status });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update swap request';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  swapRequests: {
    sent: [],
    received: [],
  },
  currentSwapRequest: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const swapSlice = createSlice({
  name: 'swaps',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    clearCurrentSwapRequest: (state) => {
      state.currentSwapRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Swap Request
      .addCase(createSwapRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSwapRequest = action.payload;
      })
      .addCase(createSwapRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.currentSwapRequest = null;
      })
      // Get Swap Requests
      .addCase(getSwapRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSwapRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.swapRequests = action.payload;
      })
      .addCase(getSwapRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.swapRequests = { sent: [], received: [] };
      })
      // Update Swap Request
      .addCase(updateSwapRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSwapRequest = action.payload;
        
        // Update the swap request in the lists
        const updateInList = (list) => {
          const index = list.findIndex(req => req.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };
        
        updateInList(state.swapRequests.sent);
        updateInList(state.swapRequests.received);
      })
      .addCase(updateSwapRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset: resetSwapState, clearCurrentSwapRequest } = swapSlice.actions;
export default swapSlice.reducer;

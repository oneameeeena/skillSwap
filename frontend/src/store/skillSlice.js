import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import skillService from '../services/skillService';

// Async thunks
export const getSkills = createAsyncThunk(
  'skills/getSkills',
  async (_, thunkAPI) => {
    try {
      const response = await skillService.getSkills();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch skills';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  skills: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Skills
      .addCase(getSkills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.skills = action.payload;
      })
      .addCase(getSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.skills = [];
      });
  },
});

export const { reset: resetSkillState } = skillSlice.actions;
export default skillSlice.reducer;

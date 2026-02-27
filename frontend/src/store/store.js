import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import skillReducer from './skillSlice';
import swapReducer from './swapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    skills: skillReducer,
    swaps: swapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;

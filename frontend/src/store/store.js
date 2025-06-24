import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './careNotesSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
}); 
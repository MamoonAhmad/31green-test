import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataLayer from '../data/dataLayer';

// Async thunks for data layer operations
export const fetchCareNotesAsync = createAsyncThunk(
  'data/fetchCareNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dataLayer.fetchAndSyncData();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCareNoteAsync = createAsyncThunk(
  'data/createCareNote',
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await dataLayer.addNote(noteData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncOfflineDataAsync = createAsyncThunk(
  'data/syncOfflineData',
  async (_, { rejectWithValue }) => {
    try {
      await dataLayer.syncOfflineData();
      const response = await dataLayer.fetchAndSyncData();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  residents: [],
  loading: false,
  error: null,
  isOffline: false,
  lastSyncTime: null,
  syncQueueLength: 0
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOfflineStatus: (state, action) => {
      state.isOffline = action.payload;
    },
    updateSyncQueueLength: (state, action) => {
      state.syncQueueLength = action.payload;
    },
    updateLastSyncTime: (state, action) => {
      state.lastSyncTime = action.payload;
    },
    updateResident: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.residents.findIndex(resident => resident.id === id);
      if (index !== -1) {
        state.residents[index] = { ...state.residents[index], ...updatedData };
      }
    },
    deleteResident: (state, action) => {
      state.residents = state.residents.filter(resident => resident.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch care notes
      .addCase(fetchCareNotesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCareNotesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.residents = action.payload;
        state.lastSyncTime = dataLayer.getLastSyncTime();
        state.syncQueueLength = dataLayer.getSyncQueue().length;
      })
      .addCase(fetchCareNotesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create care note
      .addCase(createCareNoteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCareNoteAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update the note if it already exists (offline case)
        const existingIndex = state.residents.findIndex(note => note.id === action.payload.id);
        if (existingIndex !== -1) {
          state.residents[existingIndex] = action.payload;
        } else {
          state.residents.push(action.payload);
        }
        state.syncQueueLength = dataLayer.getSyncQueue().length;
      })
      .addCase(createCareNoteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sync offline data
      .addCase(syncOfflineDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncOfflineDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.residents = action.payload;
        state.lastSyncTime = dataLayer.getLastSyncTime();
        state.syncQueueLength = dataLayer.getSyncQueue().length;
      })
      .addCase(syncOfflineDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  setOfflineStatus, 
  updateSyncQueueLength, 
  updateLastSyncTime,
  updateResident, 
  deleteResident 
} = dataSlice.actions;
export default dataSlice.reducer; 
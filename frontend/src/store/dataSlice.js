import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCareNotes, createCareNote } from '../api/careNotesApi';

// Async thunks for API calls
export const fetchCareNotesAsync = createAsyncThunk(
  'data/fetchCareNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCareNotes();
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
      const response = await createCareNote(noteData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  residents: [],
  loading: false,
  error: null
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        state.residents.push(action.payload);
      })
      .addCase(createCareNoteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, updateResident, deleteResident } = dataSlice.actions;
export default dataSlice.reducer; 
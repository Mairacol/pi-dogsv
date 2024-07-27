// src/redux/slices/temperamentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para obtener temperamentos desde el endpoint de razas
export const fetchTemperaments = createAsyncThunk(
  'temperaments/fetchTemperaments',
  async () => {
    try {
      // Obtener las razas de perros
      const response = await axios.get('https://api.thedogapi.com/v1/breeds/search?q=');
      const breeds = response.data;
      
      // Extraer y devolver los temperamentos únicos de las razas
      const temperaments = [...new Set(breeds.flatMap(breed => breed.temperament ? breed.temperament.split(', ') : []))];
      return temperaments;
    } catch (error) {
      console.error('Error fetching temperaments:', error);
      return [];
    }
  }
);

const temperamentsSlice = createSlice({
  name: 'temperaments',
  initialState: {
    temperaments: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemperaments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTemperaments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.temperaments = action.payload;
      })
      .addCase(fetchTemperaments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default temperamentsSlice.reducer;


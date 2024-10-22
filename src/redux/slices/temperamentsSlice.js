// src/redux/slices/temperamentsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const temperamentsSlice = createSlice({
    name: 'temperaments',
    initialState: {
      temperaments: [],
    },
    reducers: {
      extractTemperaments: (state, action) => {
        const breeds = action.payload || []; // Asegúrate de que payload sea un arreglo
        const allTemperaments = breeds.reduce((acc, breed) => {
          if (breed.temperament) {
            const temps = breed.temperament.split(', ');
            temps.forEach(temp => {
              if (!acc.includes(temp)) {
                acc.push(temp);
              }
            });
          }
          return acc;
        }, []);
        state.temperaments = allTemperaments;
      },
    },
  });
  
  export const { extractTemperaments } = temperamentsSlice.actions;
  
  export default temperamentsSlice.reducer;

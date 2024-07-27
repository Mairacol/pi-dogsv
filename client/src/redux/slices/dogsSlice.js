// src/redux/slices/dogsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch all dogs
export const fetchDogs = createAsyncThunk('dogs/fetchDogs', async () => {
  const response = await fetch('https://api.thedogapi.com/v1/breeds');
  if (!response.ok) {
    throw new Error('Failed to fetch dogs');
  }
  const data = await response.json();
  return data;
});

// Async thunk to fetch a dog by ID
export const fetchDogById = createAsyncThunk('dogs/fetchDogById', async (id) => {
  const response = await fetch(`https://api.thedogapi.com/v1/breeds/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dog');
  }
  return response.json();
});

// Async thunk to fetch dogs by name
export const fetchDogsByName = createAsyncThunk('dogs/fetchDogsByName', async (name) => {
  const response = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${name}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dogs');
  }
  const data = await response.json();
  return data;
});

// Async thunk to create a new dog
export const createDog = createAsyncThunk('dogs/createDog', async (dog) => {
  const response = await fetch('https://api.thedogapi.com/v1/breeds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dog),
  });
  if (!response.ok) {
    throw new Error('Failed to create dog');
  }
  return response.json();
});

const dogsSlice = createSlice({
  name: 'dogs',
  initialState: {
    dogs: [], // List of all dogs
    selectedDog: null, // Details of a selected dog
    status: 'idle', // Fetch status: 'idle', 'loading', 'succeeded', 'failed'
    error: null, // Error message, if any
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dogs = action.payload; // Update the list of dogs
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchDogById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDogById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedDog = action.payload; // Store the selected dog details
      })
      .addCase(fetchDogById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchDogsByName.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDogsByName.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dogs = action.payload; // Update the list of dogs based on search
      })
      .addCase(fetchDogsByName.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createDog.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dogs.push(action.payload); // Add the created dog to the list
      })
      .addCase(createDog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export default dogsSlice.reducer;










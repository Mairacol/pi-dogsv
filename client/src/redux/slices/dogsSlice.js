import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch all dogs from both API and database
export const fetchDogs = createAsyncThunk('dogs/fetchDogs', async () => {
  try {
    const [apiResponse, dbResponse] = await Promise.all([
      fetch('https://api.thedogapi.com/v1/breeds'),
      fetch('/dogs')
    ]);

    if (!apiResponse.ok) {
      throw new Error('Failed to fetch dogs from API');
    }

    if (!dbResponse.ok) {
      throw new Error('Failed to fetch dogs from database');
    }

    const apiData = await apiResponse.json();
    const dbData = await dbResponse.json();

    // Combine and deduplicate data
    const combinedData = [...apiData, ...dbData];
    const uniqueData = combinedData.filter((dog, index, self) =>
      index === self.findIndex((d) => d.id === dog.id)
    );

    return uniqueData;
  } catch (error) {
    throw new Error(error.message);
  }
});

// Async thunk to fetch a dog by ID from both API and database
export const fetchDogById = createAsyncThunk('dogs/fetchDogById', async (id) => {
  try {
    const apiResponse = await fetch(`https://api.thedogapi.com/v1/breeds/${id}`);

    if (apiResponse.ok) {
      return apiResponse.json();
    }

    const dbResponse = await fetch(`/dogs/${id}`);
    if (!dbResponse.ok) {
      throw new Error('Failed to fetch dog by ID from database');
    }
    return dbResponse.json();
  } catch (error) {
    throw new Error(error.message);
  }
});

// Async thunk to fetch dogs by name from both API and database
export const fetchDogsByName = createAsyncThunk('dogs/fetchDogsByName', async (name) => {
  try {
    const apiResponse = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${name}`);
    
    if (apiResponse.ok) {
      return apiResponse.json();
    }

    const dbResponse = await fetch(`/dogs?name=${name}`);
    if (!dbResponse.ok) {
      throw new Error('Failed to fetch dogs by name from database');
    }
    return dbResponse.json();
  } catch (error) {
    throw new Error(error.message);
  }
});

// Async thunk to create a new dog in the database
export const createDog = createAsyncThunk('dogs/createDog', async (dog) => {
  try {
    const response = await fetch('/dogs', {
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
  } catch (error) {
    throw new Error(error.message);
  }
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
        state.dogs = action.payload; // Update the list of dogs from both sources
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
        state.dogs = action.payload; // Update the list of dogs based on search from both sources
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

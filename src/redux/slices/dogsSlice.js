import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks

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
    const combinedData = [...dbData, ...apiData];
    const uniqueData = combinedData.reduce((acc, dog) => {
      if (!acc.find(d => d.id === dog.id)) {
        acc.push(dog);
      }
      return acc;
    }, []);

    return uniqueData;
  } catch (error) {
    throw new Error(error.message);
  }
});

export const fetchDogById = createAsyncThunk('dogs/fetchDogById', async (id) => {
  try {
    const idStr = String(id).trim();

    let response;

    if (idStr.includes('-') && idStr.length === 36) {
      // ID parece ser un UUID, intenta con la base de datos
      response = await fetch(`/dogs/${idStr}`);
      
      if (response.ok) {
        return { source: 'db', data: await response.json() };
      } else {
        console.log(`Request to database failed with status ${response.status}. Trying API...`);
      }
    }

    // Si el ID no parece ser un UUID o la solicitud a la base de datos falla, intenta con la API
    response = await fetch(`https://api.thedogapi.com/v1/breeds/${idStr}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dog by ID from API');
    }
    return { source: 'api', data: await response.json() };
  } catch (error) {
    throw new Error(error.message);
  }
});

export const fetchDogsByName = createAsyncThunk('dogs/fetchDogsByName', async (name) => {
  try {
    const apiResponse = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${name}`);
    
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();

      // Verifica si necesitamos buscar en la base de datos
      const dbResponse = await fetch(`/dogs?name=${name}`);
      if (!dbResponse.ok) {
        throw new Error('Failed to fetch dogs by name from database');
      }

      const dbData = await dbResponse.json();
      // Combine y elimina duplicados
      const combinedData = [...dbData, ...apiData];
      const uniqueData = combinedData.reduce((acc, dog) => {
        if (!acc.find(d => d.id === dog.id)) {
          acc.push(dog);
        }
        return acc;
      }, []);

      return uniqueData;
    }

    throw new Error('Failed to fetch dogs by name from API');
  } catch (error) {
    throw new Error(error.message);
  }
});

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

// Obtener temperamentos
export const fetchTemperamentsFromApiAndDb = createAsyncThunk('dogs/fetchTemperamentsFromApiAndDb', async () => {
  try {
    // Fetch temperaments from API
    const apiResponse = await fetch('https://api.thedogapi.com/v1/temperaments');
    if (!apiResponse.ok) {
      throw new Error('Failed to fetch temperaments from API');
    }
    const apiTemperaments = await apiResponse.json();

    // Fetch temperaments from database
    const dbResponse = await fetch('/temperaments');
    if (!dbResponse.ok) {
      throw new Error('Failed to fetch temperaments from database');
    }
    const dbTemperaments = await dbResponse.json();

    // Combine and deduplicate temperaments
    const combinedTemperaments = [...dbTemperaments, ...apiTemperaments];
    const uniqueTemperaments = Array.from(new Set(combinedTemperaments.map(temp => temp.id)))
      .map(id => combinedTemperaments.find(temp => temp.id === id));

    return uniqueTemperaments;
  } catch (error) {
    throw new Error(error.message);
  }
});

// Definición del slice
const dogsSlice = createSlice({
  name: 'dogs',
  initialState: {
    dogs: [],
    selectedDog: null,
    temperaments: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dogs = action.payload;
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
        state.selectedDog = action.payload.data;
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
        state.dogs = action.payload;
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
        state.dogs.push(action.payload);
      })
      .addCase(createDog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTemperamentsFromApiAndDb.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTemperamentsFromApiAndDb.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.temperaments = action.payload;
      })
      .addCase(fetchTemperamentsFromApiAndDb.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dogsSlice.reducer;

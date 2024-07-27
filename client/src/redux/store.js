// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import dogsReducer from './slices/dogsSlice';
import temperamentsReducer from './slices/temperamentsSlice';


const store = configureStore({
  reducer: {
    dogs: dogsReducer,
    temperaments: temperamentsReducer,

  },
});

export default store;


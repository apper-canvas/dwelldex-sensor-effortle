import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import propertyReducer from './propertySlice';
import favoriteReducer from './favoriteSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    properties: propertyReducer,
    favorites: favoriteReducer
  }
});

export default store;
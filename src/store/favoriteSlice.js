import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  isLoading: false,
  error: null
};

export const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    addFavorite: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(fav => fav.property_id !== action.payload);
    },
    setFavoriteLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFavoriteError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setFavorites, addFavorite, removeFavorite, setFavoriteLoading, setFavoriteError } = favoriteSlice.actions;
export default favoriteSlice.reducer;
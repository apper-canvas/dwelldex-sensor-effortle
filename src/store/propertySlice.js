import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  filteredProperties: [],
  isLoading: false,
  error: null,
  filters: {
    type: 'all',
    listingType: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any'
  }
};

export const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action) => {
      state.properties = action.payload;
      state.filteredProperties = action.payload;
    },
    setFilteredProperties: (state, action) => {
      state.filteredProperties = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setProperties, setFilteredProperties, setFilters, setLoading, setError } = propertySlice.actions;
export default propertySlice.reducer;
/**
 * Search History Service
 * Handles all operations related to user search history
 */

// Get search history fields that are updateable
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'user_id',
  'location',
  'property_type',
  'price_range',
  'bedrooms',
  'bathrooms',
  'search_date'
];

// Get all search history fields for fetching
const ALL_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy',
  'user_id',
  'location',
  'property_type',
  'price_range',
  'bedrooms',
  'bathrooms',
  'search_date'
];

const TABLE_NAME = 'search_history';

/**
 * Save a search to the user's history
 * @param {string} userId - The user's ID
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Object>} - Created search history object
 */
export const saveSearch = async (userId, searchParams) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [
        {
          Name: `Search-${searchParams.location}-${new Date().toISOString()}`,
          user_id: userId,
          location: searchParams.location,
          property_type: searchParams.propertyType || 'any',
          price_range: searchParams.priceRange || 'any',
          bedrooms: searchParams.bedrooms || 'any',
          bathrooms: searchParams.bathrooms || 'any',
          search_date: new Date().toISOString()
        }
      ]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error('Failed to save search history');
    }
    
    // Return the first result's data if successful
    if (response.results && response.results.length > 0 && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error('Create operation did not return valid data');
  } catch (error) {
    console.error(`Error saving search for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetch user's search history
 * @param {string} userId - The user's ID
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} - Array of search history items
 */
export const fetchSearchHistory = async (userId, limit = 5) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: ALL_FIELDS,
      where: [
        {
          fieldName: 'user_id',
          operator: 'ExactMatch',
          values: [userId]
        }
      ],
      orderBy: [{ fieldName: 'search_date', SortType: 'DESC' }],
      pagingInfo: { limit }
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching search history for user ${userId}:`, error);
    throw error;
  }
};

export default {
  saveSearch,
  fetchSearchHistory
};
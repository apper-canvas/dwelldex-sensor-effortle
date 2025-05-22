/**
 * Favorite Service
 * Handles all operations related to user favorites
 */

// Get favorite fields that are updateable
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'property_id',
  'user_id'
];

// Get all favorite fields for fetching
const ALL_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy',
  'property_id',
  'user_id'
];

const TABLE_NAME = 'user_favorite';

/**
 * Fetch all favorites for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of user favorites
 */
export const fetchUserFavorites = async (userId) => {
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
      ]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching favorites for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Add a property to user favorites
 * @param {string} userId - The user's ID
 * @param {string} propertyId - The property's ID
 * @returns {Promise<Object>} - Created favorite object
 */
export const addFavorite = async (userId, propertyId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [
        {
          Name: `Favorite-${userId}-${propertyId}`,
          property_id: propertyId,
          user_id: userId
        }
      ]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error('Failed to add favorite');
    }
    
    // Return the first result's data if successful
    if (response.results && response.results.length > 0 && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error('Create operation did not return valid data');
  } catch (error) {
    console.error(`Error adding favorite for user ${userId}, property ${propertyId}:`, error);
    throw error;
  }
};

/**
 * Remove a property from user favorites
 * @param {string} favoriteId - The favorite's ID
 * @returns {Promise<boolean>} - Success status
 */
export const removeFavorite = async (favoriteId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [favoriteId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error removing favorite ${favoriteId}:`, error);
    throw error;
  }
};

export default {
  fetchUserFavorites,
  addFavorite,
  removeFavorite
};
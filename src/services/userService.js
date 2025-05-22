/**
 * User Service
 * Handles all user-related operations with the Apper backend
 */

// Get user fields that are updateable
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'email',
  'preferences'
];

// Get all user fields for fetching
const ALL_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy',
  'email',
  'preferences'
];

const TABLE_NAME = 'User1';

/**
 * Get current user details
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User object
 */
export const getUserDetails = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: ALL_FIELDS
    };
    
    const response = await client.getRecordById(TABLE_NAME, userId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Update user preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - User preferences to update
 * @returns {Promise<Object>} - Updated user object
 */
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include updateable fields
    const params = {
      records: [
        {
          Id: userId,
          preferences: JSON.stringify(preferences)
        }
      ]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error('Failed to update user preferences');
    }
    
    // Return the first result's data if successful
    if (response.results && response.results.length > 0 && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error('Update operation did not return valid data');
  } catch (error) {
    console.error(`Error updating user preferences for ID ${userId}:`, error);
    throw error;
  }
};

export default {
  getUserDetails,
  updateUserPreferences
};
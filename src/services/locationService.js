/**
 * Location Service
 * Handles all operations related to locations
 */

// Get location fields that are updateable
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'state',
  'country',
  'is_popular'
];

// Get all location fields for fetching
const ALL_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy',
  'state',
  'country',
  'is_popular'
];

const TABLE_NAME = 'location';

/**
 * Fetch all locations
 * @returns {Promise<Array>} - Array of locations
 */
export const fetchLocations = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: ALL_FIELDS,
      orderBy: [{ fieldName: 'Name', SortType: 'ASC' }]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

/**
 * Fetch popular locations
 * @returns {Promise<Array>} - Array of popular locations
 */
export const fetchPopularLocations = async () => {
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
          fieldName: 'is_popular',
          operator: 'ExactMatch',
          values: [true]
        }
      ],
      orderBy: [{ fieldName: 'Name', SortType: 'ASC' }]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching popular locations:', error);
    throw error;
  }
};

export default {
  fetchLocations,
  fetchPopularLocations
};
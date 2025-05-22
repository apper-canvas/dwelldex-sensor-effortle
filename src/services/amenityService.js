/**
 * Amenity Service
 * Handles all operations related to property amenities
 */

// Get amenity fields that are updateable
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'icon'
];

// Get all amenity fields for fetching
const ALL_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy',
  'icon'
];

const TABLE_NAME = 'amenity';

/**
 * Fetch all amenities
 * @returns {Promise<Array>} - Array of amenities
 */
export const fetchAmenities = async () => {
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
    console.error('Error fetching amenities:', error);
    throw error;
  }
};

/**
 * Get property amenities
 * @param {string} propertyId - The property's ID
 * @returns {Promise<Array>} - Array of property's amenities
 */
export const getPropertyAmenities = async (propertyId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // This is a simplified approach - in a complete implementation, we would 
    // query the property_amenity junction table to get the linked amenities
    // For now, we'll return all amenities as an example
    return await fetchAmenities();
  } catch (error) {
    console.error(`Error fetching amenities for property ${propertyId}:`, error);
    throw error;
  }
};

export default {
  fetchAmenities,
  getPropertyAmenities
};
/**
 * Property Service
 * Handles all property-related operations with the Apper backend
 */

// Get property fields that are updateable
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'title',
  'location',
  'price',
  'bedrooms',
  'bathrooms',
  'area',
  'type',
  'listing_type',
  'image'
];

// Get all property fields for fetching
const ALL_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy',
  'title',
  'location',
  'price',
  'bedrooms',
  'bathrooms',
  'area',
  'type',
  'listing_type',
  'image'
];

const TABLE_NAME = 'property';

/**
 * Fetch all properties with optional filters
 * @param {Object} filters - Optional filter criteria
 * @param {number} limit - Maximum number of records to return
 * @param {number} offset - Starting point for records
 * @returns {Promise<Array>} - Array of properties
 */
export const fetchProperties = async (filters = {}, limit = 20, offset = 0) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Build where conditions based on filters
    const whereConditions = [];
    
    if (filters.type && filters.type !== 'all') {
      whereConditions.push({
        fieldName: 'type',
        operator: 'ExactMatch',
        values: [filters.type]
      });
    }
    
    if (filters.listingType && filters.listingType !== 'all') {
      whereConditions.push({
        fieldName: 'listing_type',
        operator: 'ExactMatch',
        values: [filters.listingType]
      });
    }
    
    if (filters.minPrice) {
      whereConditions.push({
        fieldName: 'price',
        operator: 'GreaterThanOrEqualTo',
        values: [Number(filters.minPrice)]
      });
    }
    
    if (filters.maxPrice) {
      whereConditions.push({
        fieldName: 'price',
        operator: 'LessThanOrEqualTo',
        values: [Number(filters.maxPrice)]
      });
    }
    
    if (filters.bedrooms && filters.bedrooms !== 'any') {
      if (filters.bedrooms === '3+') {
        whereConditions.push({
          fieldName: 'bedrooms',
          operator: 'GreaterThanOrEqualTo',
          values: [3]
        });
      } else {
        whereConditions.push({
          fieldName: 'bedrooms',
          operator: 'ExactMatch',
          values: [Number(filters.bedrooms)]
        });
      }
    }
    
    // Set up query parameters
    const params = {
      fields: ALL_FIELDS,
      where: whereConditions.length > 0 ? whereConditions : undefined,
      orderBy: [
        {
          fieldName: 'CreatedOn',
          SortType: 'DESC'
        }
      ],
      pagingInfo: {
        limit,
        offset
      }
    };

    const response = await client.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

/**
 * Get a single property by ID
 * @param {string} id - Property ID
 * @returns {Promise<Object>} - Property object
 */
export const getPropertyById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: ALL_FIELDS
    };
    
    const response = await client.getRecordById(TABLE_NAME, id, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchProperties,
  getPropertyById
};
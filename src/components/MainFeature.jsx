import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { saveSearch, fetchSearchHistory } from '../services/searchHistoryService';
import { fetchPopularLocations } from '../services/locationService';
import { fetchAmenities } from '../services/amenityService';
import { getIcon } from '../utils/iconUtils';

// Get icons
const SearchIcon = getIcon('search');
const MapPinIcon = getIcon('map-pin');
const HomeIcon = getIcon('home');
const BuildingIcon = getIcon('building-2');
const DollarSignIcon = getIcon('dollar-sign');
const BedDoubleIcon = getIcon('bed-double');
const ShowerHeadIcon = getIcon('shower-head');
const RulerIcon = getIcon('ruler');
const MapIcon = getIcon('map');
const ListIcon = getIcon('list');

// Property search component with interactive features
function MainFeature() {
  // State for search form
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: 'any',
    priceRange: 'any',
    bedrooms: 'any',
    bathrooms: 'any'
  });
  
  const [popularLocations, setPopularLocations] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // State for view mode (list or map)
  const [viewMode, setViewMode] = useState('list');
  
  // State for advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  // Get user from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  // Fetch popular locations on component mount
  useEffect(() => {
    const loadPopularLocations = async () => {
      try {
        const locations = await fetchPopularLocations();
        setPopularLocations(locations.map(loc => loc.Name));
      } catch (err) {
        console.error('Error loading popular locations:', err);
        // Fallback to default locations
        setPopularLocations(['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle']);
      }
    };
    
    loadPopularLocations();
  }, []);
  
  // Fetch amenities on component mount
  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const amenitiesData = await fetchAmenities();
        setAmenities(amenitiesData);
      } catch (err) {
        console.error('Error loading amenities:', err);
      }
    };
    
    loadAmenities();
  }, []);
  
  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!searchParams.location.trim()) {
      toast.error("Please enter a location to search");
      return;
    }

    setIsLoading(true);
    
    try {
      // Save search to history if user is authenticated
      if (isAuthenticated && user) {
        await saveSearch(user.id, searchParams);
      }
      
      // Show success message
      toast.success(`Searching for properties in ${searchParams.location}`);
      
      // In a real app, this would trigger an API call to fetch properties
      // For now, we just log the params
      console.log("Search params:", searchParams);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing search:', err);
      toast.error('Search failed. Please try again.');
      setIsLoading(false);
    }
  };
    
  // Set location from popular searches
  const setLocation = (location) => {
    setSearchParams({...searchParams, location});
    toast.info(`Location set to ${location}`);
  };
  
  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };
  
  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      } 
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft overflow-hidden">
        {/* View Toggle */}
        <div className="flex border-b border-surface-200 dark:border-surface-700">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-4 px-4 flex justify-center items-center space-x-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-primary/10 dark:bg-primary/20 text-primary border-b-2 border-primary'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <ListIcon className="h-5 w-5" />
            <span className="font-medium">List View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 py-4 px-4 flex justify-center items-center space-x-2 transition-colors ${
              viewMode === 'map'
                ? 'bg-primary/10 dark:bg-primary/20 text-primary border-b-2 border-primary'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <MapIcon className="h-5 w-5" />
            <span className="font-medium">Map View</span>
          </button>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="p-6">
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4 mb-4">
            {/* Location Input */}
            <div className="flex-1">
              <label htmlFor="location" className="label flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1 text-primary" />
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={searchParams.location}
                  onChange={handleInputChange}
                  placeholder="City, neighborhood, or address"
                  className="input-field pl-10"
                  required
                  disabled={isLoading}
                />
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" />
              </div>
            </div>
            
            {/* Property Type Select */}
            <div className="w-full md:w-1/3">
              <label htmlFor="propertyType" className="label flex items-center">
                <HomeIcon className="h-4 w-4 mr-1 text-primary" />
                Property Type
              </label>
              <div className="relative">
                <select
                  id="propertyType"
                  name="propertyType"
                  disabled={isLoading}
                  value={searchParams.propertyType}
                  onChange={handleInputChange}
                  className="input-field appearance-none"
                >
                  <option value="any">Any Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
                <BuildingIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Search Button */}
            <div className="w-full md:w-auto">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full px-8 py-3 font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SearchIcon className="h-5 w-5 mr-2" />
                Search
              </motion.button>
              {isLoading && (
                <div className="w-full text-center mt-2 text-surface-500 dark:text-surface-400 text-sm">Processing...</div>
              )}
            </div>
          </div>
          
          {/* Advanced Filters Toggle */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={toggleAdvancedFilters}
              className="text-primary hover:text-primary-dark dark:hover:text-primary-light text-sm font-medium flex items-center"
            >
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
                animate={{ rotate: showAdvancedFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </motion.svg>
            </button>
          </div>
          
          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                  {/* Price Range */}
                  <div>
                    <label htmlFor="priceRange" className="label flex items-center">
                      <DollarSignIcon className="h-4 w-4 mr-1 text-primary" />
                      Price Range
                    </label>
                    <select
                      id="priceRange"
                      name="priceRange"
                      value={searchParams.priceRange}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="any">Any Price</option>
                      <option value="0-100000">Under $100,000</option>
                      <option value="100000-300000">$100,000 - $300,000</option>
                      <option value="300000-500000">$300,000 - $500,000</option>
                      <option value="500000-750000">$500,000 - $750,000</option>
                      <option value="750000-1000000">$750,000 - $1,000,000</option>
                      <option value="1000000+">$1,000,000+</option>
                    </select>
                      disabled={isLoading}
                  </div>
                  
                  {/* Bedrooms */}
                  <div>
                    <label htmlFor="bedrooms" className="label flex items-center">
                      <BedDoubleIcon className="h-4 w-4 mr-1 text-primary" />
                      Bedrooms
                    </label>
                    <select
                      id="bedrooms"
                      name="bedrooms"
                      value={searchParams.bedrooms}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="any">Any</option>
                      <option value="0">Studio</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                      disabled={isLoading}
                  </div>
                  
                  {/* Bathrooms */}
                  <div>
                    <label htmlFor="bathrooms" className="label flex items-center">
                      <ShowerHeadIcon className="h-4 w-4 mr-1 text-primary" />
                      Bathrooms
                    </label>
                    <select
                      id="bathrooms"
                      name="bathrooms"
                      value={searchParams.bathrooms}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="any">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>
                      disabled={isLoading}
                
                {/* Additional Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {/* Checkboxes for amenities */}
                  <label className="flex items-center space-x-2 text-surface-700 dark:text-surface-300">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
                    <span>Air Conditioning</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-surface-700 dark:text-surface-300">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
                    <span>Swimming Pool</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-surface-700 dark:text-surface-300">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
                    <span>Garage</span>
                  <span>Air Conditioning</span>
        
        {/* View Content */}
        <div className="p-6 pt-0">
          {viewMode === 'list' ? (
                  <span>Swimming Pool</span>
              <ListIcon className="h-12 w-12 text-primary mb-4" />
                
                {amenities.slice(0, 2).map(amenity => (
                  <label key={amenity.id} className="flex items-center space-x-2 text-surface-700 dark:text-surface-300">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
                    <span>{amenity.Name}</span>
                  </label>
                ))}
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2">
                Enter a location to see available properties
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                Use the search form above to find properties in your desired area
              </p>
      {/* View Content */}
      <div className="p-6 pt-0">
        {viewMode === 'list' ? (
          <div className="bg-surface-100 dark:bg-surface-700 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <ListIcon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2">
              Enter a location to see available properties
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Use the search form above to find properties in your desired area
            </p>
          </div>
        ) : (
          <div className="bg-surface-100 dark:bg-surface-700 rounded-xl p-4 h-64 flex flex-col items-center justify-center text-center">
            <MapIcon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2">
              Map View
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Enter a location to view properties on the map
            </p>
          </div>
        )}
      </div>
      
      {/* Popular Search Tags */}
      <div className="px-6 pb-6">
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
          Popular searches:
        </p>
        <div className="flex flex-wrap gap-2">
          {popularLocations.map((location, index) => (
            <button 
              key={index}
              onClick={() => setLocation(location)}
              disabled={isLoading}
              className="px-3 py-1 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 rounded-full text-sm text-surface-700 dark:text-surface-300 transition-colors disabled:opacity-50"
            >
              {location}
            </button>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
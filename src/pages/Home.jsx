import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { AuthContext } from '../App';
import { fetchProperties } from '../services/propertyService';
import { fetchUserFavorites, addFavorite, removeFavorite } from '../services/favoriteService';
import { setProperties, setFilteredProperties, setFilters, setLoading, setError } from '../store/propertySlice';

const HomeIcon = getIcon('home');
const BuildingIcon = getIcon('building');
const MenuIcon = getIcon('menu');
const XIcon = getIcon('x');
const SearchIcon = getIcon('search');
const MapPinIcon = getIcon('map-pin');
const HeartIcon = getIcon('heart');
const UserIcon = getIcon('user');
const LogOutIcon = getIcon('log-out');
const ChevronDownIcon = getIcon('chevron-down');

// Variants for animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  const { properties, filteredProperties, isLoading, error, filters } = useSelector((state) => state.properties);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Fetch properties on component mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        dispatch(setLoading(true));
        const data = await fetchProperties();
        dispatch(setProperties(data));
        dispatch(setLoading(false));
      } catch (err) {
        console.error('Error loading properties:', err);
        dispatch(setError(err.message));
        dispatch(setLoading(false));
        toast.error('Failed to load properties. Please try again.');
      }
    };

    loadProperties();
  }, [dispatch]);

  // Fetch user favorites if authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setFavoritesLoading(true);
        const favorites = await fetchUserFavorites(user.id);
        // Extract property IDs from favorites
        const ids = favorites.map(fav => fav.property_id);
        setFavoriteIds(ids);
        setFavoritesLoading(false);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setFavoritesLoading(false);
        toast.error('Failed to load favorites. Please try again.');
      }
    };

    loadFavorites();
  }, [isAuthenticated, user]);

  // Toggle favorite status for a property
  const toggleFavorite = async (id) => {
    if (!isAuthenticated) {
      toast.info("Please log in to save favorites");
      navigate('/login?redirect=/');
      return;
    }
    
    try {
      setFavoritesLoading(true);
      
      if (favoriteIds.includes(id)) {
        // Find the favorite record to remove
        const favorites = await fetchUserFavorites(user.id);
        const favorite = favorites.find(fav => fav.property_id === id);
        
        if (favorite) {
          await removeFavorite(favorite.id);
          setFavoriteIds(favoriteIds.filter(favId => favId !== id));
          toast.info("Removed from favorites");
        }
      } else {
        await addFavorite(user.id, id);
        setFavoriteIds([...favoriteIds, id]);
        toast.success("Added to favorites");
      }
      
      setFavoritesLoading(false);
    } catch (err) {
      console.error('Error updating favorites:', err);
      setFavoritesLoading(false);
      toast.error('Failed to update favorites. Please try again.');
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    
    dispatch(setFilters(newFilters));
    applyFilters(newFilters);
  };

  // Apply filters to properties
  const applyFilters = (currentFilters) => {
    let result = [...properties];
    
    // Filter by property type
    if (currentFilters.type !== 'all') {
      result = result.filter(property => property.type === currentFilters.type);
    }
    
    // Filter by listing type
    if (currentFilters.listingType !== 'all') {
      result = result.filter(property => property.listing_type === currentFilters.listingType);
    }
    
    // Filter by price range
    if (currentFilters.minPrice) {
      result = result.filter(property => property.price >= Number(currentFilters.minPrice));
    }
    
    if (currentFilters.maxPrice) {
      result = result.filter(property => property.price <= Number(currentFilters.maxPrice));
    }
    
    // Filter by bedrooms
    if (currentFilters.bedrooms !== 'any') {
      result = result.filter(property => {
        if (currentFilters.bedrooms === '3+') {
          return property.bedrooms >= 3;
        }
        return property.bedrooms === Number(currentFilters.bedrooms);
      });
    }
    
    dispatch(setFilteredProperties(result));
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      type: 'all',
      listingType: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'any'
    };
    
    dispatch(setFilters(defaultFilters));
    dispatch(setFilteredProperties(properties));
  };

  // Logout handler
  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      toast.error("Logout function not available");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <HomeIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">DwellDex</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light font-medium">Listings</a>
              <a href="#" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light font-medium">Buy</a>
              <a href="#" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light font-medium">Rent</a>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-surface-600 dark:text-surface-300">
                    <UserIcon className="inline-block h-4 w-4 mr-1" />
                    {user?.firstName || 'User'}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline flex items-center">
                    <LogOutIcon className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Post a Listing
                </Link>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white dark:bg-surface-800"
            >
              <div className="px-4 pt-2 pb-4 space-y-4">
                <a href="#" className="block py-2 text-surface-600 hover:text-primary dark:text-surface-300">Listings</a>
                <a href="#" className="block py-2 text-surface-600 hover:text-primary dark:text-surface-300">Buy</a>
                <a href="#" className="block py-2 text-surface-600 hover:text-primary dark:text-surface-300">Rent</a>
                <a href="#" className="block py-2 text-surface-600 hover:text-primary dark:text-surface-300">Agents</a>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="py-2 text-surface-600 dark:text-surface-300">
                      <UserIcon className="inline-block h-4 w-4 mr-1" />
                      {user?.firstName || 'User'}
                    </div>
                    <button onClick={handleLogout} className="w-full btn btn-outline flex items-center justify-center">
                      <LogOutIcon className="h-4 w-4 mr-1" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="w-full btn btn-primary">
                    Post a Listing
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {/* Main Feature Component */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
            <div className="mb-12 text-center">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-surface-900 dark:text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Find Your Perfect Home
              </motion.h1>
              <motion.p 
                className="max-w-2xl mx-auto text-surface-700 dark:text-surface-300 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Browse thousands of properties for sale and rent across the country
              </motion.p>
            </div>
            
            <MainFeature />
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Property Type Filter */}
              <div className="relative">
                <label htmlFor="type" className="label">Property Type</label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="all">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-500 pointer-events-none" />
                </div>
              </div>
              
              {/* Listing Type Filter */}
              <div className="relative">
                <label htmlFor="listingType" className="label">For Sale/Rent</label>
                <div className="relative">
                  <select
                    id="listingType"
                    name="listingType"
                    value={filters.listingType}
                    onChange={handleFilterChange}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="all">All Listings</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-500 pointer-events-none" />
                </div>
              </div>
              
              {/* Price Range Filters */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="minPrice" className="label">Min Price</label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    placeholder="Min $"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="label">Max Price</label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    placeholder="Max $"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="input-field"
                  />
                </div>
              </div>
              
              {/* Bedrooms Filter */}
              <div className="relative">
                <label htmlFor="bedrooms" className="label">Bedrooms</label>
                <div className="relative">
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="any">Any</option>
                    <option value="0">Studio</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3+">3+ Bedrooms</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-500 pointer-events-none" />
                </div>
              </div>
              
              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    type: 'all',
                    listingType: 'all',
                    minPrice: '',
                    maxPrice: '',
                    bedrooms: 'any'
                  })}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </section>
        
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error loading properties</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                {filteredProperties.length} Properties Available
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-surface-600 dark:text-surface-400">Sort by:</span>
                <select className="input-field text-sm py-1">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
            
            {/* Property Cards Grid */}
            {filteredProperties.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredProperties.map((property) => (
                  <motion.div 
                    key={property.id} 
                    className="card overflow-hidden"
                    variants={itemVariants}
                  >
                    {/* Property Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3">
                        <button 
                          onClick={() => toggleFavorite(property.id)}
                          disabled={favoritesLoading}
                          className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors disabled:opacity-50"
                          aria-label={favoriteIds.includes(property.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <HeartIcon 
                            className={`h-5 w-5 ${
                              favoriteIds.includes(property.id) 
                                ? "text-red-500 fill-red-500" 
                                : "text-surface-600"
                            }`} 
                          />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.listing_type === 'sale' 
                            ? 'bg-primary text-white' 
                            : 'bg-secondary text-white'
                        }`}>
                          {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="p-5">
                      <div className="flex items-center text-sm text-surface-500 dark:text-surface-400 mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{property.location}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                        {property.title}
                      </h3>
                      
                      <p className="text-xl font-bold text-primary mb-4">
                        {property.listing_type === 'sale' 
                          ? `$${property.price.toLocaleString()}`
                          : `$${property.price.toLocaleString()}/month`
                        }
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm text-surface-600 dark:text-surface-400">
                        <div className="flex flex-col items-center p-2 bg-surface-100 dark:bg-surface-700 rounded-lg">
                          <span className="font-semibold">{property.bedrooms}</span>
                          <span>Beds</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-surface-100 dark:bg-surface-700 rounded-lg">
                          <span className="font-semibold">{property.bathrooms}</span>
                          <span>Baths</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-surface-100 dark:bg-surface-700 rounded-lg">
                          <span className="font-semibold">{property.area}</span>
                          <span>Sq Ft</span>
                        </div>
                      </div>
                      
                      <div className="mt-5 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <BuildingIcon className="h-5 w-5 text-surface-500 dark:text-surface-400" />
                          <span className="text-sm text-surface-600 dark:text-surface-400 capitalize">
                            {property.type}
                          </span>
                        </div>
                        
                        <button className="btn btn-outline text-sm py-1.5">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <SearchIcon className="mx-auto h-12 w-12 text-surface-400 mb-4" />
                <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-200 mb-2">No properties found</h3>
                <p className="text-surface-600 dark:text-surface-400">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
          </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-800 dark:bg-surface-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <HomeIcon className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-bold text-white">DwellDex</span>
              </div>
              <p className="text-surface-300 mb-4">
                Your trusted platform for finding and listing properties across the country.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-surface-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white transition-colors">Properties</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white transition-colors">Agents</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Property Types</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-surface-300 hover:text-white transition-colors">Houses</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white transition-colors">Apartments</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white transition-colors">Condos</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white transition-colors">Commercial</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-surface-300">
                <li>123 Property Street</li>
                <li>Real Estate City, 10001</li>
                <li>contact@dwelldex.com</li>
                <li>(123) 456-7890</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-surface-700 pt-6 mt-6 text-center text-surface-400 text-sm">
            <p>&copy; {new Date().getFullYear()} DwellDex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
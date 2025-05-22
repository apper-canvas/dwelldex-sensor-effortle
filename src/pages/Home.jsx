import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Get icons
const HomeIcon = getIcon('home');
const BuildingIcon = getIcon('building');
const MenuIcon = getIcon('menu');
const XIcon = getIcon('x');
const SearchIcon = getIcon('search');
const MapPinIcon = getIcon('map-pin');
const HeartIcon = getIcon('heart');
const ChevronDownIcon = getIcon('chevron-down');

// Sample property data
const PROPERTIES = [
  {
    id: 1,
    title: "Modern Apartment with City View",
    location: "Downtown, New York",
    price: 650000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: "apartment",
    listingType: "sale",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "Spacious Family Home",
    location: "Suburbia, California",
    price: 875000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    type: "house",
    listingType: "sale",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "Luxury Downtown Condo",
    location: "Financial District, Chicago",
    price: 3200,
    bedrooms: 1,
    bathrooms: 1,
    area: 950,
    type: "condo",
    listingType: "rent",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "Charming Cottage Near Lake",
    location: "Lake District, Michigan",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: "house",
    listingType: "sale",
    image: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    title: "Modern Studio for Rent",
    location: "Arts District, Portland",
    price: 1500,
    bedrooms: 0,
    bathrooms: 1,
    area: 650,
    type: "apartment",
    listingType: "rent",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    title: "Waterfront Luxury Villa",
    location: "Miami Beach, Florida",
    price: 2500000,
    bedrooms: 5,
    bathrooms: 4.5,
    area: 4200,
    type: "house",
    listingType: "sale",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
];

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState(PROPERTIES);
  const [filters, setFilters] = useState({
    type: 'all',
    listingType: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any'
  });

  // Toggle favorite status for a property
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to favorites");
    }
  };

  // Apply filters
  useEffect(() => {
    let result = PROPERTIES;
    
    // Filter by property type
    if (filters.type !== 'all') {
      result = result.filter(property => property.type === filters.type);
    }
    
    // Filter by listing type
    if (filters.listingType !== 'all') {
      result = result.filter(property => property.listingType === filters.listingType);
    }
    
    // Filter by price range
    if (filters.minPrice) {
      result = result.filter(property => property.price >= Number(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      result = result.filter(property => property.price <= Number(filters.maxPrice));
    }
    
    // Filter by bedrooms
    if (filters.bedrooms !== 'any') {
      result = result.filter(property => {
        if (filters.bedrooms === '3+') {
          return property.bedrooms >= 3;
        }
        return property.bedrooms === Number(filters.bedrooms);
      });
    }
    
    setFilteredProperties(result);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

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
              <a href="#" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light font-medium">Agents</a>
              <button className="btn btn-primary">
                Post a Listing
              </button>
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
                <button className="w-full btn btn-primary">
                  Post a Listing
                </button>
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
        
        {/* Property Listings */}
        <section className="py-12 bg-surface-50 dark:bg-surface-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                          className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                          aria-label={favorites.includes(property.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <HeartIcon 
                            className={`h-5 w-5 ${
                              favorites.includes(property.id) 
                                ? "text-red-500 fill-red-500" 
                                : "text-surface-600"
                            }`} 
                          />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.listingType === 'sale' 
                            ? 'bg-primary text-white' 
                            : 'bg-secondary text-white'
                        }`}>
                          {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
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
                        {property.listingType === 'sale' 
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
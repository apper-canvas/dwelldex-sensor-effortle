import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import { setUser, clearUser } from './store/userSlice';

// Get icons
const SunIcon = getIcon('sun');
const MoonIcon = getIcon('moon');

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login');
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback'].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
      }
    });
  }, []);

  // Update theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.info("You have been logged out.");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-surface-600 dark:text-surface-400">Initializing application...</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <>
        {/* Theme Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          className="fixed bottom-4 right-4 z-50 rounded-full p-3 bg-surface-200 dark:bg-surface-800 shadow-soft text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </motion.button>

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast Configuration */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          toastClassName={() => 
            "relative flex p-4 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer my-3 shadow-card bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100"
          }
        />
      </>
    </AuthContext.Provider>
  );
}

export default App;
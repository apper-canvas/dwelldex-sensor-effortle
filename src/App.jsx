import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Get icons
const SunIcon = getIcon('sun');
const MoonIcon = getIcon('moon');

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

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

  return (
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
  );
}

export default App;
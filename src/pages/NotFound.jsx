import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

// Get icons
const HomeIcon = getIcon('home');
const AlertCircleIcon = getIcon('alert-circle');

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface-50 dark:bg-surface-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-8 text-center"
      >
        <div className="mb-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
          >
            <AlertCircleIcon className="h-10 w-10 text-red-500" />
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-surface-900 dark:text-white mb-3"
        >
          Page Not Found
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-surface-600 dark:text-surface-400 mb-8"
        >
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col space-y-3"
        >
          <Link 
            to="/"
            className="btn btn-primary flex items-center justify-center"
          >
            <HomeIcon className="mr-2 h-5 w-5" />
            Return Home
          </Link>
          
          <a 
            href="mailto:support@dwelldex.com"
            className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light"
          >
            Contact Support
          </a>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center"
      >
        <Link to="/" className="flex items-center text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">
          <HomeIcon className="h-5 w-5 mr-1" />
          <span className="font-medium">DwellDex</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;
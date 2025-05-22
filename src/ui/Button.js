import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable button component with animation
 */
export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) {
  // Base classes
  const baseClasses = 'rounded-lg font-medium transition-all duration-300 focus:outline-none';
  
  // Variant classes
  const variantClasses = {
    primary: 'leather-button',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  };
  
  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-5 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  // Combine classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.medium} ${className}`;
  
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
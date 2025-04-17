import { RISK_LEVELS, RISK_THRESHOLDS } from './constants';

/**
 * Determine risk level based on a probability value
 * @param {number} probability - Risk probability (0-1)
 * @returns {string} Risk level: 'High', 'Medium', or 'Low'
 */
export const getRiskLevel = (probability) => {
  if (probability >= RISK_THRESHOLDS.HIGH) {
    return RISK_LEVELS.HIGH;
  } else if (probability >= RISK_THRESHOLDS.MEDIUM) {
    return RISK_LEVELS.MEDIUM;
  } else {
    return RISK_LEVELS.LOW;
  }
};

/**
 * Format a date string to a more readable format
 * @param {string} dateString - Date string in any format
 * @param {object} options - Formatting options for toLocaleDateString
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Format a timestamp to a readable date and time
 * @param {string} timestamp - Timestamp string
 * @returns {string} Formatted date and time
 */
export const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch (e) {
    return timestamp;
  }
};

/**
 * Convert a number to a fixed decimal format with appropriate rounding
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return Number(value).toFixed(decimals);
};

/**
 * Format a number as a percentage
 * @param {number} value - Number to format (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Create URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {object} params - Object with query parameters
 * @returns {string} URL with query parameters
 */
export const createUrlWithParams = (baseUrl, params) => {
  const url = new URL(baseUrl, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

/**
 * Parse a CSV string to an array of objects
 * @param {string} csvString - CSV data as string
 * @param {string} delimiter - CSV delimiter character
 * @returns {Array} Array of objects with headers as keys
 */
export const parseCSV = (csvString, delimiter = ',') => {
  const lines = csvString.split('\n');
  const headers = lines[0].split(delimiter).map(header => header.trim());
  
  return lines.slice(1).map(line => {
    if (!line.trim()) return null; // Skip empty lines
    
    const values = line.split(delimiter);
    const entry = {};
    
    headers.forEach((header, i) => {
      let value = values[i]?.trim() || '';
      
      // Try to convert to number if possible
      if (!isNaN(value) && value !== '') {
        value = parseFloat(value);
      }
      
      entry[header] = value;
    });
    
    return entry;
  }).filter(entry => entry !== null);
};

/**
 * Download a file from a Blob or URL
 * @param {Blob|string} content - File content or URL
 * @param {string} filename - Name for the downloaded file
 * @param {string} mimeType - MIME type for Blob content
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  let url;
  
  if (typeof content === 'string' && content.startsWith('http')) {
    // If content is a URL
    url = content;
  } else {
    // If content is a Blob or string to be converted to Blob
    const blob = content instanceof Blob 
      ? content 
      : new Blob([content], { type: mimeType });
    url = URL.createObjectURL(blob);
  }
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  if (!(typeof content === 'string' && content.startsWith('http'))) {
    URL.revokeObjectURL(url);
  }
  link.remove();
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, or empty object)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty, false otherwise
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Truncate a string to a maximum length and add ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncateString = (str, maxLength) => {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
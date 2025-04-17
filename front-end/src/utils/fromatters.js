/**
 * Formatters for displaying data in specific formats
 */

/**
 * Format a number to show a specific number of decimal places
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatDecimal = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return Number(value).toFixed(decimals);
  };
  
  /**
   * Format a number as a river level (with meters)
   * @param {number} value - River level value
   * @returns {string} Formatted river level with units
   */
  export const formatRiverLevel = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `${formatDecimal(value, 2)}m`;
  };
  
  /**
   * Format a number as precipitation (with mm)
   * @param {number} value - Precipitation value
   * @returns {string} Formatted precipitation with units
   */
  export const formatPrecipitation = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `${formatDecimal(value, 1)}mm`;
  };
  
  /**
   * Format a number as temperature (with degrees Celsius)
   * @param {number} value - Temperature value
   * @returns {string} Formatted temperature with units
   */
  export const formatTemperature = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `${formatDecimal(value, 1)}°C`;
  };
  
  /**
   * Format a probability as a percentage
   * @param {number} value - Probability value (0-1)
   * @returns {string} Formatted percentage
   */
  export const formatProbability = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `${(value * 100).toFixed(1)}%`;
  };
  
  /**
   * Format a date string to a readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  export const formatDateString = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  /**
   * Format a date and time string to a readable format
   * @param {string} dateTimeString - ISO date and time string
   * @returns {string} Formatted date and time
   */
  export const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateTimeString;
    }
  };
  
  /**
   * Format a timestamp to a relative time (e.g., "2 hours ago")
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Relative time
   */
  export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      
      if (diffSec < 60) {
        return 'just now';
      } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
      } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
      } else if (diffDay < 30) {
        return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
      } else {
        return formatDateString(timestamp);
      }
    } catch (error) {
      return timestamp;
    }
  };
  
  /**
   * Format a duration in days
   * @param {number} days - Number of days
   * @returns {string} Formatted duration
   */
  export const formatDuration = (days) => {
    if (days === null || days === undefined || isNaN(days)) {
      return 'N/A';
    }
    
    if (days < 1) {
      const hours = Math.floor(days * 24);
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(days / 365);
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  };
  
  /**
   * Format a flood status code to a text label
   * @param {number} status - Flood status (0 or 1)
   * @returns {string} Formatted status
   */
  export const formatFloodStatus = (status) => {
    if (status === null || status === undefined) {
      return 'Unknown';
    }
    return status === 1 ? 'Flood' : 'No Flood';
  };
  
  /**
   * Format file size in bytes to human-readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted file size
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
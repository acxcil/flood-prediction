import apiClient from './index';

export const DataService = {
  /**
   * Get historical flood data
   * @param {Object} options - Query options
   * @param {string} [options.region_id] - Optional region ID filter
   * @param {string} [options.start_date] - Optional start date (YYYY-MM-DD)
   * @param {string} [options.end_date] - Optional end date (YYYY-MM-DD)
   * @param {number} [options.days=30] - Number of days to fetch (default: 30)
   * @returns {Promise} Promise with historical data
   */
  getHistoricalData: async (options = {}) => {
    try {
      const { region_id, start_date, end_date, days = 30 } = options;
      
      const params = {};
      if (region_id) params.region_id = region_id;
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      if (days) params.days = days;
      
      const response = await apiClient.get('/data/historical', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get data statistics
   * @returns {Promise} Promise with data statistics
   */
  getDataStats: async () => {
    try {
      const response = await apiClient.get('/data/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export data in CSV or JSON format
   * @param {Object} options - Export options
   * @param {string} [options.format='csv'] - Format: 'csv' or 'json'
   * @param {string} [options.region_id] - Optional region ID filter
   * @returns {Promise} Promise with the exported data
   */
  exportData: async (options = {}) => {
    try {
      const { format = 'csv', region_id } = options;
      
      const params = { format };
      if (region_id) params.region_id = region_id;
      
      const response = await apiClient.get('/data/export', { 
        params,
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download exported data as a file
   * @param {Object} options - Export options
   * @param {string} [options.format='csv'] - Format: 'csv' or 'json'
   * @param {string} [options.region_id] - Optional region ID filter
   * @param {string} [options.filename] - Optional filename
   */
  downloadData: async (options = {}) => {
    try {
      const { format = 'csv', region_id, filename } = options;
      
      const data = await DataService.exportData({ format, region_id });
      
      const defaultFilename = `flood_data_export${region_id ? `_${region_id}` : ''}.${format}`;
      const actualFilename = filename || defaultFilename;
      
      // Create a blob and download it
      if (format === 'csv') {
        // CSV is already a blob
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', actualFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // JSON needs to be converted to a blob
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', actualFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      throw error;
    }
  }
};

export default DataService;
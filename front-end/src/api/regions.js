import apiClient from './index';

export const RegionsService = {
  /**
   * Get all regions with current flood risk status
   * @param {Object} options - Query options
   * @param {string} [options.sort_by] - Optional field to sort by
   * @returns {Promise} Promise with regions data
   */
  getAllRegions: async (options = {}) => {
    try {
      const { sort_by } = options;
      const params = {};
      if (sort_by) params.sort_by = sort_by;
      
      const response = await apiClient.get('/regions', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get detailed information about a specific region
   * @param {string} regionId - Region ID
   * @returns {Promise} Promise with region details
   */
  getRegionById: async (regionId) => {
    try {
      const response = await apiClient.get(`/regions/${regionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Simulate alerts based on a risk threshold
   * @param {number} [threshold=0.7] - Risk threshold (0-1)
   * @returns {Promise} Promise with simulated alerts
   */
  simulateAlerts: async (threshold = 0.7) => {
    try {
      const response = await apiClient.get('/alerts/simulate', {
        params: { threshold }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default RegionsService;
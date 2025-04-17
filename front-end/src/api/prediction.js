import apiClient from './index';

export const PredictionService = {
  /**
   * Make a single flood prediction
   * @param {Object} data - Prediction input data
   * @returns {Promise} Promise with prediction results
   */
  predict: async (data) => {
    try {
      const response = await apiClient.post('/prediction/predict', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make batch predictions
   * @param {Array} data - Array of prediction input objects
   * @returns {Promise} Promise with batch prediction results
   */
  batchPredict: async (data) => {
    try {
      const response = await apiClient.post('/prediction/batch-predict', { data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get risk trend for a region
   * @param {string} regionId - Region ID
   * @param {number} [days=7] - Number of days for trend (default: 7)
   * @returns {Promise} Promise with risk trend data
   */
  getRiskTrend: async (regionId, days = 7) => {
    try {
      const response = await apiClient.get(`/prediction/risk-trend/${regionId}`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get sample prediction input data (for demo purposes)
   * @returns {Object} Sample prediction input
   */
  getSamplePredictionInput: () => {
    return {
      temperature: 15.2,
      precipitation: 5.8,
      snowmelt: 0.0,
      soil_moisture: 68.5,
      river_level: 3.2,
      days_since_precip: 1.0,
      precip_3d: 12.5,
      precip_7d: 28.7,
      precip_14d: 42.3,
      river_level_change: 0.8,
      region: "Batken_Area",
      basin: "Ferghana",
      elevation_range: "medium",
      month: new Date().getMonth() + 1 // Current month
    };
  }
};

export default PredictionService;
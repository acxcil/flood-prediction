import apiClient from './index';

export const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} [userData.preferred_region] - Optional preferred region for alerts
   * @returns {Promise} Promise with the response data
   */
  signUp: async (userData) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login a user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Password
   * @returns {Promise} Promise with the token data
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { access_token, token_type } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('flood_prediction_token', access_token);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('flood_prediction_token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('flood_prediction_token');
  }
};

export default AuthService;
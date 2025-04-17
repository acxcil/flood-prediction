import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

// Create auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('flood_prediction_token');
        if (token) {
          // Decode the JWT token to get the user info
          try {
            const decoded = jwtDecode(token);
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
              // Token is expired, logout
              logout();
              return;
            }
            
            // Set user data from token
            setCurrentUser({
              username: decoded.sub,
              exp: decoded.exp
            });
          } catch (error) {
            console.error('Invalid token:', error);
            logout();
          }
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.login(credentials);
      // Decode token to get user info
      const decoded = jwtDecode(data.access_token);
      setCurrentUser({
        username: decoded.sub,
        exp: decoded.exp
      });
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  // Signup function
  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.signUp(userData);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
      setLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
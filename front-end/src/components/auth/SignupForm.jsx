import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Link,
  MenuItem,
  FormHelperText,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PersonAdd as SignupIcon } from '@mui/icons-material';
import { RegionsService } from '../../api/regions';
import { useAuth } from '../../contexts/AuthContext';
import { VALIDATION_PATTERNS } from '../../utils/constants';

/**
 * Signup form component for user registration
 */
const SignupForm = ({ onSuccess, redirectTo }) => {
  const { signup } = useAuth();
  
  // State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferred_region: ''
  });
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Fetch regions for dropdown
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setRegionsLoading(true);
        const data = await RegionsService.getAllRegions();
        setRegions(data || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      } finally {
        setRegionsLoading(false);
      }
    };

    fetchRegions();
  }, []);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!VALIDATION_PATTERNS.USERNAME.test(formData.username)) {
      errors.username = 'Username must be 3-20 characters and can contain letters, numbers, and underscores';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!VALIDATION_PATTERNS.EMAIL.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!VALIDATION_PATTERNS.PASSWORD.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Call signup function from auth context
      await signup({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        preferred_region: formData.preferred_region || null
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(redirectTo);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign up to receive personalized flood alerts
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              error={!!validationErrors.username}
              helperText={validationErrors.username}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              name="preferred_region"
              label="Preferred Region for Alerts"
              id="preferred_region"
              value={formData.preferred_region}
              onChange={handleChange}
              disabled={loading || regionsLoading}
              SelectProps={{
                MenuProps: {
                  sx: { maxHeight: 300 }
                }
              }}
            >
              <MenuItem value="">
                <em>None (All regions)</em>
              </MenuItem>
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </TextField>
            <FormHelperText>
              Select a region to receive targeted alerts (optional)
            </FormHelperText>
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SignupIcon />}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default SignupForm;
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { PredictionService } from '../../api/prediction';

/**
 * Form component for single flood risk prediction
 */
const PredictionForm = ({ onSubmit, loading, regions }) => {
  const [formData, setFormData] = useState({
    temperature: '',
    precipitation: '',
    snowmelt: '',
    soil_moisture: '',
    river_level: '',
    days_since_precip: '',
    precip_3d: '',
    precip_7d: '',
    precip_14d: '',
    river_level_change: '',
    region: '',
    basin: '',
    elevation_range: '',
    month: new Date().getMonth() + 1 // Current month
  });

  // Basins and elevation ranges (usually these would come from API)
  const basins = ['Ferghana', 'Syr Darya', 'Amu Darya', 'Chu', 'Talas', 'Ili'];
  const elevationRanges = ['low', 'medium', 'high'];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string values to numbers
    const numericData = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'region' && key !== 'basin' && key !== 'elevation_range') {
        numericData[key] = value === '' ? 0 : Number(value);
      } else {
        numericData[key] = value;
      }
    });
    
    onSubmit(numericData);
  };

  // Load sample data
  const loadSampleData = () => {
    const sampleData = PredictionService.getSamplePredictionInput();
    setFormData(sampleData);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Flood Risk Prediction Form</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadSampleData}
          variant="outlined"
          size="small"
        >
          Load Sample Data
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Region information */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Region"
              name="region"
              select
              value={formData.region}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.name}>
                  {region.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Basin"
              name="basin"
              select
              value={formData.basin}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {basins.map((basin) => (
                <MenuItem key={basin} value={basin}>
                  {basin}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Elevation Range"
              name="elevation_range"
              select
              value={formData.elevation_range}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {elevationRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Month"
              name="month"
              type="number"
              value={formData.month}
              onChange={handleChange}
              required
              inputProps={{ min: 1, max: 12 }}
              disabled={loading}
            />
          </Grid>

          {/* Hydrological Data */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Hydrological Data
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Current River Level (m)"
              name="river_level"
              type="number"
              value={formData.river_level}
              onChange={handleChange}
              required
              inputProps={{ step: 0.01 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="River Level Change (m)"
              name="river_level_change"
              type="number"
              value={formData.river_level_change}
              onChange={handleChange}
              required
              inputProps={{ step: 0.01 }}
              disabled={loading}
              helperText="Change in last 24h"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Soil Moisture (%)"
              name="soil_moisture"
              type="number"
              value={formData.soil_moisture}
              onChange={handleChange}
              required
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              disabled={loading}
            />
          </Grid>

          {/* Weather Data */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Weather Data
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Temperature (°C)"
              name="temperature"
              type="number"
              value={formData.temperature}
              onChange={handleChange}
              required
              inputProps={{ step: 0.1 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Current Precipitation (mm)"
              name="precipitation"
              type="number"
              value={formData.precipitation}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.1 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Snowmelt (mm)"
              name="snowmelt"
              type="number"
              value={formData.snowmelt}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.1 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Days Since Precipitation"
              name="days_since_precip"
              type="number"
              value={formData.days_since_precip}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.1 }}
              disabled={loading}
            />
          </Grid>

          {/* Historical Precipitation */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="3-Day Precipitation (mm)"
              name="precip_3d"
              type="number"
              value={formData.precip_3d}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.1 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="7-Day Precipitation (mm)"
              name="precip_7d"
              type="number"
              value={formData.precip_7d}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.1 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="14-Day Precipitation (mm)"
              name="precip_14d"
              type="number"
              value={formData.precip_14d}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.1 }}
              disabled={loading}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={loading}
                size="large"
              >
                {loading ? 'Predicting...' : 'Make Prediction'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PredictionForm;
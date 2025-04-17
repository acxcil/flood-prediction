import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  MenuItem, 
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { Send as SendIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { PredictionService } from '../api/prediction';
import { RegionsService } from '../api/regions';
import { useAlert } from '../contexts/AlertContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Result card component
const ResultCard = ({ result, isLoading }) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!result) {
    return null;
  }

  // Determine risk color
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High':
        return theme.palette.error.main;
      case 'Medium':
        return theme.palette.warning.main;
      case 'Low':
      default:
        return theme.palette.success.main;
    }
  };

  // Format prediction result data for chart
  const chartData = [
    { name: 'Flood Risk', value: result.probability, color: getRiskColor(result.risk_level) },
    { name: 'Safe', value: 1 - result.probability, color: theme.palette.grey[300] }
  ];

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Prediction Result
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: '50%',
                  width: 150,
                  height: 150,
                  backgroundColor: `${getRiskColor(result.risk_level)}20`,
                  mb: 2,
                  mx: 'auto'
                }}
              >
                <Typography variant="h4" sx={{ color: getRiskColor(result.risk_level), fontWeight: 'bold' }}>
                  {(result.probability * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ color: getRiskColor(result.risk_level), fontWeight: 'bold' }}>
                  {result.risk_level} Risk
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Flood Prediction: <strong>{result.prediction === 1 ? 'Yes' : 'No'}</strong>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${(value * 100).toFixed(1)}%`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Key Features
            </Typography>
            <Box sx={{ mt: 1 }}>
              {result.features_used && result.features_used.slice(0, 5).map((feature) => (
                <Box key={feature} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {feature.replace(/_/g, ' ')}:
                  </Typography>
                </Box>
              ))}
              {result.features_used && result.features_used.length > 5 && (
                <Typography variant="body2" color="text.secondary">
                  And {result.features_used.length - 5} more features...
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Prediction Form Component
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

// Main Prediction Page
const PredictionPage = () => {
  const [tab, setTab] = useState('single');
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showAlert } = useAlert();

  // Fetch regions for dropdown
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setRegionsLoading(true);
        const data = await RegionsService.getAllRegions();
        setRegions(data || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
        showAlert('Failed to load regions', 'error');
      } finally {
        setRegionsLoading(false);
      }
    };

    fetchRegions();
  }, [showAlert]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setPredictionResult(null);
    setError('');
  };

  // Handle form submit
  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      const result = await PredictionService.predict(data);
      setPredictionResult(result);
      
      // Show appropriate alert based on risk level
      if (result.risk_level === 'High') {
        showAlert(`High flood risk detected! (${(result.probability * 100).toFixed(1)}%)`, 'error');
      } else if (result.risk_level === 'Medium') {
        showAlert(`Medium flood risk detected (${(result.probability * 100).toFixed(1)}%)`, 'warning');
      } else {
        showAlert(`Low flood risk (${(result.probability * 100).toFixed(1)}%)`, 'success');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setError(error.response?.data?.error || 'Failed to make prediction');
      showAlert('Prediction failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flood Risk Prediction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Predict flood risk by entering environmental and hydrological data
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="prediction tabs"
          >
            <Tab label="Single Prediction" value="single" />
            <Tab label="Batch Prediction" value="batch" disabled />
          </Tabs>
        </Box>

        <TabPanel value="single" sx={{ p: 0 }}>
          <PredictionForm
            onSubmit={handleSubmit}
            loading={loading || regionsLoading}
            regions={regions}
          />
          <ResultCard result={predictionResult} isLoading={loading} />
        </TabPanel>

        <TabPanel value="batch" sx={{ p: 0 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Batch Prediction
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This feature will be available in a future update. It will allow you to upload a CSV file with multiple prediction requests.
            </Typography>
          </Paper>
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default PredictionPage;
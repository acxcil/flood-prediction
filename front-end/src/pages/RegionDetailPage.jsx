import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  CircularProgress,
  useTheme,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  Insights as InsightsIcon,
  CloudDownload as DownloadIcon,
  Notifications as AlertIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { RegionsService } from '../api/regions';
import { PredictionService } from '../api/prediction';
import { DataService } from '../api/data';
import Loading from '../components/common/Loading';
import { useAlert } from '../contexts/AlertContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RegionDetailPage = () => {
  const { regionId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  // State
  const [region, setRegion] = useState(null);
  const [riskTrend, setRiskTrend] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [historicalLoading, setHistoricalLoading] = useState(true);
  
  // Fetch region details
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        setLoading(true);
        const regionData = await RegionsService.getRegionById(regionId);
        setRegion(regionData);
      } catch (error) {
        console.error('Error fetching region details:', error);
        showAlert('Failed to load region data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, [regionId, showAlert]);
  
  // Fetch risk trend data
  useEffect(() => {
    const fetchRiskTrend = async () => {
      try {
        setTrendLoading(true);
        const trendData = await PredictionService.getRiskTrend(regionId, 10);
        setRiskTrend(trendData);
      } catch (error) {
        console.error('Error fetching risk trend:', error);
        showAlert('Failed to load risk trend data', 'error');
      } finally {
        setTrendLoading(false);
      }
    };

    fetchRiskTrend();
  }, [regionId, showAlert]);
  
  // Fetch historical data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setHistoricalLoading(true);
        const data = await DataService.getHistoricalData({
          region_id: regionId,
          days: 30
        });
        setHistoricalData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        showAlert('Failed to load historical data', 'error');
      } finally {
        setHistoricalLoading(false);
      }
    };

    fetchHistoricalData();
  }, [regionId, showAlert]);
  
  // Format risk trend data for chart
  const formatRiskTrendData = () => {
    if (!riskTrend) return [];
    
    return riskTrend.dates.map((date, index) => ({
      date,
      probability: riskTrend.probabilities[index],
      risk_level: riskTrend.risk_levels[index]
    }));
  };
  
  // Format historical data for chart
  const formatHistoricalData = () => {
    if (!historicalData || historicalData.length === 0) return [];
    
    return historicalData.map((item) => ({
      date: item.date,
      river_level: item.river_level,
      precipitation: item.precipitation,
      temperature: item.temperature
    }));
  };
  
  // Get color for risk level
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High':
        return theme.palette.error.main;
      case 'Medium':
        return theme.palette.warning.main;
      case 'Low':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/regions');
  };
  
  // Download data for this region
  const handleDownload = async () => {
    try {
      await DataService.downloadData({
        format: 'csv',
        region_id: regionId,
        filename: `${region?.name.replace(/\s+/g, '_')}_data.csv`
      });
      showAlert('Data download started', 'success');
    } catch (error) {
      console.error('Error downloading data:', error);
      showAlert('Failed to download data', 'error');
    }
  };
  
  // Calculate risk ratio and percentage
  const getRiskPercentage = () => {
    if (!region) return 0;
    return Math.min((region.current_river_level / region.flood_threshold) * 100, 100);
  };
  
  return (
    <Container maxWidth="xl">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }} aria-label="breadcrumb">
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/regions" underline="hover" color="inherit">
          Regions
        </Link>
        <Typography color="text.primary">{region?.name || 'Region Details'}</Typography>
      </Breadcrumbs>
      
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1">
          {loading ? 'Loading...' : region?.name}
        </Typography>
      </Box>
      
      {loading ? (
        <Loading message="Loading region details..." />
      ) : (
        <>
          {/* Region summary card */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Region Information
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Basin
                  </Typography>
                  <Typography variant="body1">
                    {region.basin}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Elevation Range
                  </Typography>
                  <Typography variant="body1">
                    {region.elevation_range}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Coordinates
                  </Typography>
                  <Typography variant="body1">
                    {region.coordinates.lat.toFixed(4)}, {region.coordinates.lon.toFixed(4)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Current Status
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    Risk Level:
                  </Typography>
                  <Chip 
                    label={region.risk_level} 
                    sx={{ 
                      bgcolor: `${getRiskColor(region.risk_level)}20`,
                      color: getRiskColor(region.risk_level),
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      Current Level: {region.current_river_level.toFixed(2)}m
                    </Typography>
                    <Typography variant="body2">
                      Threshold: {region.flood_threshold.toFixed(2)}m
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      height: 8, 
                      width: '100%', 
                      bgcolor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                      borderRadius: 5,
                      overflow: 'hidden',
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${getRiskPercentage()}%`,
                        bgcolor: getRiskColor(region.risk_level),
                        borderRadius: 5,
                        transition: 'width 1s ease-in-out'
                      }}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    {getRiskPercentage().toFixed(1)}% of flood threshold
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                  >
                    Download Data
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<AlertIcon />}
                  >
                    Subscribe to Alerts
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Risk trend chart */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Flood Risk Trend
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Recent flood risk probability trend for this region
              </Typography>
              
              {trendLoading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : !riskTrend ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No risk trend data available
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={formatRiskTrendData()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      domain={[0, 1]} 
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
                    />
                    <Tooltip 
                      formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Risk Probability']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="probability"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Historical data chart */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historical Data
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Historical river levels, precipitation and temperature
              </Typography>
              
              {historicalLoading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : historicalData.length === 0 ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No historical data available
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={formatHistoricalData()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="river_level"
                      name="River Level (m)"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="precipitation"
                      name="Precipitation (mm)"
                      stroke={theme.palette.info.main}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature (°C)"
                      stroke={theme.palette.warning.main}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default RegionDetailPage;
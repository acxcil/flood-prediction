import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  Container,
  Button,
  useTheme
} from '@mui/material';

// Components
import DashboardSummary from '../components/dashboard/DashboardSummary';
import FloodRiskMap from '../components/dashboard/FloodRiskMap';
import RegionRiskCard from '../components/dashboard/RegionRiskCard';
import RiskDistributionChart from '../components/dashboard/RiskDistributionChart';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import Loading from '../components/common/Loading';

// API Services
import { RegionsService } from '../api/regions';
import { DataService } from '../api/data';
import { useAlert } from '../contexts/AlertContext';

const Dashboard = () => {
  const theme = useTheme();
  const { showAlert } = useAlert();
  
  // State
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch regions data
        const regionsData = await RegionsService.getAllRegions();
        setRegions(regionsData);
        
        // Calculate dashboard stats from regions data
        const highRiskRegions = regionsData.filter(r => r.risk_level === 'High').length;
        const avgRiverLevel = regionsData.reduce((sum, r) => sum + r.current_river_level, 0) / regionsData.length;
        
        // In a real app, you'd fetch this from the backend
        // For demo, we'll use mock data
        const statsData = {
          high_risk_regions: highRiskRegions,
          total_regions: regionsData.length,
          avg_river_level: avgRiverLevel,
          avg_temperature: 18.5, // Mock data
        };
        
        setDashboardStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showAlert('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showAlert]);

  // Get top high risk regions
  const getHighRiskRegions = () => {
    if (!regions) return [];
    return regions
      .filter(region => region.risk_level === 'High')
      .sort((a, b) => b.current_river_level / b.flood_threshold - a.current_river_level / a.flood_threshold)
      .slice(0, 3);
  };

  const highRiskRegions = getHighRiskRegions();

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flood Prediction Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of current flood risks and regional status
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <DashboardSummary data={dashboardStats} loading={loading} />
      </Box>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Map Section */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ height: '100%', minHeight: 500 }}>
            <FloodRiskMap />
          </Box>
        </Grid>
        
        {/* Risk Distribution */}
        <Grid item xs={12} sm={6} lg={4}>
          <RiskDistributionChart data={regions} loading={loading} />
        </Grid>
        
        {/* Recent Alerts */}
        <Grid item xs={12} sm={6} lg={4}>
          <RecentAlerts />
        </Grid>
        
        {/* High Risk Regions */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Highest Risk Regions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Regions currently experiencing the highest flood risk
            </Typography>
            
            {loading ? (
              <Loading message="Loading high risk regions..." />
            ) : highRiskRegions.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No high risk regions detected
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {highRiskRegions.map((region) => (
                  <Grid item xs={12} md={4} key={region.id}>
                    <RegionRiskCard region={region} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
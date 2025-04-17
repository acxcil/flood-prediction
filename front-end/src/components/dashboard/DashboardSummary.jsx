import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme, 
  LinearProgress,
  CircularProgress 
} from '@mui/material';
import {
  Warning as WarningIcon,
  WaterDrop as WaterIcon,
  Thermostat as TemperatureIcon,
  Public as RegionIcon
} from '@mui/icons-material';

const SummaryCard = ({ title, value, icon, color, loading, subtitle, progress }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={24} sx={{ mt: 1 }} />
            ) : (
              <Typography variant="h4" fontWeight="bold">
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}33`, // Add transparency to color
              borderRadius: '50%',
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {progress !== undefined && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: color,
                }
              }} 
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardSummary = ({ data, loading }) => {
  const theme = useTheme();

  // Default values if data is not available
  const {
    high_risk_regions = 0,
    total_regions = 0,
    avg_river_level = 0,
    avg_temperature = 0,
  } = data || {};

  // Calculate high risk percentage
  const highRiskPercentage = total_regions > 0 ? (high_risk_regions / total_regions) * 100 : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="High Risk Regions"
          value={loading ? '-' : high_risk_regions}
          subtitle={loading ? '' : `${highRiskPercentage.toFixed(1)}% of total regions`}
          icon={<WarningIcon sx={{ color: theme.palette.error.main }} />}
          color={theme.palette.error.main}
          loading={loading}
          progress={highRiskPercentage}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Average River Level"
          value={loading ? '-' : `${avg_river_level.toFixed(1)}m`}
          icon={<WaterIcon sx={{ color: theme.palette.info.main }} />}
          color={theme.palette.info.main}
          loading={loading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Average Temperature"
          value={loading ? '-' : `${avg_temperature.toFixed(1)}°C`}
          icon={<TemperatureIcon sx={{ color: theme.palette.warning.main }} />}
          color={theme.palette.warning.main}
          loading={loading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Monitored Regions"
          value={loading ? '-' : total_regions}
          icon={<RegionIcon sx={{ color: theme.palette.success.main }} />}
          color={theme.palette.success.main}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardSummary;
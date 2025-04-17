import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  Notifications as AlertIcon,
  LocationOn as LocationIcon,
  WaterDrop as WaterIcon,
  Terrain as TerrainIcon
} from '@mui/icons-material';
import { formatDecimal, formatRiverLevel } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

/**
 * Component to display detailed information about a region
 */
const RegionDetails = ({ region, loading, onDownload, onSubscribe }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!region) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Region not found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The requested region could not be found or loaded
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/regions')}
        >
          View All Regions
        </Button>
      </Paper>
    );
  }
  
  // Determine risk color
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
  
  // Calculate risk ratio and percentage
  const riskRatio = region.current_river_level / region.flood_threshold;
  const riskPercentage = Math.min(riskRatio * 100, 100);
  
  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Region information */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Region Information
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  color: theme.palette.text.secondary
                }}
              >
                <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Coordinates: {formatDecimal(region.coordinates.lat, 4)}, {formatDecimal(region.coordinates.lon, 4)}
                </Typography>
              </Box>
            </Box>
            
            <Chip 
              label={region.risk_level} 
              size="medium"
              sx={{ 
                bgcolor: `${getRiskColor(region.risk_level)}20`,
                color: getRiskColor(region.risk_level),
                fontWeight: 'bold',
                fontSize: '0.9rem',
                py: 0.5
              }} 
            />
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Basin
              </Typography>
              <Typography variant="body1">
                {region.basin}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Elevation Range
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <TerrainIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                {region.elevation_range}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        
        {/* River level information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Current Status
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">
                Current Level: {formatRiverLevel(region.current_river_level)}
              </Typography>
              <Typography variant="body2">
                Threshold: {formatRiverLevel(region.flood_threshold)}
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                height: 10, 
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
                  width: `${riskPercentage}%`,
                  bgcolor: getRiskColor(region.risk_level),
                  borderRadius: 5,
                  transition: 'width 1s ease-in-out'
                }}
              />
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {riskPercentage.toFixed(1)}% of flood threshold
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onDownload}
            >
              Download Data
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<AlertIcon />}
              onClick={onSubscribe}
            >
              Subscribe to Alerts
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RegionDetails;
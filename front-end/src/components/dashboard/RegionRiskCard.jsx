import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  LinearProgress, 
  useTheme, 
  IconButton 
} from '@mui/material';
import { MoreVert as MoreIcon, NavigateNext as NavigateIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Card displaying information about a region with its flood risk level
 */
const RegionRiskCard = ({ region }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  if (!region) return null;
  
  // Calculate risk ratio (current level / threshold)
  const riskRatio = region.current_river_level / region.flood_threshold;
  const riskPercentage = Math.min(riskRatio * 100, 100);
  
  // Determine color based on risk level
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
  
  const riskColor = getRiskColor(region.risk_level);
  
  // Navigate to region details
  const handleViewDetails = () => {
    navigate(`/regions/${region.id}`);
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        },
        position: 'relative'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div">
            {region.name}
          </Typography>
          <Chip 
            label={region.risk_level} 
            size="small"
            sx={{ 
              bgcolor: `${riskColor}20`,
              color: riskColor,
              fontWeight: 'bold'
            }} 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Basin: {region.basin}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">
              Current Level: {region.current_river_level.toFixed(2)}m
            </Typography>
            <Typography variant="body2">
              Threshold: {region.flood_threshold.toFixed(2)}m
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={riskPercentage}
            sx={{
              height: 8,
              borderRadius: 5,
              bgcolor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                bgcolor: riskColor
              }
            }}
          />
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            color="primary"
            sx={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            onClick={handleViewDetails}
          >
            View Details
            <NavigateIcon fontSize="small" />
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegionRiskCard;
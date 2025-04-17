import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Divider,
  Chip,
  Paper,
  useTheme
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatDecimal, formatPercent } from '../../utils/formatters';

/**
 * Component to display flood prediction results
 */
const PredictionResults = ({ result, isLoading, isBatch = false }) => {
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

  // Single prediction result display
  if (!isBatch) {
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
                    {formatPercent(result.probability)}
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
                    formatter={(value) => formatPercent(value)}
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
                      {feature.replace(/_/g, ' ')}
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
  }

  // Batch prediction results display
  const { predictions, summary } = result;
  
  // Prepare summary chart data
  const summaryChartData = [
    { name: 'High Risk', value: summary.risk_levels.high, color: theme.palette.error.main },
    { name: 'Medium Risk', value: summary.risk_levels.medium, color: theme.palette.warning.main },
    { name: 'Low Risk', value: summary.risk_levels.low, color: theme.palette.success.main },
  ];

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Batch Prediction Results
        </Typography>
        
        {/* Summary */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Total predictions: <strong>{summary.count}</strong>
                </Typography>
                <Typography variant="body2">
                  Predicted floods: <strong>{summary.flood_count}</strong> ({formatPercent(summary.flood_percentage / 100)})
                </Typography>
                <Typography variant="body2">
                  Average flood probability: <strong>{formatPercent(summary.avg_probability)}</strong>
                </Typography>
                <Typography variant="body2">
                  Maximum flood probability: <strong>{formatPercent(summary.max_probability)}</strong>
                </Typography>
              </Box>
              
              <Typography variant="body2" gutterBottom>
                Risk distribution:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`High: ${summary.risk_levels.high}`} 
                  size="small"
                  sx={{ bgcolor: `${theme.palette.error.main}20`, color: theme.palette.error.main }}
                />
                <Chip 
                  label={`Medium: ${summary.risk_levels.medium}`} 
                  size="small"
                  sx={{ bgcolor: `${theme.palette.warning.main}20`, color: theme.palette.warning.main }}
                />
                <Chip 
                  label={`Low: ${summary.risk_levels.low}`} 
                  size="small"
                  sx={{ bgcolor: `${theme.palette.success.main}20`, color: theme.palette.success.main }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={summaryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {summaryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Preview of top high risk predictions */}
        <Typography variant="subtitle1" gutterBottom>
          Top High Risk Predictions
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 650 }}>
            <Box sx={{ display: 'flex', fontWeight: 'bold', p: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ flex: 2 }}>Region</Box>
              <Box sx={{ flex: 1 }}>Basin</Box>
              <Box sx={{ flex: 1 }}>Risk</Box>
              <Box sx={{ flex: 1 }}>Probability</Box>
              <Box sx={{ flex: 1 }}>Prediction</Box>
            </Box>
            {predictions
              .sort((a, b) => b.probability - a.probability)
              .slice(0, 5)
              .map((pred, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    p: 1,
                    '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
                    borderLeft: 3,
                    borderColor: getRiskColor(pred.risk_level)
                  }}
                >
                  <Box sx={{ flex: 2 }}>{pred.input_data?.region || 'N/A'}</Box>
                  <Box sx={{ flex: 1 }}>{pred.input_data?.basin || 'N/A'}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Chip 
                      label={pred.risk_level} 
                      size="small"
                      sx={{ 
                        bgcolor: `${getRiskColor(pred.risk_level)}20`,
                        color: getRiskColor(pred.risk_level),
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>{formatPercent(pred.probability)}</Box>
                  <Box sx={{ flex: 1 }}>{pred.prediction === 1 ? 'Flood' : 'No Flood'}</Box>
                </Box>
              ))}
          </Box>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Showing top 5 of {predictions.length} predictions
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PredictionResults;
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Box,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatDecimal, formatPercent } from '../../utils/formatters';

/**
 * Component to display statistics and visualizations about flood data
 */
const DataStatistics = ({ data, loading, error }) => {
  const theme = useTheme();
  
  // Helper to format month names for the chart
  const getMonthName = (monthIndex) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex - 1] || `Month ${monthIndex}`;
  };
  
  // Prepare monthly data for charts
  const prepareMonthlyData = () => {
    if (!data || !data.time_series || !data.time_series.months) {
      return [];
    }
    
    return data.time_series.months.map((month, index) => ({
      month: getMonthName(month),
      floodCount: data.time_series.flood_counts[index],
      totalCount: data.time_series.total_counts[index],
      floodRatio: data.time_series.flood_counts[index] / data.time_series.total_counts[index]
    }));
  };
  
  // Prepare data for pie chart
  const preparePieData = () => {
    if (!data || !data.overall_stats) {
      return [];
    }
    
    return [
      { 
        name: 'Flood Events', 
        value: data.overall_stats.flood_events,
        color: theme.palette.error.main
      },
      { 
        name: 'Non-Flood Events', 
        value: data.overall_stats.non_flood_events,
        color: theme.palette.success.main
      }
    ];
  };
  
  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 1.5,
            border: 1,
            borderColor: theme.palette.divider,
            borderRadius: 1,
            boxShadow: theme.shadows[3]
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" color={theme.palette.primary.main}>
            Flood Events: {payload[0].value}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            Total Records: {payload[1].payload.totalCount}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            Flood Ratio: {formatPercent(payload[1].payload.floodRatio)}
          </Typography>
        </Box>
      );
    }
    return null;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading statistics
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </Paper>
    );
  }
  
  if (!data) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No statistics available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Statistics data could not be loaded
        </Typography>
      </Paper>
    );
  }
  
  const monthlyData = prepareMonthlyData();
  const pieData = preparePieData();
  
  return (
    <div>
      {/* Overall Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Records
                  </Typography>
                  <Typography variant="h5">
                    {data.overall_stats.total_records}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Regions Monitored
                  </Typography>
                  <Typography variant="h5">
                    {data.overall_stats.regions_count}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Flood Events
                  </Typography>
                  <Typography variant="h5" color={theme.palette.error.main}>
                    {data.overall_stats.flood_events}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Non-Flood Events
                  </Typography>
                  <Typography variant="h5" color={theme.palette.success.main}>
                    {data.overall_stats.non_flood_events}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Flood Occurrence Rate
                  </Typography>
                  <Typography variant="h5">
                    {formatPercent(data.overall_stats.flood_events / data.overall_stats.total_records)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Flood vs Non-Flood Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No data available for chart
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Monthly Trend */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Monthly Flood Trend
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ height: 300 }}>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="floodCount" 
                    name="Flood Events" 
                    fill={theme.palette.error.main} 
                  />
                  <Bar 
                    dataKey="totalCount" 
                    name="Total Records" 
                    fill={theme.palette.primary.main} 
                    opacity={0.7}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  No monthly trend data available
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* Regional Statistics */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Regional Statistics
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ height: 'auto', maxHeight: 400, overflowY: 'auto' }}>
            {data.region_stats && Object.keys(data.region_stats).length > 0 ? (
              <Box>
                <Grid container sx={{ fontWeight: 'bold', p: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Grid item xs={4}>Region</Grid>
                  <Grid item xs={2}>Records</Grid>
                  <Grid item xs={2}>Flood Events</Grid>
                  <Grid item xs={2}>Avg. River Level</Grid>
                  <Grid item xs={2}>Max. River Level</Grid>
                </Grid>
                
                {Object.entries(data.region_stats).map(([region, stats]) => (
                  <Grid 
                    container 
                    key={region} 
                    sx={{ 
                      p: 1, 
                      borderBottom: 1, 
                      borderColor: 'divider',
                      '&:nth-of-type(odd)': { bgcolor: theme.palette.action.hover }
                    }}
                  >
                    <Grid item xs={4}>{region}</Grid>
                    <Grid item xs={2}>{stats.records}</Grid>
                    <Grid item xs={2}>{stats.flood_events}</Grid>
                    <Grid item xs={2}>{formatDecimal(stats.avg_river_level, 2)}m</Grid>
                    <Grid item xs={2}>{formatDecimal(stats.max_river_level, 2)}m</Grid>
                  </Grid>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No regional statistics available
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
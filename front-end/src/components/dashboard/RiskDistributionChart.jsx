import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme, 
  CircularProgress 
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RiskDistributionChart = ({ data, loading }) => {
  const theme = useTheme();
  
  // Define risk colors
  const riskColors = {
    High: theme.palette.error.main,
    Medium: theme.palette.warning.main,
    Low: theme.palette.success.main
  };
  
  // Format data for the chart
  const prepareChartData = () => {
    if (!data || !data.length) return [];
    
    // Count regions by risk level
    const riskCounts = data.reduce((acc, region) => {
      acc[region.risk_level] = (acc[region.risk_level] || 0) + 1;
      return acc;
    }, {});
    
    // Format for pie chart
    return Object.entries(riskCounts).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const chartData = prepareChartData();
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: '10px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="body2" sx={{ color: data.color || payload[0].color }}>
            <strong>{data.name} Risk:</strong> {data.value} regions
          </Typography>
        </Box>
      );
    }
    return null;
  };
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Risk Distribution
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Distribution of regions by risk level
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : chartData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography variant="body1" color="text.secondary">
              No data available
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill={theme.palette.text.primary}
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={riskColors[entry.name] || theme.palette.primary.main} 
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskDistributionChart;
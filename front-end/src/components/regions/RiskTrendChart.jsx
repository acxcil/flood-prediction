import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useTheme
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatPercent } from '../../utils/formatters';

/**
 * Component to display a flood risk trend chart for a region
 */
const RiskTrendChart = ({ data, loading, title, days = 7, onDaysChange }) => {
  const theme = useTheme();
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const probabilityValue = payload[0].value;
      const riskLevel = payload[0].payload.risk_level;
      
      // Determine color for risk level
      const getRiskColor = (level) => {
        switch (level) {
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
      
      return (
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 1.5,
            border: 1,
            borderColor: theme.palette.divider,
            borderRadius: 1,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="subtitle2">
            {label}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                display: 'inline-block',
                mr: 1,
              }}
            />
            <Typography variant="body2">
              Risk Probability: <strong>{formatPercent(probabilityValue)}</strong>
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: getRiskColor(riskLevel),
              fontWeight: 'bold',
              mt: 0.5
            }}
          >
            Risk Level: {riskLevel}
          </Typography>
        </Box>
      );
    }
    return null;
  };
  
  // Handle days change
  const handleDaysChange = (event) => {
    if (onDaysChange) {
      onDaysChange(event.target.value);
    }
  };
  
  // Formatter for Y axis
  const formatYAxis = (value) => formatPercent(value);
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {title || 'Flood Risk Trend'}
          </Typography>
          
          {onDaysChange && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="days-select-label">Period</InputLabel>
              <Select
                labelId="days-select-label"
                id="days-select"
                value={days}
                label="Period"
                onChange={handleDaysChange}
              >
                <MenuItem value={7}>7 days</MenuItem>
                <MenuItem value={14}>14 days</MenuItem>
                <MenuItem value={30}>30 days</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Historical and forecast flood risk probability trend
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : !data || !data.dates || data.dates.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography variant="body1" color="text.secondary">
              No trend data available
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data.dates.map((date, i) => ({
                date,
                probability: data.probabilities[i],
                risk_level: data.risk_levels[i]
              }))}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, 1]}
                tickFormatter={formatYAxis}
                label={{ 
                  value: 'Risk Probability',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Reference lines for risk thresholds */}
              <ReferenceLine
                y={0.7}
                label="High Risk"
                stroke={theme.palette.error.main}
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={0.4}
                label="Medium Risk"
                stroke={theme.palette.warning.main}
                strokeDasharray="3 3"
              />
              
              <Line
                type="monotone"
                dataKey="probability"
                name="Risk Probability"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ 
                  stroke: theme.palette.primary.main,
                  strokeWidth: 2,
                  r: 4,
                  fill: theme.palette.background.paper
                }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskTrendChart;
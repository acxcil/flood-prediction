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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  FilterAlt as FilterIcon,
  BarChart as ChartIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { RegionsService } from '../api/regions';
import { DataService } from '../api/data';
import { useAlert } from '../contexts/AlertContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loading from '../components/common/Loading';

const HistoricalDataPage = () => {
  const theme = useTheme();
  const { showAlert } = useAlert();

  // State
  const [regions, setRegions] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    region_id: '',
    start_date: null,
    end_date: null,
    days: 30
  });
  
  // Table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Chart visibility
  const [showChart, setShowChart] = useState(false);
  
  // Fetch regions for filter dropdown
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setRegionsLoading(true);
        const data = await RegionsService.getAllRegions();
        setRegions(data || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
        showAlert('Failed to load regions data', 'error');
      } finally {
        setRegionsLoading(false);
      }
    };

    fetchRegions();
  }, [showAlert]);

  // Fetch historical data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        
        // Format dates for API request
        const startDate = filters.start_date ? filters.start_date.toISOString().split('T')[0] : null;
        const endDate = filters.end_date ? filters.end_date.toISOString().split('T')[0] : null;
        
        const data = await DataService.getHistoricalData({
          region_id: filters.region_id || null,
          start_date: startDate,
          end_date: endDate,
          days: filters.days || 30
        });
        
        setHistoricalData(data);
        setFilteredData(data);
        setPage(0); // Reset to first page when data changes
      } catch (error) {
        console.error('Error fetching historical data:', error);
        showAlert('Failed to load historical data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [filters, showAlert]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      region_id: '',
      start_date: null,
      end_date: null,
      days: 30
    });
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle chart visibility
  const toggleChart = () => {
    setShowChart(!showChart);
  };

  // Export data
  const handleExport = async (format = 'csv') => {
    try {
      setExportLoading(true);
      await DataService.downloadData({
        format,
        region_id: filters.region_id || null,
        filename: `flood_historical_data_export.${format}`
      });
      showAlert(`Data export started (${format.toUpperCase()})`, 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showAlert('Failed to export data', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // Format chart data
  const getChartData = () => {
    // Take the most recent 90 days of data for the chart
    return filteredData.slice(0, 90).map(item => ({
      date: item.date,
      river_level: item.river_level,
      precipitation: item.precipitation,
      temperature: item.temperature,
      flood_status: item.flood_status
    }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Historical Flood Data
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and analyze historical flood data across all monitored regions
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h6">Filter Data</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="region-select-label">Region</InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                value={filters.region_id}
                label="Region"
                onChange={(e) => handleFilterChange('region_id', e.target.value)}
                disabled={regionsLoading}
              >
                <MenuItem value="">
                  <em>All Regions</em>
                </MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={filters.start_date}
                onChange={(newValue) => handleFilterChange('start_date', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={filters.end_date}
                onChange={(newValue) => handleFilterChange('end_date', newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                minDate={filters.start_date}
                maxDate={new Date()}
              />
            </Grid>
          </LocalizationProvider>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Number of Days"
              type="number"
              value={filters.days}
              onChange={(e) => handleFilterChange('days', parseInt(e.target.value) || 30)}
              inputProps={{ min: 1, max: 365 }}
              disabled={!!(filters.start_date && filters.end_date)}
              helperText="Used when date range not specified"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      {/* Data Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Results: {filteredData.length} records
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ChartIcon />}
            onClick={toggleChart}
          >
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
            disabled={exportLoading || loading || filteredData.length === 0}
          >
            Export CSV
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('json')}
            disabled={exportLoading || loading || filteredData.length === 0}
          >
            Export JSON
          </Button>
        </Box>
      </Box>

      {/* Chart View */}
      {showChart && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Historical Data Visualization
            </Typography>
            
            {loading ? (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : filteredData.length === 0 ? (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No data available to display
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
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
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="precipitation"
                    name="Precipitation (mm)"
                    stroke={theme.palette.info.main}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (°C)"
                    stroke={theme.palette.warning.main}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Data Table */}
      <Paper>
        <TableContainer>
          {loading ? (
            <Loading message="Loading historical data..." />
          ) : filteredData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6">No data found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filter criteria
              </Typography>
            </Box>
          ) : (
            <Table aria-label="historical data table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>River Level (m)</TableCell>
                  <TableCell>Precipitation (mm)</TableCell>
                  <TableCell>Temperature (°C)</TableCell>
                  <TableCell>Flood Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={`${row.date}-${row.region}-${index}`} hover>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.region}</TableCell>
                      <TableCell>{row.river_level.toFixed(2)}</TableCell>
                      <TableCell>{row.precipitation.toFixed(2)}</TableCell>
                      <TableCell>{row.temperature.toFixed(1)}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.flood_status ? "Flood" : "No Flood"}
                          size="small"
                          sx={{
                            bgcolor: row.flood_status 
                              ? `${theme.palette.error.main}20`
                              : `${theme.palette.success.main}20`,
                            color: row.flood_status 
                              ? theme.palette.error.main
                              : theme.palette.success.main,
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default HistoricalDataPage;
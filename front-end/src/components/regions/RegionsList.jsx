import React, { useState } from 'react';
import {
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  Button,
  useTheme
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import RegionRiskCard from '../dashboard/RegionRiskCard';
import Loading from '../common/Loading';

/**
 * Component to display a list of regions with filtering and sorting options
 */
const RegionsList = ({ regions, loading, error }) => {
  const theme = useTheme();
  
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('risk_level');
  const [filterBy, setFilterBy] = useState('all');
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle sort selection change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handle filter selection change
  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };
  
  // Filter and sort regions
  const getFilteredRegions = () => {
    if (!regions) return [];
    
    // Filter by search query
    let filtered = regions.filter(region => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      
      return (
        region.name.toLowerCase().includes(query) ||
        region.basin.toLowerCase().includes(query)
      );
    });
    
    // Filter by risk level
    if (filterBy !== 'all') {
      filtered = filtered.filter(region => region.risk_level === filterBy);
    }
    
    // Sort regions
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'basin':
          return a.basin.localeCompare(b.basin);
        case 'river_level':
          return b.current_river_level - a.current_river_level;
        case 'risk_ratio':
          const ratioA = a.current_river_level / a.flood_threshold;
          const ratioB = b.current_river_level / b.flood_threshold;
          return ratioB - ratioA;
        case 'risk_level':
          // Sort by risk level: High > Medium > Low
          const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return riskOrder[b.risk_level] - riskOrder[a.risk_level];
        default:
          return 0;
      }
    });
  };
  
  const filteredRegions = getFilteredRegions();
  
  if (loading) {
    return <Loading message="Loading regions..." />;
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading regions
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box>
      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search regions..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="sort-label">Sort by</InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={sortBy}
                label="Sort by"
                onChange={handleSortChange}
              >
                <MenuItem value="risk_level">Risk Level</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="basin">Basin</MenuItem>
                <MenuItem value="river_level">Current River Level</MenuItem>
                <MenuItem value="risk_ratio">Risk Ratio</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="filter-label">Filter by Risk</InputLabel>
              <Select
                labelId="filter-label"
                id="filter-select"
                value={filterBy}
                label="Filter by Risk"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Risk Levels</MenuItem>
                <MenuItem value="High">High Risk</MenuItem>
                <MenuItem value="Medium">Medium Risk</MenuItem>
                <MenuItem value="Low">Low Risk</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredRegions.length} of {regions.length} regions
        </Typography>
        
        <Button
          startIcon={<FilterIcon />}
          size="small"
          variant="text"
          onClick={() => {
            setSearchQuery('');
            setSortBy('risk_level');
            setFilterBy('all');
          }}
          disabled={!searchQuery && sortBy === 'risk_level' && filterBy === 'all'}
        >
          Reset Filters
        </Button>
      </Box>
      
      {/* Regions Grid */}
      {filteredRegions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No regions found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredRegions.map((region) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={region.id}>
              <RegionRiskCard region={region} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RegionsList;
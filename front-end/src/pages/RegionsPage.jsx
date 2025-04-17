import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { RegionsService } from '../api/regions';
import RegionRiskCard from '../components/dashboard/RegionRiskCard';
import Loading from '../components/common/Loading';
import { useAlert } from '../contexts/AlertContext';

const RegionsPage = () => {
  const theme = useTheme();
  const { showAlert } = useAlert();
  
  // State
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const data = await RegionsService.getAllRegions();
        setRegions(data);
        setFilteredRegions(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
        showAlert('Failed to load regions data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, [showAlert]);
  
  // Filter regions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRegions(regions);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = regions.filter(region => 
      region.name.toLowerCase().includes(query) ||
      region.basin.toLowerCase().includes(query)
    );
    
    setFilteredRegions(filtered);
  }, [searchQuery, regions]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Monitored Regions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and monitor all regions in the flood prediction system
        </Typography>
      </Box>
      
      {/* Search and filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
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
        </Grid>
      </Paper>
      
      {/* Regions grid */}
      {loading ? (
        <Loading message="Loading regions..." />
      ) : filteredRegions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No regions found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredRegions.map((region) => (
            <Grid item xs={12} sm={6} md={4} key={region.id}>
              <RegionRiskCard region={region} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RegionsPage;
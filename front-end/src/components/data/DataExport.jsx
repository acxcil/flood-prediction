import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  Code as JsonIcon,
  TableChart as CsvIcon
} from '@mui/icons-material';
import { DataService } from '../../api/data';

/**
 * Component to export historical flood data in various formats
 */
const DataExport = ({ regions, onExport }) => {
  const theme = useTheme();
  
  // State
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('flood_data_export');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Handle format change
  const handleFormatChange = (event) => {
    setExportFormat(event.target.value);
    setFileName(`flood_data_export.${event.target.value}`);
  };
  
  // Handle region change
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };
  
  // Handle file name change
  const handleFileNameChange = (event) => {
    let name = event.target.value;
    
    // Remove file extension if present
    name = name.replace(/\.(csv|json)$/i, '');
    
    // Add extension based on selected format
    setFileName(name);
  };
  
  // Handle export
  const handleExport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Use provided export function if available, otherwise use service
      if (onExport) {
        await onExport({ format: exportFormat, region_id: selectedRegion || null, filename: getFullFileName() });
      } else {
        await DataService.downloadData({
          format: exportFormat,
          region_id: selectedRegion || null,
          filename: getFullFileName()
        });
      }
      
      setSuccess(`Data successfully exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get file name with extension
  const getFullFileName = () => {
    const name = fileName || 'flood_data_export';
    const extension = exportFormat;
    
    // Make sure filename has correct extension
    if (!name.endsWith(`.${extension}`)) {
      return `${name}.${extension}`;
    }
    
    return name;
  };
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Export Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Download historical flood data in CSV or JSON format
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="format-select-label">Export Format</InputLabel>
              <Select
                labelId="format-select-label"
                id="format-select"
                value={exportFormat}
                label="Export Format"
                onChange={handleFormatChange}
                disabled={loading}
              >
                <MenuItem value="csv">CSV (Comma Separated Values)</MenuItem>
                <MenuItem value="json">JSON (JavaScript Object Notation)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="region-select-label">Region Filter (Optional)</InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                value={selectedRegion}
                label="Region Filter (Optional)"
                onChange={handleRegionChange}
                disabled={loading}
              >
                <MenuItem value="">
                  <em>All Regions</em>
                </MenuItem>
                {regions && regions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="File Name"
              value={fileName}
              onChange={handleFileNameChange}
              disabled={loading}
              helperText={`Output file will be saved as: ${getFullFileName()}`}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (
              exportFormat === 'csv' ? <CsvIcon /> : <JsonIcon />
            )}
            endIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            {loading ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataExport;
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  FileUpload as UploadIcon, 
  Send as SendIcon,
  Delete as DeleteIcon,
  FileDownload as DownloadIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { parseCSV } from '../../utils/helpers';

/**
 * Form component for batch flood risk predictions
 */
const BatchPredictionForm = ({ onSubmit, loading }) => {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  
  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }
    
    // Validate file type
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    // Parse the CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target.result;
        const parsedData = parseCSV(csvData);
        
        // Validate data structure
        if (!validateData(parsedData)) {
          setError('CSV format is invalid. Please check the template.');
          return;
        }
        
        setFileData(parsedData);
        // Show preview of first 5 rows
        setPreview(parsedData.slice(0, 5));
        
      } catch (err) {
        console.error('Error parsing CSV:', err);
        setError('Failed to parse CSV file. Please check the format.');
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
    };
    
    reader.readAsText(selectedFile);
  };
  
  // Validate data structure
  const validateData = (data) => {
    if (!data || data.length === 0) {
      return false;
    }
    
    // Check required fields
    const requiredFields = [
      'temperature', 'precipitation', 'river_level', 'region', 'basin'
    ];
    
    return requiredFields.every(field => 
      data[0].hasOwnProperty(field)
    );
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileData || fileData.length === 0) {
      setError('No data to process');
      return;
    }
    
    onSubmit(fileData);
  };
  
  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setFileData([]);
    setPreview([]);
    setError('');
  };
  
  // Download sample CSV template
  const handleDownloadTemplate = () => {
    const headers = [
      'temperature', 'precipitation', 'snowmelt', 'soil_moisture', 
      'river_level', 'days_since_precip', 'precip_3d', 'precip_7d', 
      'precip_14d', 'river_level_change', 'region', 'basin', 
      'elevation_range', 'month'
    ];
    
    const sampleRow = [
      '15.2', '5.8', '0.0', '68.5',
      '3.2', '1.0', '12.5', '28.7',
      '42.3', '0.8', 'Batken_Area', 'Ferghana',
      'medium', '4'
    ];
    
    const csvContent = [
      headers.join(','),
      sampleRow.join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'batch_prediction_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Batch Prediction</Typography>
        <Tooltip title="Download template CSV file">
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTemplate}
            variant="outlined"
            size="small"
          >
            Download Template
          </Button>
        </Tooltip>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Upload a CSV file with multiple prediction requests.
          Each row should contain all required fields.
          <Tooltip title="Click to download a template CSV">
            <IconButton size="small" onClick={handleDownloadTemplate}>
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
      </Alert>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            disabled={loading}
          >
            Upload CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
              disabled={loading}
            />
          </Button>
          
          {file && (
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Typography>
              <IconButton 
                size="small" 
                onClick={handleRemoveFile}
                disabled={loading}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        
        {preview.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview ({fileData.length} rows total, showing first 5):
            </Typography>
            <TableContainer sx={{ maxHeight: 250 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {Object.keys(preview[0]).map((key) => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.map((row, idx) => (
                    <TableRow key={idx}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={loading || fileData.length === 0}
            size="large"
          >
            {loading ? 'Processing...' : 'Run Batch Prediction'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default BatchPredictionForm;
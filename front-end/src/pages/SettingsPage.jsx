import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  Slider,
  Alert,
  useTheme
} from '@mui/material';
import { useColorMode } from '../contexts/ThemeContext';
import { Save as SaveIcon } from '@mui/icons-material';
import { useAlert } from '../contexts/AlertContext';

/**
 * Application settings page for theme and display preferences
 */
const SettingsPage = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const { showAlert } = useAlert();
  
  // State for settings
  const [settings, setSettings] = useState({
    dataRefreshInterval: 30,
    showAnimations: true,
    enableHighPrecision: false,
    defaultTimeRange: 7
  });
  
  // Success message state
  const [success, setSuccess] = useState('');
  
  // Handle settings change
  const handleSettingsChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    setSuccess('');
  };
  
  // Handle settings save
  const handleSaveSettings = () => {
    // In a real app, you would save settings to API or localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSuccess('Settings saved successfully');
    showAlert('Settings updated', 'success');
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize application settings and display preferences
        </Typography>
      </Box>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Display Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Theme Mode
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleColorMode}
                    name="themeMode"
                    color="primary"
                  />
                }
                label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Switch between light and dark theme for the application
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Animation Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showAnimations}
                    onChange={(e) => handleSettingsChange('showAnimations', e.target.checked)}
                    name="showAnimations"
                    color="primary"
                  />
                }
                label="Enable Animations"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Enable or disable animations for charts and UI elements
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="time-range-label">Default Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  id="defaultTimeRange"
                  value={settings.defaultTimeRange}
                  label="Default Time Range"
                  onChange={(e) => handleSettingsChange('defaultTimeRange', e.target.value)}
                >
                  <MenuItem value={1}>Last 24 Hours</MenuItem>
                  <MenuItem value={7}>Last 7 Days</MenuItem>
                  <MenuItem value={14}>Last 14 Days</MenuItem>
                  <MenuItem value={30}>Last 30 Days</MenuItem>
                  <MenuItem value={90}>Last 90 Days</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" display="block">
                Set the default time range for historical data and charts
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Data Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Data Refresh Interval (seconds)
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={settings.dataRefreshInterval}
                  onChange={(e, value) => handleSettingsChange('dataRefreshInterval', value)}
                  aria-labelledby="data-refresh-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks={[
                    { value: 0, label: 'Off' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '1m' },
                    { value: 300, label: '5m' }
                  ]}
                  min={0}
                  max={300}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Set how frequently data is automatically refreshed (0 to disable auto-refresh)
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Precision Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableHighPrecision}
                    onChange={(e) => handleSettingsChange('enableHighPrecision', e.target.checked)}
                    name="enableHighPrecision"
                    color="primary"
                  />
                }
                label="Enable High Precision"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Show additional decimal places for more precise measurements
              </Typography>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Application Information
              </Typography>
              <Typography variant="body2">
                Flood Prediction System v1.0.0
              </Typography>
              <Typography variant="body2">
                © 2025 FYP Project
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsPage;
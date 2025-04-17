import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { RegionsService } from '../../api/regions';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';

/**
 * Component for user profile management and settings
 */
const UserProfile = () => {
  const theme = useTheme();
  const { currentUser, logout } = useAuth();
  const { showAlert } = useAlert();
  
  // State
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // User profile form state
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    preferredRegion: '',
    organization: '',
    receiveAlerts: true,
    emailNotifications: true,
    alertThreshold: 0.7
  });
  
  // Fetch regions for dropdown
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setRegionsLoading(true);
        const data = await RegionsService.getAllRegions();
        setRegions(data || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      } finally {
        setRegionsLoading(false);
      }
    };

    fetchRegions();
  }, []);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };
  
  // Toggle edit mode
  const toggleEdit = () => {
    setEditing(!editing);
    if (!editing) {
      // Reset form when entering edit mode
      setError('');
    }
  };
  
  // Handle save profile
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Here you would typically call an API to update the user profile
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditing(false);
      showAlert('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get the initials for avatar
  const getInitials = () => {
    const { fullName } = userProfile;
    if (!fullName) return currentUser?.username?.charAt(0).toUpperCase() || 'U';
    
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  if (!currentUser) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Not Logged In
        </Typography>
        <Typography variant="body1">
          Please log in to view and edit your profile.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: theme.palette.primary.main,
              mr: 2
            }}
          >
            {getInitials()}
          </Avatar>
          
          <Box>
            <Typography variant="h5">
              {userProfile.fullName || currentUser.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Account created on {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant={editing ? 'outlined' : 'contained'}
          startIcon={editing ? null : <EditIcon />}
          onClick={toggleEdit}
          disabled={loading}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={userProfile.fullName}
                onChange={handleChange}
                disabled={!editing || loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={userProfile.email}
                onChange={handleChange}
                disabled={!editing || loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization (Optional)"
                name="organization"
                value={userProfile.organization}
                onChange={handleChange}
                disabled={!editing || loading}
                margin="normal"
              />
            </Grid>
          </Grid>
        </Grid>
        
        {/* Notification Preferences */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={userProfile.receiveAlerts}
                  onChange={handleChange}
                  name="receiveAlerts"
                  color="primary"
                  disabled={!editing || loading}
                />
              }
              label="Receive Flood Alerts"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={userProfile.emailNotifications}
                  onChange={handleChange}
                  name="emailNotifications"
                  color="primary"
                  disabled={!editing || loading || !userProfile.receiveAlerts}
                />
              }
              label="Email Notifications"
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal" disabled={!editing || loading || !userProfile.receiveAlerts}>
              <InputLabel id="region-select-label">Preferred Region for Alerts</InputLabel>
              <Select
                labelId="region-select-label"
                id="preferredRegion"
                name="preferredRegion"
                value={userProfile.preferredRegion}
                onChange={handleChange}
                label="Preferred Region for Alerts"
              >
                <MenuItem value="">
                  <em>All Regions</em>
                </MenuItem>
                {!regionsLoading && regions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Alert Threshold: {(userProfile.alertThreshold * 100).toFixed(0)}%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption">50%</Typography>
              <Box sx={{ flex: 1, mx: 1 }}>
                <input
                  type="range"
                  min="0.5"
                  max="0.9"
                  step="0.05"
                  value={userProfile.alertThreshold}
                  onChange={handleChange}
                  name="alertThreshold"
                  disabled={!editing || loading || !userProfile.receiveAlerts}
                  style={{ width: '100%' }}
                />
              </Box>
              <Typography variant="caption">90%</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              You will be alerted when flood risk probability exceeds this threshold
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {editing && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default UserProfile;
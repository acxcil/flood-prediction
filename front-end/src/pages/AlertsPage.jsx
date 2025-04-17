import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  TextField,
  Slider,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  Warning as WarningIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { RegionsService } from '../api/regions';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';

const AlertsPage = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { showAlert } = useAlert();
  
  // State
  const [alertThreshold, setAlertThreshold] = useState(0.7);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  
  // Fetch alerts data
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await RegionsService.simulateAlerts(alertThreshold);
        setAlerts(response.alerts || []);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        showAlert('Failed to load alerts', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [alertThreshold, showAlert]);
  
  // Setup subscription info if user is logged in
  useEffect(() => {
    if (currentUser) {
      setIsSubscribed(true); // In a real app, this would come from user profile
      setSubscriptionEmail("user@example.com"); // In a real app, this would come from user profile
    } else {
      setIsSubscribed(false);
      setSubscriptionEmail("");
    }
  }, [currentUser]);
  
  // Handle threshold change
  const handleThresholdChange = (event, newValue) => {
    setAlertThreshold(newValue);
  };
  
  // Handle subscription toggle
  const handleSubscriptionToggle = () => {
    if (!currentUser) {
      showAlert('Please log in to manage alert subscriptions', 'warning');
      return;
    }
    
    setIsSubscribed(!isSubscribed);
    showAlert(
      isSubscribed 
        ? 'Alert notifications paused' 
        : 'You are now subscribed to alerts',
      isSubscribed ? 'info' : 'success'
    );
  };
  
  // Format date for display
  const formatAlertTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString();
    } catch (error) {
      return timeString;
    }
  };
  
  // Calculate alert severity from probability
  const getAlertSeverity = (probability) => {
    if (probability >= 0.8) return 'Critical';
    if (probability >= 0.7) return 'High';
    if (probability >= 0.5) return 'Medium';
    return 'Low';
  };
  
  // Get color for alert severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return theme.palette.error.dark;
      case 'High':
        return theme.palette.error.main;
      case 'Medium':
        return theme.palette.warning.main;
      case 'Low':
      default:
        return theme.palette.success.main;
    }
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flood Alerts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage flood alert notifications
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Alert Settings */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%' }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Alert Settings</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure when you want to receive flood alerts
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                  Alert Threshold: {(alertThreshold * 100).toFixed(0)}%
                </Typography>
                <Slider
                  value={alertThreshold}
                  onChange={handleThresholdChange}
                  aria-label="Alert threshold"
                  step={0.05}
                  marks={[
                    { value: 0.5, label: '50%' },
                    { value: 0.7, label: '70%' },
                    { value: 0.9, label: '90%' }
                  ]}
                  min={0.5}
                  max={0.9}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Typography variant="caption" color="text.secondary">
                  You will be alerted when flood risk probability exceeds this threshold
                </Typography>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSubscribed}
                      onChange={handleSubscriptionToggle}
                      color="primary"
                    />
                  }
                  label="Receive alert notifications"
                  sx={{ mb: 2 }}
                />
                
                {isSubscribed && (
                  <>
                    <TextField
                      fullWidth
                      label="Email for Notifications"
                      value={subscriptionEmail}
                      onChange={(e) => setSubscriptionEmail(e.target.value)}
                      variant="outlined"
                      disabled={!currentUser}
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {currentUser 
                        ? 'You will receive alerts for regions with flood risk exceeding the threshold'
                        : 'Please log in to enable alert notifications'}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Current Alerts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%' }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Current Alerts</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Regions currently at risk of flooding
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : alerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1">
                    No alerts detected at the current threshold
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try lowering the alert threshold to see more alerts
                  </Typography>
                </Box>
              ) : (
                <List>
                  {alerts.map((alert, index) => {
                    const severity = getAlertSeverity(alert.risk_probability);
                    const severityColor = getSeverityColor(severity);
                    
                    return (
                      <React.Fragment key={`${alert.region}-${index}`}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{
                            borderLeft: 3,
                            borderColor: severityColor,
                            py: 2,
                            backgroundColor: `${severityColor}10`,
                          }}
                        >
                          <ListItemIcon>
                            <WarningIcon sx={{ color: severityColor }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="subtitle1" component="span">
                                  {alert.region}
                                </Typography>
                                <Chip
                                  label={severity}
                                  size="small"
                                  sx={{
                                    bgcolor: `${severityColor}20`,
                                    color: severityColor,
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Risk: {(alert.risk_probability * 100).toFixed(0)}%
                                </Typography>
                                <br />
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {alert.message}
                                </Typography>
                                <br />
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {formatAlertTime(alert.alert_time)}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < alerts.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AlertsPage;
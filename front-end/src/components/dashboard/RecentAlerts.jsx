import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Button, 
  Box, 
  Chip,
  Badge,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Warning as WarningIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { RegionsService } from '../../api/regions';
import { useAlert } from '../../contexts/AlertContext';

const RecentAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { showAlert } = useAlert();

  // Fetch alerts data
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await RegionsService.simulateAlerts(0.7);
        setAlerts(response.alerts || []);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        showAlert('Failed to load alerts', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [showAlert]);

  // Format time
  const formatAlertTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString();
    } catch (error) {
      return timeString;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">Recent Alerts</Typography>
            {alerts.length > 0 && (
              <Badge
                badgeContent={alerts.length}
                color="error"
                sx={{ ml: 1 }}
              >
                <NotificationsIcon color="action" />
              </Badge>
            )}
          </Box>
          <Button size="small" variant="outlined">
            View All
          </Button>
        </Box>
      </CardContent>

      <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 350 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : alerts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography variant="body1" color="text.secondary">
              No active alerts
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {alerts.map((alert, index) => (
              <React.Fragment key={`${alert.region}-${index}`}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <WarningIcon sx={{ color: theme.palette.error.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {alert.region}
                        </Typography>
                        <Chip
                          label={`Risk: ${(alert.risk_probability * 100).toFixed(0)}%`}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.error.light,
                            color: theme.palette.error.contrastText,
                            fontWeight: 'medium',
                            fontSize: '0.75rem'
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
            ))}
          </List>
        )}
      </Box>
    </Card>
  );
};

export default RecentAlerts;
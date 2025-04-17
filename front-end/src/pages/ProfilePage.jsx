import React from 'react';
import { Container, Typography, Box, Grid, Paper, Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/auth/UserProfile';

/**
 * User profile page with settings and preferences
 */
const ProfilePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = React.useState('profile');

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: '/profile' } }} />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account and notification preferences
        </Typography>
      </Box>

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            sx={{ mb: 1 }}
          >
            <Tab label="Profile" value="profile" />
            <Tab label="Notifications" value="notifications" />
            <Tab label="Security" value="security" />
          </Tabs>
        </Box>

        <TabPanel value="profile" sx={{ p: 0 }}>
          <UserProfile />
        </TabPanel>

        <TabPanel value="notifications" sx={{ p: 0 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Notification preferences will be available in a future update. You can currently manage notification settings in your profile.
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value="security" sx={{ p: 0 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Security settings will be available in a future update.
            </Typography>
          </Paper>
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default ProfilePage;
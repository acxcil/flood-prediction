import React from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';
import { useAlert } from '../../contexts/AlertContext';

// Alert wrapper component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * Alert Snackbar component for displaying notifications
 * This is used by the AlertContext provider
 */
const AlertSnackbar = () => {
  const { alert, hideAlert } = useAlert();
  
  // Handle close on user action
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    hideAlert();
  };
  
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={alert.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
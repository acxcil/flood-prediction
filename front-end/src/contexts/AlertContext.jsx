import React, { createContext, useState, useContext, useCallback } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

// Alert severity types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Create alert context
export const AlertContext = createContext({
  showAlert: () => {},
  hideAlert: () => {},
  alert: {
    open: false,
    message: '',
    type: ALERT_TYPES.INFO,
    duration: 6000,
  },
});

// Custom hook to use the alert context
export const useAlert = () => useContext(AlertContext);

// Alert wrapper component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AlertProvider = ({ children }) => {
  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    type: ALERT_TYPES.INFO,
    duration: 6000,
  });

  // Show alert
  const showAlert = useCallback((message, type = ALERT_TYPES.INFO, duration = 6000) => {
    setAlert({
      open: true,
      message,
      type,
      duration,
    });
  }, []);

  // Hide alert
  const hideAlert = useCallback(() => {
    setAlert(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  // Handle close on user action
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    hideAlert();
  };

  // Context value
  const value = {
    showAlert,
    hideAlert,
    alert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
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
    </AlertContext.Provider>
  );
};

export default AlertProvider;
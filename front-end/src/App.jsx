import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';

// Layout components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import PredictionPage from './pages/PredictionPage';
import RegionsPage from './pages/RegionsPage';
import RegionDetailPage from './pages/RegionDetailPage';
import HistoricalDataPage from './pages/HistoricalDataPage';
import AlertsPage from './pages/AlertsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';

// Context Providers
import ThemeContextProvider from './contexts/ThemeContext';
import AuthProvider from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Handle drawer toggle
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeContextProvider>
      <AuthProvider>
        <AlertProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header toggleDrawer={toggleDrawer} />
              
              <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
                
                <Box 
                  component="main" 
                  sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    width: '100%',
                    overflow: 'auto'
                  }}
                >
                  <Toolbar /> {/* Spacer to push content below app bar */}
                  
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/prediction" element={<PredictionPage />} />
                    <Route path="/regions" element={<RegionsPage />} />
                    <Route path="/regions/:regionId" element={<RegionDetailPage />} />
                    <Route path="/historical" element={<HistoricalDataPage />} />
                    <Route path="/alerts" element={<AlertsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Box>
              </Box>
              
              <Footer />
            </Box>
          </Router>
        </AlertProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
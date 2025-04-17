import React from 'react';
import { Box, Typography, Link, Container, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' 
          ? theme.palette.grey[100] 
          : theme.palette.grey[900],
      }}
    >
      <Divider />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' }
          }}
        >
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Flood Prediction System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created for FYP Project
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}
          >
            <Link href="#" color="inherit" sx={{ mx: 1, my: { xs: 0.5, sm: 0 } }}>
              About
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1, my: { xs: 0.5, sm: 0 } }}>
              Contact
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1, my: { xs: 0.5, sm: 0 } }}>
              Documentation
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1, my: { xs: 0.5, sm: 0 } }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
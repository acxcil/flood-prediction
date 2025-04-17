import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem,
  Avatar,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useColorMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ toggleDrawer }) => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // User menu state
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const openUserMenu = Boolean(userMenuAnchor);

  // Handle user menu click
  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  // Handle user menu close
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Menu Icon for mobile */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Logo and Title */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            sx={{ height: 40, mr: 1 }}
            alt="Flood Prediction System"
            src="/assets/images/logo.png"
            onError={(e) => {
              e.target.src = ""; // Fallback if image not available
              e.target.style.display = "none";
            }}
          />
          Flood Prediction System
        </Typography>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Theme toggle */}
          <Tooltip title={`Toggle ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton color="inherit" onClick={toggleColorMode} sx={{ ml: 1 }}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* User section */}
          {currentUser ? (
            <>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton color="inherit" sx={{ ml: 1 }}>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>

              {/* User menu */}
              <Box sx={{ ml: 1 }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleUserMenuClick}
                    size="small"
                    aria-controls={openUserMenu ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openUserMenu ? 'true' : undefined}
                    color="inherit"
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                      {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  id="account-menu"
                  anchorEl={userMenuAnchor}
                  open={openUserMenu}
                  onClose={handleUserMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'user-button',
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => {handleUserMenuClose(); navigate('/profile');}}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                startIcon={<PersonIcon />}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Container,
  InputBase,
  Paper,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  ListItemButton,
  Collapse,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Map,
  Report,
  Security,
  People,
  Settings,
  Notifications,
  AccountCircle,
  Logout,
  Search,
  Warning,
  ExpandLess,
  ExpandMore,
  Phone,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';



const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const EnhancedNavbar = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenu, setExpandedMenu] = useState({});
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  // const { sendTestNotification } = useSocket();

  // Mock notifications data with state management
  const [notifications, setNotifications] = useState([]);

  // Update notification count based on unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);
  const currentNotificationCount = unreadNotifications.length;

  // Reset notifications when user authentication state changes
  useEffect(() => {
    if (user) {
      // User is logged in - set notifications
      setNotifications([
        {
          id: 1,
          title: 'New Incident Reported',
          message: 'Suspicious activity reported in your neighborhood',
          time: '2 minutes ago',
          type: 'incident',
          read: false
        },
        {
          id: 2,
          title: 'Community Meeting',
          message: 'Monthly neighborhood watch meeting scheduled for tomorrow',
          time: '1 hour ago',
          type: 'community',
          read: false
        },
        {
          id: 3,
          title: 'Safety Alert',
          message: 'Street light outage reported on Main Street',
          time: '3 hours ago',
          type: 'alert',
          read: false
        }
      ]);
    } else {
      // User is logged out - clear notifications
      setNotifications([]);
    }
  }, [user]);

  // Emergency alert state
  const [emergencySnackbar, setEmergencySnackbar] = useState({
    open: false,
    message: '',
    severity: 'warning'
  });

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      description: 'Overview of safety metrics'
    },
    {
      text: 'Live Map',
      icon: <Map />,
      path: '/map',
      description: 'Real-time incident mapping'
    },
    {
      text: 'Incidents',
      icon: <Report />,
      path: '/incidents',
      description: 'View all reported incidents',
      subItems: [
        { text: 'All Incidents', path: '/incidents' },
        { text: 'My Reports', path: '/incidents?filter=my-reports' },
        { text: 'Recent Activity', path: '/incidents?filter=recent' }
      ]
    },
    {
      text: 'Report Incident',
      icon: <Report />,
      path: '/report',
      description: 'Report a new safety incident'
    },
    {
      text: 'Safety Resources',
      icon: <Security />,
      path: '/safety',
      description: 'Safety tips and resources',
      subItems: [
        { text: 'Safety Tips', path: '/safety' },
        { text: 'Emergency Contacts', path: '/safety/contacts' },
        { text: 'Safety Guidelines', path: '/safety/guidelines' }
      ]
    },
    {
      text: 'Community',
      icon: <People />,
      path: '/community',
      description: 'Connect with neighbors',
      subItems: [
        { text: 'All Members', path: '/members' },
        { text: 'Community Forum', path: '/community?section=community-forum' },
        { text: 'Neighborhood Watch', path: '/community?section=neighborhood-watch' },
        { text: 'Events', path: '/community?section=community-events' }
      ]
    },
    {
      text: 'Settings',
      icon: <Settings />,
      path: '/settings',
      description: 'Account and app settings'
    },
  ];

  // Handle search functionality
  const handleSearch = (event) => {
    event.preventDefault();
    console.log('Search submitted:', searchQuery);
    if (searchQuery.trim()) {
      console.log('Navigating to search page with query:', searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else {
      console.log('Search query is empty');
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        navigate('/search');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Handle emergency alert
  const handleEmergencyAlert = () => {
    setEmergencySnackbar({
      open: true,
      message: 'Emergency alert sent to local authorities and community members!',
      severity: 'warning'
    });
    // Here you would typically send the emergency alert to the backend
    console.log('Emergency alert triggered');
  };

  // Handle menu expansion
  const handleMenuExpand = (text) => {
    setExpandedMenu(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = (notificationId) => {
    // Mark notification as read
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    handleNotificationClose();
  };

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    handleNotificationClose();
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Speed dial actions for quick access
  const speedDialActions = [
    { icon: <Report />, name: 'Report Incident', action: () => navigate('/report') },
    { icon: <Warning />, name: 'Emergency Alert', action: handleEmergencyAlert },
    { icon: <Map />, name: 'Live Map', action: () => navigate('/map') },
    { icon: <Phone />, name: 'Call 911', action: () => window.open('tel:911') },
  ];

  const drawer = (
    <Box sx={{ 
      width: 280, 
      height: '100%', 
      background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)', 
      color: theme.palette.mode === 'dark' ? '#ECF0F1' : 'white', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(236, 240, 241, 0.2)' : 'rgba(44, 62, 80, 0.1)'}`
    }}>


      {/* User Info */}
      {user && (
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              src={user.profile?.avatar} 
              sx={{ 
                width: 40, 
                height: 40, 
                mr: 2, 
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: '0 4px 12px rgba(0, 191, 166, 0.2)'
              }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.mode === 'dark' ? 'white' : 'white' 
              }}>
                {user.name || user.email}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.7)' 
              }}>
                {user.role || 'Community Member'}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label="Online" 
            size="small" 
            color="success" 
            variant="outlined"
            sx={{ 
              fontSize: '0.7rem', 
              color: theme.palette.success.main, 
              borderColor: theme.palette.success.main,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 191, 166, 0.1)' : 'rgba(0, 191, 166, 0.05)'
            }}
          />
        </Box>
      )}

      {/* Dark Mode Toggle in Drawer */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
      }}>
        <FormControlLabel
          control={
            <Switch 
              checked={darkMode} 
              onChange={toggleDarkMode}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 191, 166, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
              <Typography variant="body2" sx={{ 
                color: theme.palette.mode === 'dark' ? 'white' : 'white' 
              }}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Typography>
            </Box>
          }
          sx={{ 
            color: theme.palette.mode === 'dark' ? 'white' : 'white',
            '& .MuiFormControlLabel-label': {
              color: theme.palette.mode === 'dark' ? 'white' : 'white'
            }
          }}
        />
      </Box>

      {/* User Menu for mobile */}
      {isMobile && user && (
        <>
          <Divider sx={{ 
            my: 1, 
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
          }} />
          <List sx={{ p: 0 }}>
            <ListItemButton 
              onClick={() => { setDrawerOpen(false); handleMenuClose(); navigate('/profile'); }}
              sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'white' }}
            >
                             <ListItemIcon sx={{ color: 'white' }}><AccountCircle fontSize="small" /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton 
              onClick={() => { setDrawerOpen(false); handleMenuClose(); navigate('/settings'); }}
              sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'white' }}
            >
                             <ListItemIcon sx={{ color: 'white' }}><Settings fontSize="small" /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
            <Divider sx={{ 
              my: 1, 
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)' 
            }} />
            <ListItemButton 
              onClick={() => { setDrawerOpen(false); handleLogout(); }}
              sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'white' }}
            >
                             <ListItemIcon sx={{ color: 'white' }}><Logout fontSize="small" /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </>
      )}

      {/* Navigation Menu */}
      <List sx={{ pt: 1 }}>
        {/* Search Option for Mobile */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => { setDrawerOpen(false); navigate('/search'); }}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              color: theme.palette.mode === 'dark' ? 'white' : 'white',
              '&:hover': {
                background: theme.palette.mode === 'dark' ? 'rgba(0, 191, 166, 0.1)' : 'rgba(0, 191, 166, 0.05)',
              },
            }}
          >
                         <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
               <Search />
             </ListItemIcon>
            <ListItemText 
              primary="Search"
              secondary="Search incidents, locations, and more"
              sx={{ 
                color: theme.palette.mode === 'dark' ? 'white' : 'white',
                '& .MuiListItemText-secondary': {
                  fontSize: '0.75rem',
                  opacity: 0.7,
                  color: theme.palette.mode === 'dark' ? '#B0BEC5' : 'rgba(255,255,255,0.7)'
                }
              }}
            />
          </ListItemButton>
        </ListItem>
        
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.subItems) {
                    handleMenuExpand(item.text);
                  } else {
                    handleNavigation(item.path);
                  }
                }}
                selected={isActiveRoute(item.path)}
                sx={{
                  '&.Mui-selected': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    color: 'white',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                    '& .MuiListItemIcon-root': { color: 'white' },
                  },
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  color: theme.palette.mode === 'dark' ? 'white' : 'white',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' ? 'rgba(0, 191, 166, 0.1)' : 'rgba(0, 191, 166, 0.05)',
                  },
                }}
              >
                                 <ListItemIcon sx={{ 
                   color: 'white',
                   minWidth: 40
                 }}>
                   {item.icon}
                 </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  secondary={item.description}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? 'white' : 'white',
                    '& .MuiListItemText-secondary': {
                      fontSize: '0.75rem',
                      opacity: 0.7,
                      color: theme.palette.mode === 'dark' ? '#B0BEC5' : 'rgba(255,255,255,0.7)'
                    }
                  }}
                />
                {item.subItems && (
                  expandedMenu[item.text] ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />
                )}
              </ListItemButton>
            </ListItem>
            {/* Sub-menu items */}
            {item.subItems && (
              <Collapse in={expandedMenu[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ 
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' 
                }}>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      sx={{ 
                        pl: 4, 
                        py: 0.5, 
                        color: theme.palette.mode === 'dark' ? 'white' : 'white', 
                        '&:hover': { 
                          background: theme.palette.mode === 'dark' ? 'rgba(0, 191, 166, 0.08)' : 'rgba(0, 191, 166, 0.03)' 
                        } 
                      }}
                      onClick={() => handleNavigation(subItem.path)}
                    >
                      <ListItemText 
                        primary={subItem.text}
                        sx={{ 
                          fontSize: '0.9rem', 
                          color: theme.palette.mode === 'dark' ? 'white' : 'white' 
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Emergency Section */}
      <Box sx={{ 
        p: 2, 
        mt: 'auto', 
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' 
      }}>
        <Divider sx={{ 
          mb: 2, 
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
        }} />
        <Typography variant="subtitle2" color="error" sx={{ mb: 1, fontWeight: 600 }}>
          🚨 Emergency
        </Typography>
        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<Warning />}
          onClick={handleEmergencyAlert}
          sx={{ 
            mb: 1, 
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
            }
          }}
        >
          Emergency Alert
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Phone />}
          onClick={() => window.open('tel:911')}
          sx={{ 
            fontWeight: 600, 
            borderColor: theme.palette.error.main, 
            color: theme.palette.error.main,
            '&:hover': {
              borderColor: theme.palette.error.dark,
              color: theme.palette.error.dark,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 107, 107, 0.05)'
            }
          }}
        >
          Call 911
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
             {/* App Bar */}
       <AppBar 
         position="fixed" 
         sx={{ 
           zIndex: theme.zIndex.drawer + 1,
           background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
           backdropFilter: 'blur(20px)',
           borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(236, 240, 241, 0.2)' : 'rgba(44, 62, 80, 0.1)'}`,
           boxShadow: theme.palette.mode === 'dark' 
             ? '0 4px 20px rgba(0,0,0,0.4)' 
             : '0 4px 20px rgba(44, 62, 80, 0.08)',
           borderRadius: 0
         }}
       >
        <Toolbar>
                                 <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' }, 
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                color: 'white',
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                }
              }}
            >
            <MenuIcon />
          </IconButton>

          <Tooltip title="Go to Home Page">
            <Typography 
              variant="h6" 
              component="div" 
              onClick={() => navigate('/')} 
              sx={{ 
                flexGrow: 1,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.mode === 'dark' ? '#F1F5F9' : 'white',
                cursor: 'pointer',
                letterSpacing: 1,
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              Safety Alert
            </Typography>
          </Tooltip>

          {/* Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: '2px 4px',
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              width: { xs: '200px', sm: '300px' },
              mr: 2,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.10)' : 'rgba(71, 85, 105, 0.05)',
              boxShadow: 'none',
              borderRadius: 8,
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(71, 85, 105, 0.1)'}`,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(71, 85, 105, 0.08)',
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <SearchIconWrapper>
              <Search sx={{ color: 'white' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search incidents, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
              sx={{ 
                color: 'white',
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1
                }
              }}
            />
            <IconButton 
              type="submit" 
              sx={{ p: '10px', color: 'white' }}
              aria-label="search"
            >
              <Search />
            </IconButton>
          </Paper>

          {/* Mobile Search Button */}
          <Tooltip title="Search">
            <IconButton
              color="inherit"
              onClick={() => navigate('/search')}
              sx={{ 
                display: { xs: 'flex', sm: 'none' },
                mr: 1,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)',
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <Search />
            </IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Dark Mode Toggle */}
            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton
                color="inherit"
                onClick={toggleDarkMode}
                sx={{ 
                  ml: 1,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Notifications - Only show when authenticated */}
            {user && (
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={handleNotificationOpen}
                  sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.08)',
                    }
                  }}
                >
                  <Badge badgeContent={currentNotificationCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* User Menu - Only show when authenticated and not mobile */}
            {user && !isMobile && (
              <Tooltip title="User Menu">
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{ 
                    ml: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.08)',
                    }
                  }}
                >
                  {user?.profile?.avatar ? (
                    <Avatar src={user.profile.avatar} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

             {/* Drawer */}
       <Drawer
         variant={isMobile ? 'temporary' : 'permanent'}
         open={isMobile ? drawerOpen : true}
         onClose={handleDrawerToggle}
         sx={{
           width: 280,
           flexShrink: 0,
           '& .MuiDrawer-paper': {
             width: 280,
             boxSizing: 'border-box',
             top: 0,
             height: '100%',
             zIndex: theme.zIndex.drawer,
             background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
             color: theme.palette.mode === 'dark' ? '#ECF0F1' : 'white',
             borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(236, 240, 241, 0.2)' : 'rgba(44, 62, 80, 0.1)'}`,
           },
         }}
       >
        <Toolbar /> {/* Spacer for AppBar */}
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 280px)` },
          mt: '64px', // AppBar height
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            minWidth: 350,
            maxHeight: 400
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications fontSize="small" />
            Notifications
          </Typography>
        </Box>
        
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              sx={{ 
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
                <Chip 
                  label={notification.type} 
                  size="small" 
                  color={notification.type === 'incident' ? 'error' : notification.type === 'alert' ? 'warning' : 'primary'}
                  variant="outlined"
                  sx={{ mt: 1, fontSize: '0.7rem' }}
                />
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%', py: 2 }}>
              No new notifications
            </Typography>
          </MenuItem>
        )}
        
        <Divider />
        <MenuItem onClick={handleMarkAllAsRead}>
          <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
            Mark all as read
          </Typography>
        </MenuItem>
      </Menu>

      {/* Emergency Snackbar */}
      <Snackbar
        open={emergencySnackbar.open}
        autoHideDuration={6000}
        onClose={() => setEmergencySnackbar({ ...emergencySnackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setEmergencySnackbar({ ...emergencySnackbar, open: false })} 
          severity={emergencySnackbar.severity}
          sx={{ width: '100%' }}
        >
          {emergencySnackbar.message}
        </Alert>
      </Snackbar>

      {/* Speed Dial for Quick Actions - Only show when authenticated */}
      {user && (
        <SpeedDial
          ariaLabel="Quick actions"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
            />
          ))}
        </SpeedDial>
      )}
    </Box>
  );
};

export default EnhancedNavbar; 
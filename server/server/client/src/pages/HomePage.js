import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Link
} from '@mui/material';
import {
  Security,
  Notifications,
  Map,
  People,
  Speed,
  VerifiedUser,
  ArrowForward,
  LocationOn,
  Warning,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();

  const features = [
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Real-Time Alerts',
      description: 'Get instant notifications about safety incidents in your neighborhood',
      color: theme.palette.primary.main
    },
    {
      icon: <Map sx={{ fontSize: 40 }} />,
      title: 'Interactive Map',
      description: 'View incidents on a live map with detailed location information',
      color: theme.palette.success.main
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Community Reports',
      description: 'Anonymous reporting system for community members',
      color: theme.palette.warning.main
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40 }} />,
      title: 'Verified Information',
      description: 'Integration with police and emergency services for verified alerts',
      color: theme.palette.secondary.main
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Fast Response',
      description: 'Quick incident reporting and emergency response coordination',
      color: theme.palette.error.main
    },
    {
      icon: <Notifications sx={{ fontSize: 40 }} />,
      title: 'Smart Notifications',
      description: 'Customizable alerts based on location and incident type',
      color: theme.palette.info.main
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: <People /> },
    { label: 'Incidents Reported', value: '50,000+', icon: <Security /> },
    { label: 'Cities Covered', value: '100+', icon: <LocationOn /> },
    { label: 'Response Time', value: '< 2 min', icon: <Speed /> }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(90deg, #081f37 0%, #1a4a6b 100%)',
          boxShadow: '0 4px 12px rgba(8, 31, 55, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          px: { xs: 1, md: 0 }
        }}
      >
        <Toolbar sx={{ px: { xs: 0, md: 2 } }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'white',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              },
              justifyContent: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' }
            }}
            onClick={() => navigate('/')}
          >
            🛡️ Neighborhood Safety Alert System
          </Typography>

          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{ 
                mr: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.10)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.20)',
                }
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: 'white',
                color: theme.palette.mode === 'dark' ? '#1a1a1a' : '#081f37',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#f8f9fa'
                }
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

               {/* Hero Section */}
         <Box
           sx={{
             background: 'linear-gradient(135deg, #F5F6FA 0%, #ECF0F1 100%)',
             color: '#2C3E50',
             py: { xs: 8, md: 16 },
             pt: { xs: 20, md: 20 },
             px: { xs: 2, sm: 4, md: 0 },
             position: 'relative',
             overflow: 'hidden',
             minHeight: '100vh',
             display: 'flex',
             alignItems: 'center'
           }}
         >
           {/* Background Pattern */}
           <Box
             sx={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               background: 'radial-gradient(circle at 20% 80%, rgba(44, 62, 80, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(231, 76, 60, 0.03) 0%, transparent 50%)',
               zIndex: 1
             }}
           />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                 <Typography
                   variant="h1"
                   component="h1"
                   sx={{
                     fontWeight: 800,
                     mb: { xs: 3, md: 4 },
                     fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                     lineHeight: { xs: 1.2, md: 1.1 },
                     textAlign: { xs: 'center', md: 'left' },
                     background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                     backgroundClip: 'text',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     letterSpacing: '-0.02em'
                   }}
                 >
                   Stay Safe, Stay Informed
                 </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    mb: { xs: 4, md: 6 },
                    opacity: 0.8,
                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                    lineHeight: { xs: 1.6, md: 1.5 },
                    textAlign: { xs: 'center', md: 'left' },
                    fontWeight: 400,
                    maxWidth: '600px'
                  }}
                >
                  Join thousands of community members who trust our real-time safety alert system to keep their neighborhoods secure.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                     <Button
                     variant="contained"
                     size="large"
                     onClick={handleGetStarted}
                     sx={{
                       bgcolor: '#2C3E50',
                       color: 'white',
                       px: 6,
                       py: 2,
                       fontSize: '1.1rem',
                       fontWeight: 600,
                       borderRadius: '8px',
                       boxShadow: '0 8px 32px rgba(44, 62, 80, 0.3)',
                       transition: 'all 0.3s ease',
                       '&:hover': {
                         bgcolor: '#34495E',
                         transform: 'translateY(-2px)',
                         boxShadow: '0 12px 40px rgba(44, 62, 80, 0.4)'
                       },
                       width: { xs: '100%', sm: 'auto' }
                     }}
                   >
                     Get Started
                     <ArrowForward sx={{ ml: 1, transition: 'transform 0.3s ease' }} />
                   </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: '#2C3E50',
                      color: '#2C3E50',
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '8px',
                      borderWidth: '2px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#34495E',
                        color: '#34495E',
                        bgcolor: 'rgba(44, 62, 80, 0.05)',
                        transform: 'translateY(-2px)'
                      },
                      width: { xs: '100%', sm: 'auto' },
                      mt: { xs: 2, sm: 0 }
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box
                  sx={{
                    width: { xs: 280, md: 400 },
                    height: { xs: 280, md: 400 },
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(0, 191, 166, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(0, 191, 166, 0.05) 0%, rgba(255, 107, 107, 0.05) 100%)',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Warning sx={{ fontSize: 120, opacity: 0.8 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF', 
        px: { xs: 2, sm: 4, md: 0 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2, 
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #FFFFFF 0%, #00BFA6 100%)'
                  : 'linear-gradient(135deg, #2D2D2D 0%, #00BFA6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Trusted by Communities
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(45,45,45,0.7)',
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Join thousands of active users keeping their neighborhoods safe
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 3, md: 4 },
                    bgcolor: theme.palette.mode === 'dark' ? '#2D2D2D' : '#F8F9FA',
                    borderRadius: '20px',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 8px 32px rgba(0,0,0,0.3)' 
                      : '0 8px 32px rgba(0,0,0,0.08)',
                    border: `1px solid ${theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.1)' 
                      : 'rgba(0,0,0,0.05)'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 16px 48px rgba(0,0,0,0.4)' 
                        : '0 16px 48px rgba(0,0,0,0.12)',
                      borderColor: '#00BFA6'
                    },
                    mb: { xs: 2, md: 0 }
                  }}
                >
                  <Box sx={{ 
                    color: '#00BFA6', 
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '16px',
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 191, 166, 0.1)' : 'rgba(0, 191, 166, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                    </Box>
                  </Box>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 1, 
                      color: theme.palette.mode === 'dark' ? 'white' : '#2D2D2D',
                      fontSize: { xs: '1.8rem', md: '2.2rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(45,45,45,0.7)',
                      fontWeight: 500
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: theme.palette.mode === 'dark' ? '#2D2D2D' : '#F8F9FA',
        px: { xs: 2, sm: 4, md: 0 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 3, 
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #FFFFFF 0%, #00BFA6 100%)'
                  : 'linear-gradient(135deg, #2D2D2D 0%, #00BFA6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Why Choose Our Platform?
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(45,45,45,0.7)', 
                fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                lineHeight: { xs: 1.6, md: 1.5 },
                fontWeight: 400
              }}
            >
              Comprehensive safety features designed to keep your community informed and protected
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.1)' 
                      : 'rgba(0,0,0,0.05)'}`,
                    borderRadius: '20px',
                    bgcolor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 8px 32px rgba(0,0,0,0.3)' 
                      : '0 8px 32px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 16px 48px rgba(0,0,0,0.4)' 
                        : '0 16px 48px rgba(0,0,0,0.12)',
                      borderColor: '#00BFA6'
                    },
                    mb: { xs: 2, md: 0 }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: { xs: 4, md: 5 } }}>
                    <Box sx={{ 
                      color: '#00BFA6', 
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: '20px',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 191, 166, 0.1)' : 'rgba(0, 191, 166, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}>
                        {React.cloneElement(feature.icon, { sx: { fontSize: 48 } })}
                      </Box>
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 3, 
                        color: theme.palette.mode === 'dark' ? 'white' : '#2D2D2D',
                        fontSize: { xs: '1.2rem', md: '1.4rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(45,45,45,0.7)',
                        lineHeight: 1.6,
                        fontSize: { xs: '0.95rem', md: '1rem' }
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)'
            : 'linear-gradient(135deg, #2D2D2D 0%, #1E1E1E 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: { xs: 2, sm: 4, md: 0 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(0, 191, 166, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)',
            zIndex: 1
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 800, 
                mb: 4, 
                fontSize: { xs: '2rem', md: '3rem' }, 
                lineHeight: { xs: 1.2, md: 1.1 },
                background: 'linear-gradient(135deg, #FFFFFF 0%, #00BFA6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Ready to Make Your Neighborhood Safer?
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 6, 
                opacity: 0.9, 
                fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                lineHeight: { xs: 1.6, md: 1.5 },
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Join thousands of community members who are already using our platform to stay informed and stay safe.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: '#2C3E50',
                color: 'white',
                px: 8,
                py: 3,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: '20px',
                boxShadow: '0 12px 40px rgba(44, 62, 80, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#34495E',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 48px rgba(44, 62, 80, 0.5)'
                }
              }}
            >
              Start Protecting Your Community
              <ArrowForward sx={{ ml: 2, transition: 'transform 0.3s ease' }} />
            </Button>
          </Box>
        </Container>
      </Box>

            {/* Footer */}
      <Box sx={{
        bgcolor: '#2C3E50',
        color: '#ECF0F1',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 4, md: 0 },
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(236, 240, 241, 0.1)' : 'rgba(44, 62, 80, 0.05)'}`
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontSize: { xs: '1.1rem', md: '1.25rem' }, 
                textAlign: { xs: 'center', md: 'left' },
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ECF0F1 0%, #34495E 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Neighborhood Safety Alert System
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.8,
                color: '#ECF0F1',
                lineHeight: 1.6
              }}>
                Empowering communities with real-time safety information and emergency alerts.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontSize: { xs: '1.1rem', md: '1.25rem' }, 
                textAlign: { xs: 'center', md: 'left' },
                fontWeight: 600,
                color: '#ECF0F1'
              }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#ECF0F1',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '8px 0',
                    minHeight: 'auto',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(236, 240, 241, 0.1)',
                      color: '#34495E'
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  sx={{
                    color: '#ECF0F1',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '8px 0',
                    minHeight: 'auto',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(236, 240, 241, 0.1)',
                      color: '#34495E'
                    }
                  }}
                >
                  Register
                </Button>
                <Button 
                  onClick={() => navigate('/safety')}
                  sx={{
                    color: '#ECF0F1',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '8px 0',
                    minHeight: 'auto',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(236, 240, 241, 0.1)',
                      color: '#34495E'
                    }
                  }}
                >
                  Safety Tips
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontSize: { xs: '1.1rem', md: '1.25rem' }, 
                textAlign: { xs: 'center', md: 'left' },
                fontWeight: 600,
                color: '#ECF0F1'
              }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.8, 
                mb: 1,
                color: '#ECF0F1'
              }}>
                Email: fikertetadesse1403@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.8, 
                mb: 1,
                color: '#ECF0F1'
              }}>
                Phone: +251967044111
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.8,
                color: '#ECF0F1'
              }}>
                Emergency: 911
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ 
            borderTop: '1px solid rgba(236, 240, 241, 0.1)', 
            mt: 4, 
            pt: 2, 
            textAlign: 'center' 
          }}>
            <Typography variant="body2" sx={{ 
              opacity: 0.6,
              color: '#ECF0F1',
              mb: 1
            }}>
              © 2024 Neighborhood Safety Alert System. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ 
              opacity: 0.8,
              color: '#ECF0F1'
            }}>
              Built by{' '}
              <Link 
                href="https://www.bisrat-tadesse.com" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{
                  color: '#ECF0F1',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#34495E'
                  }
                }}
              >
                Bisrate Tadesse
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 
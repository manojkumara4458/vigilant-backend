import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Container,
  Button,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Warning, 
  LocationOn, 
  People, 
  Security,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mock dashboard data - in a real app, this would come from API calls
  const [dashboardData, setDashboardData] = useState({
    activeMembers: 0,
    recentIncidents: 0,
    safetyScore: 85,
    neighborhoodStatus: 'Safe',
    lastUpdated: new Date().toLocaleDateString()
  });

  // Simulate loading real data
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setDashboardData({
        activeMembers: Math.floor(Math.random() * 50) + 10, // Random number between 10-60
        recentIncidents: Math.floor(Math.random() * 5), // Random number between 0-5
        safetyScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        neighborhoodStatus: 'Safe',
        lastUpdated: new Date().toLocaleDateString()
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 8, md: 4 }, 
        mb: 4,
        px: { xs: 2, md: 3 },
        pt: { xs: 2, md: 0 }
      }}
    >
      <Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
                     sx={{ 
             fontWeight: 700, 
             color: theme.palette.mode === 'dark' ? 'white' : '#2C3E50',
             fontSize: { xs: '1.5rem', md: '2.125rem' },
             textAlign: { xs: 'center', md: 'left' },
             mb: { xs: 2, md: 3 },
             lineHeight: { xs: 1.3, md: 1.2 }
           }}
        >
          Welcome back, {user?.firstName || 'User'}!
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }}>
                     {/* Recent Incidents */}
           <Grid item xs={12} md={6}>
             <Card 
               sx={{ 
                 height: { xs: 'auto', md: 200 },
                 mb: { xs: 2, md: 0 },
                 bgcolor: '#FFFFFF',
                 border: '1px solid rgba(44, 62, 80, 0.1)',
                 boxShadow: '0 4px 12px rgba(44, 62, 80, 0.1)'
               }}
             >
                             <CardHeader
                 title="Recent Incidents"
                 titleTypographyProps={{ 
                   variant: 'h6', 
                   color: '#2C3E50',
                   fontSize: { xs: '1rem', md: '1.125rem' }
                 }}
                action={
                  <Button 
                    size="small" 
                    onClick={() => navigate('/incidents')}
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: { xs: '0.75rem', md: '0.875rem' }
                    }}
                  >
                    View All
                  </Button>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning sx={{ color: theme.palette.warning.main, mr: 1 }} />
                  <Typography variant="h4" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                    {dashboardData.recentIncidents}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Incidents reported in the last 24 hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>

                     {/* Safety Score */}
           <Grid item xs={12} md={6}>
             <Card 
               sx={{ 
                 height: { xs: 'auto', md: 200 },
                 mb: { xs: 2, md: 0 },
                 bgcolor: '#FFFFFF',
                 border: '1px solid rgba(44, 62, 80, 0.1)',
                 boxShadow: '0 4px 12px rgba(44, 62, 80, 0.1)'
               }}
             >
               <CardHeader
                 title="Safety Score"
                 titleTypographyProps={{ 
                   variant: 'h6', 
                   color: '#2C3E50',
                   fontSize: { xs: '1rem', md: '1.125rem' }
                 }}
               />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle sx={{ color: theme.palette.success.main, mr: 1 }} />
                  <Typography variant="h4" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                    {dashboardData.safetyScore}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={dashboardData.safetyScore} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.1)' 
                      : 'rgba(0,0,0,0.1)'
                  }}
                />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                  Your neighborhood safety rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>

                     {/* Active Members */}
           <Grid item xs={12} md={4}>
             <Card 
               sx={{ 
                 height: { xs: 'auto', md: 150 },
                 mb: { xs: 2, md: 0 },
                 bgcolor: '#FFFFFF',
                 border: '1px solid rgba(44, 62, 80, 0.1)',
                 boxShadow: '0 4px 12px rgba(44, 62, 80, 0.1)'
               }}
             >
              <CardContent sx={{ textAlign: 'center' }}>
                <People sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h4" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 1 }}>
                  {dashboardData.activeMembers}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Active Community Members
                </Typography>
              </CardContent>
            </Card>
          </Grid>

                     {/* Neighborhood Status */}
           <Grid item xs={12} md={4}>
             <Card 
               sx={{ 
                 height: { xs: 'auto', md: 150 },
                 mb: { xs: 2, md: 0 },
                 bgcolor: '#FFFFFF',
                 border: '1px solid rgba(44, 62, 80, 0.1)',
                 boxShadow: '0 4px 12px rgba(44, 62, 80, 0.1)'
               }}
             >
              <CardContent sx={{ textAlign: 'center' }}>
                <LocationOn sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 1 }}>
                  {dashboardData.neighborhoodStatus}
                </Typography>
                <Chip 
                  label="Status" 
                  color="success" 
                  size="small"
                  sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                />
              </CardContent>
            </Card>
          </Grid>

                     {/* Quick Actions */}
           <Grid item xs={12} md={4}>
             <Card 
               sx={{ 
                 height: { xs: 'auto', md: 150 },
                 mb: { xs: 2, md: 0 },
                 bgcolor: '#FFFFFF',
                 border: '1px solid rgba(44, 62, 80, 0.1)',
                 boxShadow: '0 4px 12px rgba(44, 62, 80, 0.1)'
               }}
             >
              <CardContent sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 1 }}>
                  Quick Actions
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => navigate('/report')}
                  sx={{ 
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    px: { xs: 1, md: 2 }
                  }}
                >
                  Report Incident
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Last Updated */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Last updated: {dashboardData.lastUpdated}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage; 
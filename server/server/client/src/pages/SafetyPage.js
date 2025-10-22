import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Security, 
  Phone, 
  Warning, 
  Home 
} from '@mui/icons-material';

const SafetyPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 8, md: 4 }, 
        mb: 4, 
        px: { xs: 1, md: 3 },
        pt: { xs: 2, md: 0 }
      }}
    >
      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 700, 
          fontSize: { xs: '1.5rem', md: '2.125rem' },
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 2, md: 3 },
          lineHeight: { xs: 1.3, md: 1.2 }
        }}
      >
        Safety Resources
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                gutterBottom
                sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: { xs: 1, md: 2 }, textAlign: { xs: 'center', md: 'left' } }}
              >
                Emergency Contacts
              </Typography>
              <List>
                <ListItem sx={{ px: { xs: 0, md: 2 } }}>
                  <ListItemIcon>
                    <Phone color="error" sx={{ fontSize: { xs: '1.3rem', md: '1.7rem' } }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>Emergency: 911</Typography>} 
                  />
                </ListItem>
                <ListItem sx={{ px: { xs: 0, md: 2 } }}>
                  <ListItemIcon>
                    <Phone color="primary" sx={{ fontSize: { xs: '1.3rem', md: '1.7rem' } }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>Local Police: (555) 123-4567</Typography>} 
                  />
                </ListItem>
                <ListItem sx={{ px: { xs: 0, md: 2 } }}>
                  <ListItemIcon>
                    <Phone color="primary" sx={{ fontSize: { xs: '1.3rem', md: '1.7rem' } }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>Fire Department: (555) 987-6543</Typography>} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                gutterBottom
                sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: { xs: 1, md: 2 }, textAlign: { xs: 'center', md: 'left' } }}
              >
                Home Security Tips
              </Typography>
              <List>
                <ListItem sx={{ px: { xs: 0, md: 2 } }}>
                  <ListItemIcon>
                    <Home sx={{ fontSize: { xs: '1.3rem', md: '1.7rem' } }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>Install security cameras</Typography>} 
                  />
                </ListItem>
                <ListItem sx={{ px: { xs: 0, md: 2 } }}>
                  <ListItemIcon>
                    <Security sx={{ fontSize: { xs: '1.3rem', md: '1.7rem' } }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>Use motion sensor lights</Typography>} 
                  />
                </ListItem>
                <ListItem sx={{ px: { xs: 0, md: 2 } }}>
                  <ListItemIcon>
                    <Warning sx={{ fontSize: { xs: '1.3rem', md: '1.7rem' } }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>Keep doors and windows locked</Typography>} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SafetyPage; 
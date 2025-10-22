import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';

const SettingsPage = () => {
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
        Settings
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
                Notifications
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>Email notifications</Typography>}
                sx={{ display: 'block', mb: { xs: 1, md: 2 } }}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>Push notifications</Typography>}
                sx={{ display: 'block', mb: { xs: 1, md: 2 } }}
              />
              <FormControlLabel
                control={<Switch />}
                label={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>SMS alerts</Typography>}
                sx={{ display: 'block', mb: { xs: 1, md: 2 } }}
              />
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
                Privacy
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>Show profile to neighbors</Typography>}
                sx={{ display: 'block', mb: { xs: 1, md: 2 } }}
              />
              <FormControlLabel
                control={<Switch />}
                label={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>Share location</Typography>}
                sx={{ display: 'block', mb: { xs: 1, md: 2 } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsPage; 
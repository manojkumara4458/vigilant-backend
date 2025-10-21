import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Phone, 
  LocalPolice, 
  LocalFireDepartment, 
  LocalHospital,
  Warning,
  AccessTime
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmergencyContactsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const emergencyContacts = [
    {
      category: "Police Services",
      icon: <LocalPolice color="primary" />,
      contacts: [
        {
          name: "Emergency Police",
          number: "911",
          description: "General emergency number",
          available: "24/7",
          priority: "high"
        },
        {
          name: "Addis Ababa Police Commission",
          number: "+251 11 551 0000",
          description: "Main police headquarters",
          available: "24/7",
          priority: "high"
        },
        {
          name: "Traffic Police",
          number: "+251 11 551 0001",
          description: "Traffic incidents and violations",
          available: "24/7",
          priority: "medium"
        },
        {
          name: "Crime Prevention",
          number: "+251 11 551 0002",
          description: "Non-emergency crime reporting",
          available: "8:00 AM - 6:00 PM",
          priority: "medium"
        }
      ]
    },
    {
      category: "Fire & Rescue",
      icon: <LocalFireDepartment color="error" />,
      contacts: [
        {
          name: "Emergency Fire",
          number: "911",
          description: "Fire emergencies",
          available: "24/7",
          priority: "high"
        },
        {
          name: "Addis Ababa Fire Brigade",
          number: "+251 11 551 0003",
          description: "Fire department headquarters",
          available: "24/7",
          priority: "high"
        },
        {
          name: "Rescue Services",
          number: "+251 11 551 0004",
          description: "Search and rescue operations",
          available: "24/7",
          priority: "high"
        }
      ]
    },
    {
      category: "Medical Emergency",
      icon: <LocalHospital color="success" />,
      contacts: [
        {
          name: "Emergency Medical",
          number: "911",
          description: "Medical emergencies",
          available: "24/7",
          priority: "high"
        },
        {
          name: "Red Cross Ethiopia",
          number: "+251 11 551 0005",
          description: "Emergency medical services",
          available: "24/7",
          priority: "high"
        },
        {
          name: "Tikur Anbessa Hospital",
          number: "+251 11 551 0006",
          description: "Major trauma center",
          available: "24/7",
          priority: "high"
        },
        {
          name: "St. Paul's Hospital",
          number: "+251 11 551 0007",
          description: "Emergency care",
          available: "24/7",
          priority: "high"
        }
      ]
    },
    {
      category: "Other Emergency Services",
      icon: <Warning color="warning" />,
      contacts: [
        {
          name: "Poison Control",
          number: "+251 11 551 0008",
          description: "Poison information and treatment",
          available: "24/7",
          priority: "high"
        },
        {
          name: "Mental Health Crisis",
          number: "+251 11 551 0009",
          description: "Suicide prevention and crisis support",
          available: "24/7",
          priority: "high"
        },
        {
          name: "Child Protection",
          number: "+251 11 551 0010",
          description: "Child abuse and protection services",
          available: "8:00 AM - 6:00 PM",
          priority: "medium"
        },
        {
          name: "Domestic Violence Hotline",
          number: "+251 11 551 0011",
          description: "Domestic violence support",
          available: "24/7",
          priority: "high"
        }
      ]
    }
  ];

  const handleCall = (number) => {
    window.open(`tel:${number}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

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
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          mb: { xs: 2, md: 3 },
          gap: { xs: 2, md: 0 }
        }}
      >
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          component="h1" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            fontWeight: 700, 
            fontSize: { xs: '1.5rem', md: '2.125rem' },
            textAlign: { xs: 'center', md: 'left' },
            mb: { xs: 1, md: 0 },
            lineHeight: { xs: 1.3, md: 1.2 },
            width: { xs: '100%', md: 'auto' }
          }}
        >
          🚨 Emergency Contacts
        </Typography>
        <Button 
          variant="outlined"
          onClick={() => navigate('/safety')}
          sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 }, width: { xs: '100%', md: 'auto' } }}
        >
          Back to Safety Resources
        </Button>
      </Box>

      <Alert 
        severity="warning" 
        sx={{ 
          mb: { xs: 2, md: 3 },
          fontSize: { xs: '0.95rem', md: '1rem' },
          '& .MuiAlert-message': {
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: { xs: 1.4, md: 1.5 }
          }
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: { xs: '1.05rem', md: '1.1rem' } }}>
          🚨 In case of emergency, dial 911 immediately!
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
          This page contains important emergency contact numbers for Addis Ababa. Save these numbers in your phone for quick access.
        </Typography>
      </Alert>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {emergencyContacts.map((category) => (
          <Grid item xs={12} md={6} key={category.category}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 2 } }}>
                  {React.cloneElement(category.icon, { sx: { fontSize: { xs: '1.7rem', md: '2.2rem' } } })}
                  <Typography 
                    variant={isMobile ? 'h6' : 'h5'} 
                    sx={{ ml: 1, fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' }, textAlign: { xs: 'center', md: 'left' } }}
                  >
                    {category.category}
                  </Typography>
                </Box>
                <List>
                  {category.contacts.map((contact, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', px: { xs: 0, md: 2 } }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, width: '100%', mb: 1, gap: { xs: 1, md: 0 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <Phone color="action" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.1rem' } }}>
                                    {contact.name}
                                  </Typography>
                                  <Chip 
                                    label={contact.priority.toUpperCase()} 
                                    color={getPriorityColor(contact.priority)}
                                    size="small"
                                    sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                                    {contact.description}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <AccessTime fontSize="small" color="action" />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                                      {contact.available}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<Phone />}
                            onClick={() => handleCall(contact.number)}
                            sx={{ minWidth: 'auto', fontSize: { xs: '0.9rem', md: '1rem' }, mt: { xs: 1, md: 0 } }}
                          >
                            {contact.number}
                          </Button>
                        </Box>
                      </ListItem>
                      {index < category.contacts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Information */}
      <Card sx={{ mt: { xs: 2, md: 3 } }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            gutterBottom
            sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: { xs: 1, md: 2 }, textAlign: { xs: 'center', md: 'left' } }}
          >
            📋 Important Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
                When to Call Emergency Services:
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>• Life-threatening medical emergencies</Typography>} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>• Active fires or fire hazards</Typography>} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>• Crimes in progress or immediate danger</Typography>} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>• Serious traffic accidents with injuries</Typography>} />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
                Emergency Preparedness Tips:
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>• Save emergency numbers in your phone</Typography>} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>• Know your exact location and address</Typography>} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>• Stay calm and speak clearly when calling</Typography>} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={<Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>• Follow emergency operator instructions</Typography>} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmergencyContactsPage; 
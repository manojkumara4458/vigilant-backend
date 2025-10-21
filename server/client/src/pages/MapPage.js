import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup,
  Circle
} from 'react-leaflet';
import { 
  Refresh
} from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Addis Ababa coordinates
  const ADDIS_ABABA_CENTER = [9.145, 38.7636];
  
  // Sample incidents in Addis Ababa
  const sampleIncidents = [
    {
      id: 1,
      title: "Suspicious Activity - Bole Area",
      description: "Suspicious person loitering around Bole International Airport area",
      location: "Bole, Addis Ababa",
      coordinates: [8.9779, 38.7997],
      severity: "Medium",
      status: "Active",
      date: "2024-01-15",
      type: "Suspicious Activity",
      reporter: "Community Member"
    },
    {
      id: 2,
      title: "Vehicle Break-in - Kazanchis",
      description: "Attempted break-in of parked vehicle near Kazanchis commercial area",
      location: "Kazanchis, Addis Ababa",
      coordinates: [9.0272, 38.7369],
      severity: "High",
      status: "Resolved",
      date: "2024-01-14",
      type: "Vehicle Crime",
      reporter: "Local Business Owner"
    },
    {
      id: 3,
      title: "Traffic Incident - Meskel Square",
      description: "Minor traffic accident at Meskel Square intersection",
      location: "Meskel Square, Addis Ababa",
      coordinates: [9.0054, 38.7636],
      severity: "Low",
      status: "Active",
      date: "2024-01-15",
      type: "Traffic Incident",
      reporter: "Traffic Police"
    },
    {
      id: 4,
      title: "Safety Alert - Piazza Area",
      description: "Increased pickpocket activity reported in Piazza area",
      location: "Piazza, Addis Ababa",
      coordinates: [9.0321, 38.7489],
      severity: "Medium",
      status: "Active",
      date: "2024-01-13",
      type: "Theft",
      reporter: "Local Police"
    },
    {
      id: 5,
      title: "Community Watch - Entoto",
      description: "Neighborhood watch meeting scheduled for Entoto area",
      location: "Entoto, Addis Ababa",
      coordinates: [9.0084, 38.7636],
      severity: "Info",
      status: "Scheduled",
      date: "2024-01-20",
      type: "Community Event",
      reporter: "Community Leader"
    }
  ];

  useEffect(() => {
    setIncidents(sampleIncidents);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return '#d32f2f';
      case 'medium': return '#ed6c02';
      case 'low': return '#2e7d32';
      case 'info': return '#1976d2';
      default: return '#757575';
    }
  };

  const customIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">⚠️</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const handleRefresh = () => {
    // Simulate refreshing incidents
    console.log('Refreshing incidents...');
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container 
      maxWidth="xl" 
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
            fontWeight: 700, 
            fontSize: { xs: '1.5rem', md: '2.125rem' },
            textAlign: { xs: 'center', md: 'left' },
            mb: { xs: 1, md: 0 },
            lineHeight: { xs: 1.3, md: 1.2 }
          }}
        >
          🗺️ Addis Ababa Safety Map
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Map">
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Alert 
        severity="info" 
        sx={{ 
          mb: { xs: 2, md: 3 },
          fontSize: { xs: '0.95rem', md: '1rem' },
          '& .MuiAlert-message': {
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: { xs: 1.4, md: 1.5 }
          }
        }}
      >
        View recent safety incidents and alerts in Addis Ababa. Click on markers for detailed information.
      </Alert>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ height: { xs: '50vh', md: '70vh' }, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: '100%' }}>
              <MapContainer
                center={ADDIS_ABABA_CENTER}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Incident Markers */}
                {incidents.map((incident) => (
                  <Marker
                    key={incident.id}
                    position={incident.coordinates}
                    icon={customIcon(getSeverityColor(incident.severity))}
                    eventHandlers={{
                      click: () => setSelectedIncident(incident)
                    }}
                  >
                    <Popup>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                          {incident.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                          {incident.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip 
                            label={incident.severity} 
                            size="small"
                            sx={{ 
                              bgcolor: getSeverityColor(incident.severity),
                              color: 'white',
                              fontSize: { xs: '0.8rem', md: '0.9rem' },
                              fontWeight: 600
                            }}
                          />
                          <Chip 
                            label={incident.status} 
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                          />
                        </Box>
                        <Typography variant="caption" display="block" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                          📍 {incident.location}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                          📅 {new Date(incident.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                          👤 Reported by: {incident.reporter}
                        </Typography>
                      </Box>
                    </Popup>
                  </Marker>
                ))}

                {/* Safety Zones */}
                <Circle
                  center={[8.9779, 38.7997]}
                  radius={500}
                  pathOptions={{
                    color: '#1976d2',
                    fillColor: '#1976d2',
                    fillOpacity: 0.1
                  }}
                >
                  <Popup>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      🛡️ Bole Airport Security Zone
                    </Typography>
                  </Popup>
                </Circle>
              </MapContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                📊 Incident Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                  Total Incidents: {incidents.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                  Active Alerts: {incidents.filter(i => i.status === 'Active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                  Resolved: {incidents.filter(i => i.status === 'Resolved').length}
                </Typography>
              </Box>
              
              <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                🎯 Legend
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#d32f2f' }} />
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>High Severity</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ed6c02' }} />
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>Medium Severity</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2e7d32' }} />
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>Low Severity</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1976d2' }} />
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>Information</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {selectedIncident && (
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  📋 Selected Incident
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                  {selectedIncident.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                  {selectedIncident.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip 
                    label={selectedIncident.severity} 
                    size="small"
                    sx={{ 
                      bgcolor: getSeverityColor(selectedIncident.severity),
                      color: 'white',
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      fontWeight: 600
                    }}
                  />
                  <Chip 
                    label={selectedIncident.type} 
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MapPage; 
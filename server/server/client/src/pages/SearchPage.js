import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search,
  LocationOn,
  Security,
  Event,
  Clear,
  Visibility,
  Edit
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

// Move mockSearchResults outside the component
const mockSearchResults = {
  incidents: [
    {
      id: 1,
      title: 'Suspicious Activity Reported',
      description: 'Suspicious person loitering around the park area',
      location: 'Central Park',
      date: '2024-01-15',
      status: 'Active',
      severity: 'Medium',
      reporter: 'John Doe'
    },
    {
      id: 2,
      title: 'Vehicle Break-in Attempt',
      description: 'Attempted break-in of parked vehicle on Main Street',
      location: 'Main Street',
      date: '2024-01-14',
      status: 'Resolved',
      severity: 'High',
      reporter: 'Jane Smith'
    }
  ],
  locations: [
    {
      id: 1,
      name: 'Central Park',
      type: 'Public Space',
      safetyRating: 8.5,
      recentIncidents: 2,
      description: 'Popular community park with good lighting'
    },
    {
      id: 2,
      name: 'Main Street Shopping Center',
      type: 'Commercial',
      safetyRating: 7.2,
      recentIncidents: 1,
      description: 'Busy shopping area with security cameras'
    }
  ],
  community: [
    {
      id: 1,
      title: 'Neighborhood Watch Meeting',
      description: 'Monthly meeting to discuss community safety',
      date: '2024-01-20',
      participants: 15,
      organizer: 'Community Safety Committee'
    },
    {
      id: 2,
      title: 'Safety Awareness Campaign',
      description: 'Campaign to raise awareness about home security',
      date: '2024-01-25',
      participants: 8,
      organizer: 'Local Police Department'
    }
  ],
  safety: [
    {
      id: 1,
      title: 'Home Security Tips',
      description: 'Essential tips for securing your home',
      category: 'Home Security',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Emergency Contact Numbers',
      description: 'Important emergency contact information',
      category: 'Emergency',
      rating: 4.9
    }
  ]
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    incidents: [],
    locations: [],
    community: [],
    safety: []
  });

  const performSearch = useCallback(async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Filter mock results based on search query
    const filteredResults = {
      incidents: mockSearchResults.incidents.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      locations: mockSearchResults.locations.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      community: mockSearchResults.community.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      safety: mockSearchResults.safety.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
    setSearchResults(filteredResults);
    setLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [performSearch, searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      performSearch();
    }
  };

  // Auto-focus search input on mount
  useEffect(() => {
    const searchInput = document.querySelector('input[aria-label="search"]');
    if (searchInput && !searchQuery) {
      searchInput.focus();
    }
  }, [searchQuery]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'error';
      case 'resolved': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const tabLabels = [
    { label: 'Incidents', count: searchResults.incidents.length },
    { label: 'Locations', count: searchResults.locations.length },
    { label: 'Community', count: searchResults.community.length },
    { label: 'Safety Resources', count: searchResults.safety.length }
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 3 } }}>
      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        gutterBottom 
        sx={{ 
          fontWeight: 700, 
          fontSize: { xs: '1.5rem', md: '2.125rem' },
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 2, md: 3 },
          lineHeight: { xs: 1.3, md: 1.2 }
        }}
      >
        🔍 Search Results
      </Typography>

      {/* Search Bar */}
      <Paper 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: { xs: 3, md: 4 },
          borderRadius: '16px',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0,0,0,0.3)' 
            : '0 8px 32px rgba(0,0,0,0.08)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.05)'}`,
          background: theme.palette.mode === 'dark' ? '#2D2D2D' : '#F8F9FA'
        }}
      >
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search incidents, locations, community events, safety resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#00BFA6' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchParams({});
                      }}
                      sx={{ color: '#00BFA6' }}
                    >
                      <Clear />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00BFA6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFA6',
                  },
                },
              }
            }}
            sx={{ 
              fontSize: { xs: '1rem', md: '1.1rem' },
              '& .MuiInputBase-input': {
                fontSize: { xs: '1rem', md: '1.1rem' },
                padding: { xs: '16px 14px', md: '18px 16px' }
              }
            }}
          />
        </form>
      </Paper>

      {searchQuery && (
        <>
          {/* Search Filters and Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 2, md: 3 } }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
              {tabLabels.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      {tab.label}
                      <Chip
                        label={tab.count}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                      />
                    </Box>
                  }
                  sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Search Results */}
          {!loading && (
            <Box>
              {/* Incidents Tab */}
              {activeTab === 0 && (
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {searchResults.incidents.length > 0 ? (
                    searchResults.incidents.map((incident) => (
                      <Grid item xs={12} md={6} key={incident.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, md: 2 } }}>
                              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                                {incident.title}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                  label={incident.severity}
                                  color={getSeverityColor(incident.severity)}
                                  size="small"
                                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                                />
                                <Chip
                                  label={incident.status}
                                  color={getStatusColor(incident.status)}
                                  size="small"
                                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                                />
                              </Box>
                            </Box>
                            <Typography color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                              {incident.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>{incident.location}</Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                {new Date(incident.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                              Reported by: {incident.reporter}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Button size="small" startIcon={<Visibility />} sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}>
                                View Details
                              </Button>
                              <Button size="small" startIcon={<Edit />} sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}>
                                Update
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="info">No incidents found matching your search.</Alert>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Locations Tab */}
              {activeTab === 1 && (
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {searchResults.locations.length > 0 ? (
                    searchResults.locations.map((location) => (
                      <Grid item xs={12} md={6} key={location.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, md: 2 } }}>
                              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                                {location.name}
                              </Typography>
                              <Chip
                                label={`${location.safetyRating}/10`}
                                color="primary"
                                size="small"
                                sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                              />
                            </Box>
                            <Typography color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                              {location.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Chip label={location.type} size="small" variant="outlined" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                {location.recentIncidents} recent incidents
                              </Typography>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Button size="small" startIcon={<Visibility />} sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}>
                                View Details
                              </Button>
                              <Button size="small" startIcon={<LocationOn />} sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}>
                                View on Map
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="info">No locations found matching your search.</Alert>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Community Tab */}
              {activeTab === 2 && (
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {searchResults.community.length > 0 ? (
                    searchResults.community.map((event) => (
                      <Grid item xs={12} md={6} key={event.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                              {event.title}
                            </Typography>
                            <Typography color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                              {event.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                {new Date(event.date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                {event.participants} participants
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                              Organized by: {event.organizer}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Button size="small" startIcon={<Event />} sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}>
                                Join Event
                              </Button>
                              <Button size="small" startIcon={<Visibility />} sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}>
                                View Details
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="info">No community events found matching your search.</Alert>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Safety Resources Tab */}
              {activeTab === 3 && (
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {searchResults.safety.length > 0 ? (
                    searchResults.safety.map((resource) => (
                      <Grid item xs={12} md={6} key={resource.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, md: 2 } }}>
                              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                                {resource.title}
                              </Typography>
                              <Chip
                                label={`${resource.rating}/5`}
                                color="primary"
                                size="small"
                                sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                              />
                            </Box>
                            <Typography color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                              {resource.description}
                            </Typography>
                            <Chip label={resource.category} size="small" variant="outlined" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }} />
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Button size="small" startIcon={<Visibility />} sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}>
                                View Resource
                              </Button>
                              <Button size="small" startIcon={<Security />} sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}>
                                Safety Tips
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="info">No safety resources found matching your search.</Alert>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          )}
        </>
      )}

      {/* No Search Query State */}
      {!searchQuery && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant={isMobile ? 'h6' : 'h5'} color="text.secondary" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            Search for incidents, locations, community events, and safety resources
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
            Enter your search query above to get started
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SearchPage; 
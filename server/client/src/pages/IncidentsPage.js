import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Grid,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Add, 
  Search, 
  LocationOn, 
  Schedule, 
  Person,
  Visibility,
  Delete
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const IncidentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [isMyReports, setIsMyReports] = useState(false);
  const [isRecent, setIsRecent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check URL parameters for filtering
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get('filter');
    
    if (filterParam === 'my-reports') {
      setIsMyReports(true);
      setIsRecent(false);
    } else if (filterParam === 'recent') {
      setIsRecent(true);
      setIsMyReports(false);
    } else {
      setIsMyReports(false);
      setIsRecent(false);
    }
  }, [location.search]);

  // Fetch incidents from backend
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${process.env.REACT_APP_API_URL}/api/incidents`)
      .then(res => {
        setIncidents(res.data.incidents || []);
        setFilteredIncidents(res.data.incidents || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load incidents.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = incidents;

    // My Reports filter (highest priority)
    if (isMyReports && user && user._id) {
      filtered = filtered.filter(incident =>
        incident.reporter && typeof incident.reporter === 'object' && incident.reporter._id === user._id
      );
    }

    // Recent filter (shows incidents from last 7 days)
    if (isRecent) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      filtered = filtered.filter(incident => {
        const incidentDate = new Date(incident.createdAt);
        return incidentDate >= sevenDaysAgo;
      });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(incident => {
        const locationString = typeof incident.location === 'string'
          ? incident.location
          : incident.location && incident.location.address
            ? `${incident.location.address.street || ''} ${incident.location.address.city || ''}`
            : '';
        return (
          (incident.title && incident.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (incident.description && incident.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (locationString && locationString.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (incident.type && incident.type.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(incident =>
        incident.severity && incident.severity.toLowerCase() === severityFilter.toLowerCase()
      );
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchQuery, statusFilter, severityFilter, isMyReports, isRecent, user]);

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'error';
      case 'resolved': return 'success';
      case 'pending': return 'warning';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  const handleViewDetails = (incidentId) => {
    navigate(`/incidents/${incidentId}`);
  };

  const handleDelete = (incidentId) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this incident? This action cannot be undone.')) {
      // Remove from local state (in real app, this would be an API call)
      const updatedIncidents = incidents.filter(incident => incident._id !== incidentId); // Changed to _id for backend
      setIncidents(updatedIncidents);
      setFilteredIncidents(updatedIncidents);
      alert('Incident deleted successfully!');
    }
  };

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
          {isMyReports ? '📋 My Reports' : isRecent ? '🕒 Recent Incidents' : '🚨 All Incidents'}
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'center', md: 'flex-end' } }}>
          {(isMyReports || isRecent) && (
            <Button 
              variant="outlined"
              onClick={() => navigate('/incidents')}
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, py: { xs: 1, md: 1.5 }, width: { xs: '50%', md: 'auto' } }}
            >
              View All Incidents
            </Button>
          )}
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => navigate('/report')}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, py: { xs: 1, md: 1.5 }, width: { xs: (isMyReports || isRecent) ? '50%' : '100%', md: 'auto' } }}
          >
            Report Incident
          </Button>
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
        {isMyReports 
          ? "View and manage your reported incidents. Track their status and updates."
          : isRecent
          ? "View recent safety incidents from the last 7 days in Addis Ababa. Stay updated with the latest community safety alerts."
          : "View and track safety incidents in Addis Ababa. Report new incidents to help keep your community safe."
        }
      </Alert>

      {/* Search and Filters */}
      <Card sx={{ mb: { xs: 2, md: 3 }, p: { xs: 1, md: 2 } }}>
        <CardContent sx={{ p: { xs: 0, md: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severityFilter}
                  label="Severity"
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
                >
                  <MenuItem value="all">All Severity</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, textAlign: { xs: 'center', md: 'right' } }}
              >
                {filteredIncidents.length} incidents found
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Incidents List */}
      {loading ? (
        <Typography align="center" sx={{ mt: 4, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>Loading incidents...</Typography>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <Grid item xs={12} key={incident._id || incident.id}>
                <Card sx={{ p: { xs: 1, md: 2 } }}>
                  <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-start' }, mb: { xs: 1, md: 2 }, gap: { xs: 1, md: 0 } }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant={isMobile ? 'h6' : 'h5'} 
                          gutterBottom
                          sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: { xs: 0.5, md: 1 } }}
                        >
                          {incident.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          paragraph
                          sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: { xs: 1.4, md: 1.5 }, mb: { xs: 1, md: 2 } }}
                        >
                          {incident.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, md: 2 }, mt: { xs: 1, md: 0 }, alignItems: 'center' }}>
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
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 1, md: 3 }, mb: { xs: 1, md: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                          {typeof incident.location === 'string' ? incident.location :
                            incident.location && incident.location.address
                              ? `${incident.location.address.street || ''}${incident.location.address.city ? ', ' + incident.location.address.city : ''}`
                              : ''}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                          {new Date(incident.date).toLocaleDateString()} at {incident.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                          {incident.reporter && typeof incident.reporter === 'object'
                            ? `${incident.reporter.firstName || ''} ${incident.reporter.lastName || ''}`.trim()
                            : incident.reporter || ''}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: { xs: 1, md: 2 } }} />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 1, md: 0 } }}>
                      <Chip 
                        label={incident.type} 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600, mb: { xs: 1, md: 0 } }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewDetails(incident._id || incident.id)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(incident._id || incident.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    align="center"
                    sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, py: { xs: 2, md: 3 } }}
                  >
                    No incidents found matching your criteria. Try adjusting your filters or search terms.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default IncidentsPage; 
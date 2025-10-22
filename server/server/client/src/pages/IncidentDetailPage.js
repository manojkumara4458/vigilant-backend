import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Chip,
  Grid,
  Alert,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  ArrowBack, 
  LocationOn, 
  Schedule, 
  Person, 
  Warning,
  Edit,
  Delete
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const IncidentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${process.env.REACT_APP_API_URL}/api/incidents/${id}`)
      .then(res => {
        setIncident(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Incident not found or server error.');
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    setEditForm({
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      status: incident.status,
      type: incident.type
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setIncident({
      ...incident,
      ...editForm
    });
    setEditDialogOpen(false);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    navigate('/incidents');
  };

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Loading incident details...
        </Typography>
      </Container>
    );
  }

  if (error || !incident) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Incident Not Found
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "The incident you're looking for doesn't exist or has been removed."}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/incidents')}
        >
          Back to Incidents
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/incidents')}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Incident Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Incident">
            <IconButton onClick={handleEdit} color="primary">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Incident">
            <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Incident Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {incident.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={incident.severity}
                    color={getSeverityColor(incident.severity)}
                    size="small"
                  />
                  <Chip
                    label={incident.status}
                    color={getStatusColor(incident.status)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {incident.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="medium">Location:</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                    {typeof incident.location === 'string' ? incident.location :
                      incident.location && incident.location.address
                        ? `${incident.location.address.street || ''}${incident.location.address.city ? ', ' + incident.location.address.city : ''}`
                        : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="medium">Date & Time:</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                    {new Date(incident.date).toLocaleDateString()} at {incident.time}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="medium">Reported by:</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                    {incident.reporter && typeof incident.reporter === 'object'
                      ? `${incident.reporter.firstName || ''} ${incident.reporter.lastName || ''}`.trim()
                      : incident.reporter || ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Warning fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="medium">Type:</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                    {incident.type}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Updates Section */}
          {incident.updates && incident.updates.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Updates
                </Typography>
                {incident.updates.map((update, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(update.date).toLocaleDateString()} at {update.time}
                    </Typography>
                    <Typography variant="body1">
                      {update.message}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  fullWidth
                >
                  Edit Incident
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  fullWidth
                >
                  Delete Incident
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Incident</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={editForm.title || ''}
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              fullWidth
            />
            <TextField
              label="Description"
              value={editForm.description || ''}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={editForm.severity || ''}
                label="Severity"
                onChange={(e) => setEditForm({...editForm, severity: e.target.value})}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Info">Info</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status || ''}
                label="Status"
                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={editForm.type || ''}
                label="Type"
                onChange={(e) => setEditForm({...editForm, type: e.target.value})}
              >
                <MenuItem value="Suspicious Activity">Suspicious Activity</MenuItem>
                <MenuItem value="Vehicle Crime">Vehicle Crime</MenuItem>
                <MenuItem value="Traffic Incident">Traffic Incident</MenuItem>
                <MenuItem value="Theft">Theft</MenuItem>
                <MenuItem value="Infrastructure">Infrastructure</MenuItem>
                <MenuItem value="Community Event">Community Event</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Incident</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this incident? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IncidentDetailPage; 
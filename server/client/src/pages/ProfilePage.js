import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Badge,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  AlertTitle,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit,
  Security,
  Notifications,
  LocationOn,
  Phone,
  Email,
  Person,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  Lock,
  History,
  Settings,
  VerifiedUser,
  Warning,
  CheckCircle,
  Info,
  CalendarToday,
  Map,
  Shield,
  Language,
  Palette,
  Download,
  Upload,
  Delete,
  Add,
  Star,
  StarBorder
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    neighborhood: user?.neighborhood || '',
    emergencyContact: user?.emergencyContact || '',
    bio: user?.bio || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    locationSharing: true,
    language: 'en',
    privacyLevel: 'community'
  });

  // Mock activity data
  const activityHistory = [
    {
      id: 1,
      action: 'Reported Incident',
      description: 'Suspicious activity on Main Street',
      timestamp: '2024-02-10T14:30:00',
      type: 'incident'
    },
    {
      id: 2,
      action: 'Joined Neighborhood Watch',
      description: 'Became a member of the community watch program',
      timestamp: '2024-02-08T10:15:00',
      type: 'community'
    },
    {
      id: 3,
      action: 'Updated Profile',
      description: 'Changed contact information',
      timestamp: '2024-02-05T16:45:00',
      type: 'profile'
    },
    {
      id: 4,
      action: 'Attended Meeting',
      description: 'Monthly neighborhood safety meeting',
      timestamp: '2024-02-01T19:00:00',
      type: 'meeting'
    }
  ];

  // Mock security events
  const securityEvents = [
    {
      id: 1,
      event: 'Password Changed',
      timestamp: '2024-02-10T14:30:00',
      location: 'Addis Ababa, Ethiopia',
      device: 'Chrome on Windows',
      status: 'success'
    },
    {
      id: 2,
      event: 'Login Attempt',
      timestamp: '2024-02-08T10:15:00',
      location: 'Addis Ababa, Ethiopia',
      device: 'Mobile App',
      status: 'success'
    },
    {
      id: 3,
      event: 'Failed Login',
      timestamp: '2024-02-05T16:45:00',
      location: 'Unknown Location',
      device: 'Unknown Device',
      status: 'failed'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileEdit = () => {
    setEditMode(true);
  };

  const handleProfileSave = () => {
    // Simulate API call
    console.log('Saving profile:', profileForm);
    setEditMode(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleProfileCancel = () => {
    setProfileForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      neighborhood: user?.neighborhood || '',
      emergencyContact: user?.emergencyContact || '',
      bio: user?.bio || ''
    });
    setEditMode(false);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    // Simulate API call
    console.log('Changing password');
    setShowPasswordDialog(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePreferenceChange = (setting) => {
    setPreferences(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'incident': return <Warning color="error" />;
      case 'community': return <Person color="primary" />;
      case 'profile': return <Edit color="info" />;
      case 'meeting': return <CalendarToday color="success" />;
      default: return <Info color="action" />;
    }
  };

  const getSecurityStatusColor = (status) => {
    return status === 'success' ? 'success' : 'error';
  };

  const getSecurityStatusIcon = (status) => {
    return status === 'success' ? <CheckCircle /> : <Warning />;
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 8, md: 4 }, 
        mb: 4, 
        px: { xs: 0, md: 3 },
        pt: { xs: 2, md: 0 },
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden',
        minWidth: 0
      }}
    >
      {/* Success/Error Alerts */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowSuccess(false)}>
          Profile updated successfully!
        </Alert>
      )}
      
      {showError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setShowError(false)}>
          Passwords do not match. Please try again.
        </Alert>
      )}

      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        component="h1" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          fontWeight: 700, 
          fontSize: { xs: '1.5rem', md: '2.125rem' },
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 2, md: 3 },
          lineHeight: { xs: 1.3, md: 1.2 }
        }}
      >
        👤 User Profile
      </Typography>

      {/* Profile Header */}
      <Card sx={{ mb: { xs: 2, md: 3 }, width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 700 }, mx: { xs: -1, md: 0 } }}>
        <CardContent>
          <Grid 
            container 
            spacing={{ xs: 2, md: 3 }} 
            alignItems="center" 
            direction={isMobile ? 'column' : 'row'}
            justifyContent={isMobile ? 'center' : 'flex-start'}
            sx={{ textAlign: isMobile ? 'center' : 'left', width: '100%', minWidth: 0 }}
          >
            <Grid item xs={12} sm={12} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar sx={{ width: 100, height: 100, fontSize: { xs: '2.5rem', md: '3rem' }, mx: isMobile ? 'auto' : 0 }}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Avatar>
              </Badge>
            </Grid>
            <Grid item xs={12} sm={12} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' }, mt: isMobile ? 2 : 0 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                {user?.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <Chip 
                  icon={<VerifiedUser />} 
                  label="Verified Member" 
                  color="success" 
                  variant="outlined" 
                  size="small" 
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                />
                <Chip 
                  icon={<Shield />} 
                  label="Neighborhood Watch" 
                  color="primary" 
                  variant="outlined" 
                  size="small" 
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                />
                <Chip 
                  icon={<Star />} 
                  label="Active User" 
                  color="warning" 
                  variant="outlined" 
                  size="small" 
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleProfileEdit}
                disabled={editMode}
                sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 }, width: { xs: '100%', sm: 'auto' }, mt: isMobile ? 2 : 0 }}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 2, md: 3 } }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
          <Tab label="Profile Information" icon={<Person />} sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }} />
          <Tab label="Security" icon={<Security />} sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }} />
          <Tab label="Preferences" icon={<Settings />} sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }} />
          <Tab label="Activity History" icon={<History />} sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 700 }, mx: { xs: -1, md: 0 } }}>
            <Card sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 700 }, mx: { xs: -1, md: 0 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person />
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Neighborhood"
                      value={profileForm.neighborhood}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      value={profileForm.emergencyContact}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!editMode}
                      margin="normal"
                      placeholder="Tell us about yourself and your commitment to community safety..."
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleProfileSave}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleProfileCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 400 }, mx: { xs: -1, md: 0 } }}>
            <Card sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 400 }, mx: { xs: -1, md: 0 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security />
                  Account Status
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Verified" 
                      secondary="Your email address is confirmed"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone Verified" 
                      secondary="Your phone number is confirmed"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Two-Factor Auth" 
                      secondary="Enhanced security enabled"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Location Verified" 
                      secondary="Your address is confirmed"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 700 }, mx: { xs: -1, md: 0 } }}>
            <Card sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 700 }, mx: { xs: -1, md: 0 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security />
                  Security Settings
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Change Password" 
                      secondary="Update your account password"
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setShowPasswordDialog(true)}
                      >
                        Change
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Two-Factor Authentication" 
                      secondary="Add an extra layer of security"
                    />
                    <ListItemSecondaryAction>
                      <Switch checked={true} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Location Sharing" 
                      secondary="Allow location access for safety alerts"
                    />
                    <ListItemSecondaryAction>
                      <Switch checked={preferences.locationSharing} onChange={() => handlePreferenceChange('locationSharing')} />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Recent Security Events
                </Typography>
                
                <List>
                  {securityEvents.map((event) => (
                    <ListItem key={event.id}>
                      <ListItemIcon>
                        {getSecurityStatusIcon(event.status)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={event.event}
                        secondary={`${new Date(event.timestamp).toLocaleString()} • ${event.location} • ${event.device}`}
                      />
                      <Chip 
                        label={event.status} 
                        color={getSecurityStatusColor(event.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 400 }, mx: { xs: -1, md: 0 } }}>
            <Card sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 400 }, mx: { xs: -1, md: 0 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Score
                </Typography>
                
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" color="success.main" gutterBottom>
                    95%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Excellent security score
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <AlertTitle>Security Tips</AlertTitle>
                  • Use a strong, unique password<br/>
                  • Enable two-factor authentication<br/>
                  • Keep your location sharing enabled<br/>
                  • Regularly review security events
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 700 }, mx: { xs: -1, md: 0 } }}>
            <Card sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 700 }, mx: { xs: -1, md: 0 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Settings />
                  Notification Preferences
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Notifications" 
                      secondary="Receive safety alerts via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch checked={preferences.emailNotifications} onChange={() => handlePreferenceChange('emailNotifications')} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText 
                      primary="SMS Notifications" 
                      secondary="Receive urgent alerts via SMS"
                    />
                    <ListItemSecondaryAction>
                      <Switch checked={preferences.smsNotifications} onChange={() => handlePreferenceChange('smsNotifications')} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Push Notifications" 
                      secondary="Receive app notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch checked={preferences.pushNotifications} onChange={() => handlePreferenceChange('pushNotifications')} />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Privacy Settings
                </Typography>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Privacy Level</InputLabel>
                  <Select
                    value={preferences.privacyLevel}
                    label="Privacy Level"
                    onChange={(e) => setPreferences(prev => ({ ...prev, privacyLevel: e.target.value }))}
                  >
                    <MenuItem value="public">Public - Show profile to everyone</MenuItem>
                    <MenuItem value="community">Community - Show to neighborhood members</MenuItem>
                    <MenuItem value="private">Private - Show only to verified members</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={preferences.language}
                    label="Language"
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="am">Amharic</MenuItem>
                    <MenuItem value="or">Oromo</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch 
                      checked={darkMode} 
                      onChange={toggleDarkMode} 
                    />
                  }
                  label="Dark Mode"
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 400 }, mx: { xs: -1, md: 0 } }}>
            <Card sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 400 }, mx: { xs: -1, md: 0 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data & Privacy
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Download />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Export Data" 
                      secondary="Download your personal data"
                    />
                    <ListItemSecondaryAction>
                      <Button size="small">Export</Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Delete />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Delete Account" 
                      secondary="Permanently delete your account"
                    />
                    <ListItemSecondaryAction>
                      <Button 
                        size="small" 
                        color="error"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        Delete
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Card sx={{ width: { xs: '100vw', md: 'auto' }, maxWidth: { xs: '100vw', md: 700 }, mx: { xs: -1, md: 0 } }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History />
              Activity History
            </Typography>
            
            <List>
              {activityHistory.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemIcon>
                    {getActivityIcon(activity.type)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={activity.action}
                    secondary={`${activity.description} • ${new Date(activity.timestamp).toLocaleString()}`}
                  />
                  <Chip 
                    label={activity.type} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth fullScreen={isMobile} PaperProps={{ sx: { width: '100vw', maxWidth: '100vw', m: 0 } }}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type={showPassword ? 'text' : 'password'}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <TextField
            fullWidth
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" fullWidth fullScreen={isMobile} PaperProps={{ sx: { width: '100vw', maxWidth: '100vw', m: 0 } }}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Warning</AlertTitle>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete your account? This will remove all your:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Profile information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Incident reports" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Community contributions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Activity history" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete Account</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage; 
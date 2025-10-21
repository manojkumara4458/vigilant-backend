import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  People,
  Security,
  Event,
  LocationOn,
  Phone,
  Email,
  CheckCircle,
  Add,
  Close,
  Forum,
  Comment,
  ThumbUp,
  Share,
  MoreVert,
  Send,
  NavigateNext,
  KeyboardArrowUp
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const CommunityPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [joinForm, setJoinForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    availability: '',
    interests: []
  });
  const [isJoined, setIsJoined] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [suggestEventDialogOpen, setSuggestEventDialogOpen] = useState(false);
  const [suggestEventForm, setSuggestEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: ''
  });
  const [showEventSuccess, setShowEventSuccess] = useState(false);
  const [forumDialogOpen, setForumDialogOpen] = useState(false);
  const [newPostForm, setNewPostForm] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [showPostSuccess, setShowPostSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle URL parameters for section scrolling
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section) {
      // Use a longer delay to ensure the page is fully rendered
      setTimeout(() => {
        scrollToSection(section);
      }, 800);
    }
  }, [location.search]);

  // Sample community data
  const neighborhoodWatchMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Coordinator',
      area: 'Bole District',
      phone: '+251 91 123 4567',
      email: 'sarah.j@email.com',
      status: 'active',
      joinedDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Patrol Leader',
      area: 'Kazanchis District',
      phone: '+251 92 234 5678',
      email: 'michael.c@email.com',
      status: 'active',
      joinedDate: '2023-02-20'
    },
    {
      id: 3,
      name: 'Amina Hassan',
      role: 'Member',
      area: 'Piazza District',
      phone: '+251 93 345 6789',
      email: 'amina.h@email.com',
      status: 'active',
      joinedDate: '2023-03-10'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Community Safety Meeting',
      date: '2024-02-15',
      time: '19:00',
      location: 'Bole Community Center',
      description: 'Monthly meeting to discuss neighborhood safety concerns and updates.',
      attendees: 25,
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Neighborhood Watch Training',
      date: '2024-02-22',
      time: '14:00',
      location: 'Kazanchis Police Station',
      description: 'Training session for new neighborhood watch members.',
      attendees: 15,
      type: 'training'
    },
    {
      id: 3,
      title: 'Community Clean-up Day',
      date: '2024-03-01',
      time: '09:00',
      location: 'Piazza Area',
      description: 'Volunteer event to clean up the neighborhood and improve safety.',
      attendees: 40,
      type: 'volunteer'
    }
  ];

  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      title: 'Suspicious Activity on Main Street',
      content: 'I noticed some suspicious activity near the corner store on Main Street yesterday evening. Has anyone else seen anything unusual in that area?',
      author: 'Sarah Johnson',
      authorAvatar: 'S',
      category: 'Safety Alert',
      timestamp: '2024-02-10T14:30:00',
      likes: 12,
      comments: 8,
      isLiked: false
    },
    {
      id: 2,
      title: 'Neighborhood Watch Success Story',
      content: 'Thanks to our neighborhood watch program, we were able to prevent a potential break-in last week. The quick response from our community members made all the difference!',
      author: 'Michael Chen',
      authorAvatar: 'M',
      category: 'Success Story',
      timestamp: '2024-02-08T10:15:00',
      likes: 25,
      comments: 15,
      isLiked: true
    },
    {
      id: 3,
      title: 'Community Garden Project Proposal',
      content: 'I\'m proposing we start a community garden in the vacant lot on Oak Street. This could help bring neighbors together and improve the area. What do you think?',
      author: 'Amina Hassan',
      authorAvatar: 'A',
      category: 'Community Project',
      timestamp: '2024-02-05T16:45:00',
      likes: 18,
      comments: 12,
      isLiked: false
    },
    {
      id: 4,
      title: 'Street Light Outage Report',
      content: 'The street light on Pine Street has been out for 3 days now. I\'ve reported it to the city, but thought I should let everyone know to be extra careful when walking in that area at night.',
      author: 'David Wilson',
      authorAvatar: 'D',
      category: 'Infrastructure',
      timestamp: '2024-02-03T19:20:00',
      likes: 9,
      comments: 6,
      isLiked: false
    }
  ]);

  const handleJoinClick = () => {
    setJoinDialogOpen(true);
  };

  const handleJoinClose = () => {
    setJoinDialogOpen(false);
    setJoinForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      availability: '',
      interests: []
    });
  };

  const handleJoinSubmit = () => {
    // Simulate API call
    console.log('Joining neighborhood watch:', joinForm);
    
    // Show success message
    setShowSuccess(true);
    setIsJoined(true);
    setJoinDialogOpen(false);
    
    // Reset form
    setJoinForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      availability: '',
      interests: []
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleInputChange = (field, value) => {
    setJoinForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSuggestEventClick = () => {
    setSuggestEventDialogOpen(true);
  };

  const handleSuggestEventClose = () => {
    setSuggestEventDialogOpen(false);
    setSuggestEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: '',
      organizerName: '',
      organizerEmail: '',
      organizerPhone: ''
    });
  };

  const handleSuggestEventSubmit = () => {
    // Simulate API call
    console.log('Suggesting event:', suggestEventForm);
    
    // Show success message
    setShowEventSuccess(true);
    setSuggestEventDialogOpen(false);
    
    // Reset form
    setSuggestEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: '',
      organizerName: '',
      organizerEmail: '',
      organizerPhone: ''
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowEventSuccess(false);
    }, 5000);
  };

  const handleEventInputChange = (field, value) => {
    setSuggestEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleForumClick = () => {
    setForumDialogOpen(true);
  };

  const handleForumClose = () => {
    setForumDialogOpen(false);
    setNewPostForm({
      title: '',
      content: '',
      category: ''
    });
  };

  const handleNewPostSubmit = () => {
    // Create new post
    const newPost = {
      id: Date.now(), // Simple ID generation
      title: newPostForm.title,
      content: newPostForm.content,
      author: 'You',
      authorAvatar: 'Y',
      category: newPostForm.category,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    // Add to forum posts
    setForumPosts(prevPosts => [newPost, ...prevPosts]);
    
    // Show success message
    setShowPostSuccess(true);
    setForumDialogOpen(false);
    
    // Reset form
    setNewPostForm({
      title: '',
      content: '',
      category: ''
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowPostSuccess(false);
    }, 5000);
  };

  const handlePostInputChange = (field, value) => {
    setNewPostForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLikePost = (postId) => {
    setForumPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked 
            }
          : post
      )
    );
  };

  const handleCommentPost = (postId) => {
    // Open comment dialog for the specific post
    setCommentDialogOpen(true);
    setSelectedPostId(postId);
  };

  const handleSharePost = (postId) => {
    const post = forumPosts.find(p => p.id === postId);
    if (post && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      }).catch(err => {
        console.log('Share failed:', err);
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${post.title}\n\n${post.content}\n\nShared from Community Forum`);
        alert('Post content copied to clipboard!');
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const post = forumPosts.find(p => p.id === postId);
      navigator.clipboard.writeText(`${post.title}\n\n${post.content}\n\nShared from Community Forum`);
      alert('Post content copied to clipboard!');
    }
  };

  const handleCommentClose = () => {
    setCommentDialogOpen(false);
    setSelectedPostId(null);
    setCommentText('');
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      // Add comment to the post
      setForumPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === selectedPostId 
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );
      
      // Show success message
      alert('Comment added successfully!');
      
      // Close dialog and reset
      handleCommentClose();
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Safety Alert': return 'error';
      case 'Success Story': return 'success';
      case 'Community Project': return 'primary';
      case 'Infrastructure': return 'warning';
      default: return 'default';
    }
  };

  const scrollToSection = (sectionId) => {
    // Set active section
    setActiveSection(sectionId);
    
    // Wait for the page to be fully rendered
    const waitForElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Scroll to the element
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add highlight effect
        element.style.transition = 'all 0.3s ease';
        element.style.boxShadow = '0 0 30px rgba(25, 118, 210, 0.5)';
        element.style.transform = 'scale(1.02)';
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          element.style.boxShadow = '';
          element.style.transform = '';
        }, 3000);
        
        return true;
      }
      return false;
    };

    // Try immediately
    if (!waitForElement()) {
      // If not found, try again after a short delay
      setTimeout(() => {
        if (!waitForElement()) {
          // If still not found, try one more time with longer delay
          setTimeout(waitForElement, 500);
        }
      }, 100);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting': return <People color="primary" />;
      case 'training': return <Security color="success" />;
      case 'volunteer': return <Event color="warning" />;
      default: return <Event color="action" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'training': return 'success';
      case 'volunteer': return 'warning';
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
        👥 Community
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowSuccess(false)}>
          🎉 Successfully joined the Neighborhood Watch! Welcome to the community. You'll receive updates about meetings and events.
        </Alert>
      )}

      {showEventSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowEventSuccess(false)}>
          🎉 Event suggestion submitted successfully! We'll review your suggestion and get back to you soon.
        </Alert>
      )}

      {showPostSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowPostSuccess(false)}>
          🎉 Forum post created successfully! Your post is now visible to the community.
        </Alert>
      )}

      {/* Quick Navigation */}
      <Card sx={{ mb: { xs: 2, md: 3 }, p: { xs: 1, md: 2 } }}>
        <CardContent sx={{ p: { xs: 0, md: 2 } }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            <NavigateNext color="primary" />
            Quick Navigation
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Security />}
              onClick={() => scrollToSection('neighborhood-watch')}
              sx={{ minWidth: { xs: 120, md: 200 }, fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 } }}
            >
              Neighborhood Watch
            </Button>
            <Button
              variant="outlined"
              startIcon={<Event />}
              onClick={() => scrollToSection('community-events')}
              sx={{ minWidth: { xs: 120, md: 200 }, fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 } }}
            >
              Community Events
            </Button>
            <Button
              variant="outlined"
              startIcon={<Forum />}
              onClick={() => scrollToSection('community-forum')}
              sx={{ minWidth: { xs: 120, md: 200 }, fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 } }}
            >
              Community Forum
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Neighborhood Watch Section */}
        <Grid item xs={12} md={8}>
          <Card id="neighborhood-watch">
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1, md: 2 } }}>
                <Typography 
                  variant={isMobile ? 'h6' : 'h5'} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    color: activeSection === 'neighborhood-watch' ? 'secondary.main' : 'primary.main',
                    fontWeight: activeSection === 'neighborhood-watch' ? 'bold' : 600,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  <Security color={activeSection === 'neighborhood-watch' ? 'secondary' : 'primary'} />
                  🛡️ Neighborhood Watch
                  {activeSection === 'neighborhood-watch' && ' (Active)'}
                </Typography>
                <Chip 
                  label={isJoined ? "Member" : "Join Now"} 
                  color={isJoined ? "success" : "primary"}
                  icon={isJoined ? <CheckCircle /> : <Add />}
                  onClick={!isJoined ? handleJoinClick : undefined}
                  clickable={!isJoined}
                  sx={{ cursor: !isJoined ? 'pointer' : 'default', fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                Connect with your neighbors and stay informed about community safety. Join our neighborhood watch program to help keep our community safe.
              </Typography>

              <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, mb: { xs: 2, md: 3 }, flexDirection: { xs: 'column', md: 'row' } }}>
                <Button 
                  variant="contained" 
                  onClick={handleJoinClick}
                  disabled={isJoined}
                  startIcon={<People />}
                  sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 }, width: { xs: '100%', md: 'auto' } }}
                >
                  {isJoined ? 'Already Joined' : 'Join Neighborhood Watch'}
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/safety')}
                  sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 }, width: { xs: '100%', md: 'auto' } }}
                >
                  Safety Resources
                </Button>
              </Box>

              <Divider sx={{ my: { xs: 1, md: 2 } }} />

              <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Current Members ({neighborhoodWatchMembers.length})
              </Typography>
              
              <List>
                {neighborhoodWatchMembers.map((member) => (
                  <ListItem key={member.id} sx={{ px: 0, flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 1, md: 0 } }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 40, md: 40 }, height: { xs: 40, md: 40 } }}>
                        {member.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 0.5, md: 1 } }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                            {member.name}
                          </Typography>
                          <Chip 
                            label={member.role} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                            {member.area} • {member.phone}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            Joined: {new Date(member.joinedDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, md: 0 } }}>
                      <Tooltip title="Call">
                        <IconButton size="small" onClick={() => window.open(`tel:${member.phone}`)}>
                          <Phone />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Email">
                        <IconButton size="small" onClick={() => window.open(`mailto:${member.email}`)}>
                          <Email />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Community Events Section */}
        <Grid item xs={12} md={4}>
          <Card id="community-events">
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  color: activeSection === 'community-events' ? 'secondary.main' : 'primary.main',
                  fontWeight: activeSection === 'community-events' ? 'bold' : 600,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                <Event color={activeSection === 'community-events' ? 'secondary' : 'primary'} />
                📅 Upcoming Events
                {activeSection === 'community-events' && ' (Active)'}
              </Typography>
              
              {upcomingEvents.length > 0 ? (
                <List>
                  {upcomingEvents.map((event) => (
                    <ListItem key={event.id} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getEventIcon(event.type)}
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.1rem' } }}>
                          {event.title}
                        </Typography>
                        <Chip 
                          label={event.type} 
                          size="small" 
                          color={getEventColor(event.type)}
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        {event.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Event fontSize="small" color="action" />
                          <Typography variant="caption" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="caption" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {event.location}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <People fontSize="small" color="action" />
                        <Typography variant="caption" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                          {event.attendees} attending
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                  No upcoming events scheduled.
                </Typography>
              )}
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2, fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 } }}
                startIcon={<Add />}
                onClick={handleSuggestEventClick}
              >
                Suggest Event
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Community Forum Section */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card id="community-forum">
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: { xs: 2, md: 3 }, gap: { xs: 1, md: 0 } }}>
                <Typography 
                  variant={isMobile ? 'h6' : 'h5'} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    color: activeSection === 'community-forum' ? 'secondary.main' : 'primary.main',
                    fontWeight: activeSection === 'community-forum' ? 'bold' : 600,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  <Forum color={activeSection === 'community-forum' ? 'secondary' : 'primary'} />
                  💬 Community Forum
                  {activeSection === 'community-forum' && ' (Active)'}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleForumClick}
                  startIcon={<Add />}
                  sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.5 }, width: { xs: '100%', md: 'auto' } }}
                >
                  New Post
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                Connect with your neighbors, share updates, and discuss community matters. Stay informed about what's happening in your neighborhood.
              </Typography>

              <Divider sx={{ my: { xs: 1, md: 2 } }} />

              {/* Forum Posts */}
              <Box>
                {forumPosts.map((post) => (
                  <Card key={post.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-start' }, mb: { xs: 1, md: 2 }, gap: { xs: 1, md: 0 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 40, md: 40 }, height: { xs: 40, md: 40 } }}>
                            {post.authorAvatar}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                              {post.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                              by {post.author} • {new Date(post.timestamp).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 1, md: 0 } }}>
                          <Chip 
                            label={post.category} 
                            size="small" 
                            color={getCategoryColor(post.category)}
                            variant="outlined"
                            sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}
                          />
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        {post.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          startIcon={<ThumbUp />}
                          onClick={() => handleLikePost(post.id)}
                          color={post.isLiked ? "primary" : "inherit"}
                          variant={post.isLiked ? "contained" : "text"}
                          sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}
                        >
                          {post.likes}
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Comment />}
                          onClick={() => handleCommentPost(post.id)}
                          sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}
                        >
                          {post.comments}
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Share />}
                          onClick={() => handleSharePost(post.id)}
                          sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, py: { xs: 0.5, md: 1 } }}
                        >
                          Share
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Join Neighborhood Watch Dialog */}
      <Dialog open={joinDialogOpen} onClose={handleJoinClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" />
            Join Neighborhood Watch
          </Typography>
          <IconButton onClick={handleJoinClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Join our neighborhood watch program to help keep our community safe. You'll receive updates about meetings, training sessions, and community events.
            </Typography>
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={joinForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={joinForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={joinForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={joinForm.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={joinForm.availability}
                  label="Availability"
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                >
                  <MenuItem value="weekdays">Weekdays</MenuItem>
                  <MenuItem value="weekends">Weekends</MenuItem>
                  <MenuItem value="evenings">Evenings</MenuItem>
                  <MenuItem value="flexible">Flexible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleJoinClose}>Cancel</Button>
          <Button 
            onClick={handleJoinSubmit} 
            variant="contained"
            disabled={!joinForm.name || !joinForm.email || !joinForm.phone}
          >
            Join Program
          </Button>
        </DialogActions>
      </Dialog>

      {/* Suggest Event Dialog */}
      <Dialog open={suggestEventDialogOpen} onClose={handleSuggestEventClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event color="primary" />
            Suggest Community Event
          </Typography>
          <IconButton onClick={handleSuggestEventClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Suggest a community event to help bring neighbors together and improve neighborhood safety. We'll review your suggestion and get back to you.
            </Typography>
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={suggestEventForm.title}
                onChange={(e) => handleEventInputChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Description"
                multiline
                rows={3}
                value={suggestEventForm.description}
                onChange={(e) => handleEventInputChange('description', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={suggestEventForm.date}
                onChange={(e) => handleEventInputChange('date', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={suggestEventForm.time}
                onChange={(e) => handleEventInputChange('time', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={suggestEventForm.location}
                onChange={(e) => handleEventInputChange('location', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={suggestEventForm.type}
                  label="Event Type"
                  onChange={(e) => handleEventInputChange('type', e.target.value)}
                  required
                >
                  <MenuItem value="meeting">Community Meeting</MenuItem>
                  <MenuItem value="training">Training Session</MenuItem>
                  <MenuItem value="volunteer">Volunteer Event</MenuItem>
                  <MenuItem value="social">Social Gathering</MenuItem>
                  <MenuItem value="safety">Safety Workshop</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Organizer Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Organizer Name"
                value={suggestEventForm.organizerName}
                onChange={(e) => handleEventInputChange('organizerName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Organizer Email"
                type="email"
                value={suggestEventForm.organizerEmail}
                onChange={(e) => handleEventInputChange('organizerEmail', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organizer Phone"
                value={suggestEventForm.organizerPhone}
                onChange={(e) => handleEventInputChange('organizerPhone', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleSuggestEventClose}>Cancel</Button>
          <Button 
            onClick={handleSuggestEventSubmit} 
            variant="contained"
            disabled={!suggestEventForm.title || !suggestEventForm.description || !suggestEventForm.date || !suggestEventForm.location || !suggestEventForm.type || !suggestEventForm.organizerName || !suggestEventForm.organizerEmail}
          >
            Submit Event Suggestion
          </Button>
        </DialogActions>
      </Dialog>

      {/* Community Forum Dialog */}
      <Dialog open={forumDialogOpen} onClose={handleForumClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Forum color="primary" />
            Create New Forum Post
          </Typography>
          <IconButton onClick={handleForumClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Share updates, ask questions, or start discussions with your neighbors. Keep the community informed about what's happening in your area.
            </Typography>
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Post Title"
                value={newPostForm.title}
                onChange={(e) => handlePostInputChange('title', e.target.value)}
                required
                placeholder="What would you like to discuss?"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newPostForm.category}
                  label="Category"
                  onChange={(e) => handlePostInputChange('category', e.target.value)}
                  required
                >
                  <MenuItem value="Safety Alert">Safety Alert</MenuItem>
                  <MenuItem value="Success Story">Success Story</MenuItem>
                  <MenuItem value="Community Project">Community Project</MenuItem>
                  <MenuItem value="Infrastructure">Infrastructure</MenuItem>
                  <MenuItem value="General Discussion">General Discussion</MenuItem>
                  <MenuItem value="Question">Question</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Post Content"
                multiline
                rows={6}
                value={newPostForm.content}
                onChange={(e) => handlePostInputChange('content', e.target.value)}
                required
                placeholder="Share your thoughts, updates, or questions with the community..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleForumClose}>Cancel</Button>
          <Button 
            onClick={handleNewPostSubmit} 
            variant="contained"
            startIcon={<Send />}
            disabled={!newPostForm.title || !newPostForm.content || !newPostForm.category}
          >
            Create Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onClose={handleCommentClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Comment color="primary" />
            Add Comment
          </Typography>
          <IconButton onClick={handleCommentClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Share your thoughts on this post. Be respectful and constructive in your comments.
            </Typography>
          </Alert>
          
          <TextField
            fullWidth
            label="Your Comment"
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            placeholder="Write your comment here..."
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCommentClose}>Cancel</Button>
          <Button 
            onClick={handleCommentSubmit} 
            variant="contained"
            startIcon={<Send />}
            disabled={!commentText.trim()}
          >
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Back to Top Button */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            borderRadius: '50%',
            width: 56,
            height: 56,
            minWidth: 'auto',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
            }
          }}
        >
          <KeyboardArrowUp />
        </Button>
      </Box>
    </Container>
  );
};

export default CommunityPage; 
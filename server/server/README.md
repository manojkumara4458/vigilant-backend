# 🚨 Neighborhood Safety Alert System

A comprehensive real-time safety alert system that empowers communities to stay informed and stay safe. Built with modern web technologies, this application provides instant notifications about safety incidents, interactive mapping, and community reporting features.

## ✨ Features

### 🎯 Core Features
- **Real-Time Incident Feed** - Live updates of nearby safety incidents
- **Anonymous Reporting** - Secure, anonymous incident reporting with GPS tagging
- **Verified Alerts Integration** - Sync with police/fire department data
- **Push Notifications** - Real-time alerts with customizable preferences
- **Interactive Map** - Live incident mapping with severity indicators
- **Safety Tips & Resources** - Emergency contacts and safety information

### 🛡️ Safety Features
- **Emergency Panic Button** - One-tap emergency alert system
- **Safety Check-ins** - User location and status tracking
- **Community Leaderboard** - Gamification for active community members
- **Weather Integration** - Safety conditions based on weather
- **Emergency Contacts** - Quick access to local emergency services

### 👥 Community Features
- **Neighborhood Groups** - Geographic-based community organization
- **User Profiles** - Community member profiles with safety stats
- **Incident Comments** - Community discussion on reported incidents
- **Voting System** - Community verification of incident reports
- **Moderation Tools** - Admin and moderator controls

## 🏗️ Architecture

### Backend (Node.js/Express)
- **RESTful API** with comprehensive endpoints
- **Socket.IO** for real-time communication
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with role-based access
- **Rate Limiting** and security middleware
- **File Upload** support for incident media

### Frontend (React)
- **Material-UI** for modern, responsive design
- **React Router** for navigation
- **React Query** for data fetching
- **Socket.IO Client** for real-time updates
- **React Leaflet** for interactive mapping
- **React Hook Form** for form handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neighborhood-safety-alert-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create `.env` files in both `server/` and `client/` directories:

   **Server (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/neighborhood-safety
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

   **Client (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start the application**
   ```bash
   # Development (both frontend and backend)
   npm run dev

   # Or start separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/health

## 📱 Usage Guide

### For Community Members

1. **Registration & Setup**
   - Create an account with email verification
   - Set your location and notification preferences
   - Join your neighborhood group

2. **Reporting Incidents**
   - Click "Report Incident" from the main menu
   - Select incident type and severity
   - Add description and optional media
   - Choose anonymous or public reporting
   - Submit for community review

3. **Staying Informed**
   - View the live map for nearby incidents
   - Check the incident feed for recent reports
   - Customize notification preferences
   - Access safety tips and emergency contacts

### For Moderators & Admins

1. **Incident Management**
   - Review and verify community reports
   - Update incident status and resolution
   - Manage false alarms and duplicates
   - Coordinate with emergency services

2. **Community Management**
   - Monitor user activity and reports
   - Manage neighborhood boundaries
   - Handle user disputes and issues
   - Generate community safety reports

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Incidents
- `GET /api/incidents` - Get incidents with filters
- `POST /api/incidents` - Report new incident
- `GET /api/incidents/:id` - Get incident details
- `PUT /api/incidents/:id` - Update incident (moderators)
- `POST /api/incidents/:id/vote` - Vote on incident

### Alerts
- `POST /api/alerts/incident` - Send incident alert
- `POST /api/alerts/emergency` - Send emergency alert
- `GET /api/alerts/history` - Get alert history

### Safety
- `GET /api/safety/emergency-contacts` - Get emergency contacts
- `GET /api/safety/tips` - Get safety tips
- `POST /api/safety/panic-alert` - Send panic alert
- `POST /api/safety/check-in` - Safety check-in

## 🗄️ Database Schema

### Users
- Profile information and preferences
- Location and neighborhood association
- Notification settings and statistics
- Role-based permissions

### Incidents
- Incident details and location
- Reporter information and verification status
- Community voting and comments
- Media attachments and tags

### Neighborhoods
- Geographic boundaries and settings
- Community statistics and features
- Emergency contacts and resources

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Protection** for cross-origin requests
- **Helmet.js** for security headers
- **Role-based Access Control** (RBAC)

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   CLIENT_URL=https://your-domain.com
   ```

2. **Build the Frontend**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy Backend**
   ```bash
   cd server
   npm start
   ```

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS
- **Database**: MongoDB Atlas, AWS DocumentDB
- **Frontend**: Vercel, Netlify, AWS S3
- **Real-time**: Socket.IO with Redis adapter

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the API docs at `/api/health`
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our community discussions
- **Emergency**: Contact local emergency services (911)

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- Leaflet for the interactive mapping
- Socket.IO for real-time communication
- MongoDB for the flexible database solution
- The open-source community for inspiration and tools

---

**Stay Safe, Stay Informed** 🛡️

Built with ❤️ for safer communities everywhere. 
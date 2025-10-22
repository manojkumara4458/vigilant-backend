import IncidentsTestPage from './pages/IncidentsTestPage';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import IncidentsPage from './pages/IncidentsPage';
import ReportIncidentPage from './pages/ReportIncidentPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import ProfilePage from './pages/ProfilePage';
import SafetyPage from './pages/SafetyPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import SafetyGuidelinesPage from './pages/SafetyGuidelinesPage';
import CommunityPage from './pages/CommunityPage';
import AllMembersPage from './pages/AllMembersPage';
import SettingsPage from './pages/SettingsPage';
import SearchPage from './pages/SearchPage';

import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Helmet>
        <title>Neighborhood Safety Alert System</title>
        <meta name="description" content="Stay informed and stay safe with real-time community safety alerts" />
      </Helmet>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/map" element={
          <ProtectedRoute>
            <Layout>
              <MapPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/incidents" element={
          <ProtectedRoute>
            <Layout>
              <IncidentsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/incidents/:id" element={
          <ProtectedRoute>
            <Layout>
              <IncidentDetailPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/report" element={
          <ProtectedRoute>
            <Layout>
              <ReportIncidentPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/safety" element={
          <ProtectedRoute>
            <Layout>
              <SafetyPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/safety/contacts" element={
          <ProtectedRoute>
            <Layout>
              <EmergencyContactsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/safety/guidelines" element={
          <ProtectedRoute>
            <Layout>
              <SafetyGuidelinesPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/community" element={
          <ProtectedRoute>
            <Layout>
              <CommunityPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/members" element={
          <ProtectedRoute>
            <Layout>
              <AllMembersPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/search" element={
          <ProtectedRoute>
            <Layout>
              <SearchPage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
}

export default App; 
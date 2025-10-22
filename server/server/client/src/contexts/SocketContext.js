import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket server
      socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      const socket = socketRef.current;

      // Join user's neighborhood room
      if (user.neighborhood) {
        socket.emit('join-neighborhood', user.neighborhood._id || user.neighborhood);
      }

      // Update user location
      if (user.address?.coordinates) {
        socket.emit('update-location', {
          location: user.address.coordinates,
          neighborhoodId: user.neighborhood?._id || user.neighborhood
        });
      }

      // Listen for new incidents
      socket.on('incident-alert', (incident) => {
        toast.custom((t) => (
          <div
            style={{
              background: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderLeft: `4px solid ${
                incident.severity === 'critical' ? '#f44336' :
                incident.severity === 'high' ? '#ff9800' :
                incident.severity === 'medium' ? '#2196f3' : '#4caf50'
              }`,
              maxWidth: '400px'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {incident.title}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {incident.type} • {incident.severity}
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {new Date(incident.createdAt).toLocaleString()}
            </div>
          </div>
        ), {
          duration: 6000,
          position: 'top-right'
        });
      });

      // Listen for emergency alerts
      socket.on('emergency-alert', (alert) => {
        toast.custom((t) => (
          <div
            style={{
              background: '#f44336',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              maxWidth: '400px'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              🚨 EMERGENCY ALERT
            </div>
            <div style={{ marginBottom: '4px' }}>
              {alert.title}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {alert.message}
            </div>
          </div>
        ), {
          duration: 10000,
          position: 'top-center'
        });
      });

      // Listen for test notifications
      socket.on('test-notification', (notification) => {
        toast.success(notification.message, {
          duration: 4000
        });
      });

      // Connection events
      socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // Cleanup on unmount
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [isAuthenticated, user]);

  const emitNewIncident = (incident) => {
    if (socketRef.current) {
      socketRef.current.emit('new-incident', incident);
    }
  };

  const updateLocation = (location, neighborhoodId) => {
    if (socketRef.current) {
      socketRef.current.emit('update-location', { location, neighborhoodId });
    }
  };

  const sendTestNotification = () => {
    if (socketRef.current) {
      socketRef.current.emit('test-notification');
    }
  };

  const value = {
    socket: socketRef.current,
    emitNewIncident,
    updateLocation,
    sendTestNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference, default to light mode
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Save preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Create theme based on dark mode preference with modern professional color palette
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2C3E50', // Professional dark blue-gray
        light: '#34495E',
        dark: '#1B2631',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#E74C3C', // Professional red
        light: '#EC7063',
        dark: '#C0392B',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#E74C3C',
        light: '#EC7063',
        dark: '#C0392B',
      },
      warning: {
        main: '#F39C12',
        light: '#F7DC6F',
        dark: '#D68910',
      },
      success: {
        main: '#27AE60',
        light: '#58D68D',
        dark: '#1E8449',
      },
      background: {
        default: darkMode ? '#1A1A1A' : '#F5F6FA', // Modern dark/light backgrounds
        paper: darkMode ? '#2C2C2C' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#ECF0F1' : '#2C3E50',
        secondary: darkMode ? '#BDC3C7' : '#7F8C8D',
      },
      divider: darkMode ? 'rgba(236, 240, 241, 0.2)' : 'rgba(44, 62, 80, 0.1)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
      body1: {
        lineHeight: 1.6,
      },
      body2: {
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 8, // Reduced from 12 to 8 for more professional look
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '12px 24px',
            boxShadow: '0 4px 12px rgba(44, 62, 80, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(44, 62, 80, 0.3)',
            },
          },
          contained: {
            '&.MuiButton-containedPrimary': {
              background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1B2631 0%, #2C3E50 100%)',
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0,0,0,0.4)' 
              : '0 8px 32px rgba(44, 62, 80, 0.08)',
            border: `1px solid ${darkMode ? 'rgba(236, 240, 241, 0.2)' : 'rgba(44, 62, 80, 0.1)'}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0 12px 40px rgba(0,0,0,0.5)' 
                : '0 12px 40px rgba(44, 62, 80, 0.12)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode 
              ? 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)'
              : 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${darkMode ? 'rgba(236, 240, 241, 0.2)' : 'rgba(44, 62, 80, 0.1)'}`,
            boxShadow: darkMode 
              ? '0 4px 20px rgba(0,0,0,0.4)' 
              : '0 4px 20px rgba(44, 62, 80, 0.08)',
            borderRadius: 0, // Remove rounded corners from navbar
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: darkMode 
              ? '0 4px 16px rgba(0,0,0,0.3)' 
              : '0 4px 16px rgba(44, 62, 80, 0.06)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '& fieldset': {
                borderColor: darkMode ? 'rgba(236, 240, 241, 0.3)' : 'rgba(44, 62, 80, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#2C3E50',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2C3E50',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
    },
  });

  const value = {
    darkMode,
    toggleDarkMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
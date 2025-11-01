'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const PatreonAuthContext = createContext();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function PatreonAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('patreon_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patreon/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else {
        // Token invalid, clear it
        logout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      // Fetch the OAuth URL from backend
      const response = await fetch(`${API_BASE_URL}/api/patreon/auth?intent=login`);
      const data = await response.json();
      
      if (data.data?.authUrl) {
        // Redirect to Patreon OAuth page
        window.location.href = data.data.authUrl;
      } else {
        console.error('Failed to get OAuth URL:', data);
        alert('Failed to initiate Patreon login. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating Patreon login:', error);
      alert('Failed to connect to authentication server.');
    }
  };

  const handleCallback = (jwtToken) => {
    localStorage.setItem('patreon_token', jwtToken);
    setToken(jwtToken);
    fetchUserData(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('patreon_token');
    setToken(null);
    setUser(null);
  };

  const checkDownloadEligibility = async (assetId) => {
    if (!token) return false;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/patreon/check-download/${assetId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      return data.data?.canDownload || false;
    } catch (error) {
      console.error('Error checking download eligibility:', error);
      return false;
    }
  };

  const verifyPatronStatus = async () => {
    if (!token) return false;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/patreon/verify`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      return data.data?.isActivePatron || false;
    } catch (error) {
      console.error('Error verifying patron status:', error);
      return false;
    }
  };

  return (
    <PatreonAuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        handleCallback,
        checkDownloadEligibility,
        verifyPatronStatus
      }}
    >
      {children}
    </PatreonAuthContext.Provider>
  );
}

export const usePatreonAuth = () => {
  const context = useContext(PatreonAuthContext);
  if (!context) {
    throw new Error('usePatreonAuth must be used within PatreonAuthProvider');
  }
  return context;
};

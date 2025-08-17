import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create a new context
const AuthContext = createContext(null);

// Create an Axios instance for our API calls
// This ensures we always send cookies with our requests
const api = axios.create({
  baseURL: 'http://localhost:5001', // Your backend URL
  withCredentials: true,
});

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  useEffect(() => {
    // This function runs when the app first loads
    const checkLoggedIn = async () => {
      try {
        // Make a request to the backend to get the current user
        const response = await api.get('/auth/user');
        setUser(response.data);
      } catch (error) {
        // If there's an error (like a 401), it means the user is not logged in
        console.log('User not authenticated');
        setUser(null);
      } finally {
        // We're done loading, whether we found a user or not
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // The value provided to all children components
  const value = {
    user,
    loading,
    logout,
    api, // We can also provide the configured axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to easily use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

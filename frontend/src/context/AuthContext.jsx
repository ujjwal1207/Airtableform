import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create a new context
const AuthContext = createContext(null);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable
  withCredentials: true,
});

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await api.get('/auth/user');
        setUser(response.data);
      } catch (error) {
        console.log('User not authenticated');
        setUser(null);
      } finally {
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

export const useAuth = () => {
  return useContext(AuthContext);
};

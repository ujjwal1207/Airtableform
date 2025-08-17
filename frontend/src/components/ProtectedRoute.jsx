import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // While we're checking for a user, show a loading message
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // If not loading and there's no user, redirect to the homepage
    return <Navigate to="/" />;
  }

  // If there is a user, render the page they were trying to access
  return children;
};

export default ProtectedRoute;

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AIRTABLE_AUTH_URL = 'http://localhost:5001/auth/airtable';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = AIRTABLE_AUTH_URL;
  };

  const handleLogout = async () => {
    await logout();
    // Redirect to homepage after logout
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-gray-800">
          Form<span className="text-blue-600">Table</span>
        </Link>
        <nav>
          {loading ? (
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login with Airtable
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

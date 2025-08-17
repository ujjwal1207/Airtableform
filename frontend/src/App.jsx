import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import FormBuilderPage from './pages/FormBuilderPage'; // Import the new page

function App() {
  return (
    <Router>
      <div className="font-sans bg-gray-50 min-h-screen">
        <Navbar />
        <main>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
            />
            <Route 
              path="/builder/new" 
              element={<ProtectedRoute><FormBuilderPage /></ProtectedRoute>} 
            />
            {/* We will add the edit route later */}
            {/* <Route 
              path="/builder/edit/:formId" 
              element={<ProtectedRoute><FormBuilderPage /></ProtectedRoute>} 
            /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

// src/components/PrivateRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const location = useLocation();
  const currentUser = localStorage.getItem('currentUser');
  
  console.log("PrivateRoute check at:", location.pathname); // Debug log
  console.log("currentUser exists:", !!currentUser); // Debug log
  
  // If no user is logged in, redirect to login
  if (!currentUser) {
    console.log("No current user, redirecting to login"); // Debug log
    return <Navigate to="/login" replace />;
  }
  
  try {
    // Verify the stored user data is valid JSON
    const user = JSON.parse(currentUser);
    console.log("Parsed user in PrivateRoute:", user?.email); // Debug log
    
    if (!user || !user.email) {
      console.log("Invalid user data, redirecting to login"); // Debug log
      localStorage.removeItem('currentUser'); // Clean up invalid data
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Error parsing currentUser:", error);
    localStorage.removeItem('currentUser'); // Clean up corrupted data
    return <Navigate to="/login" replace />;
  }
  
  console.log("User authenticated, rendering protected content"); // Debug log
  return children;
}

export default PrivateRoute;
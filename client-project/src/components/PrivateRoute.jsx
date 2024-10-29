
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthChecked(status);
  }, []);

  if (!isAuthChecked) {
    return null;  }

  return isAuthenticated || isAuthChecked ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;

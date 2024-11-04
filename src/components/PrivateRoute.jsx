import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ element }) => {
  const { authState } = useContext(AuthContext);

  return authState.isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;

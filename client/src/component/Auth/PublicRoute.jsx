import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ user, children }) => {
  return user ? <Navigate to="/" /> : children;
};

export default PublicRoute;

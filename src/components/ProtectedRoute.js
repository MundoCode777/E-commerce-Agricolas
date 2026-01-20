// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y el usuario no es admin
  if (requireAdmin && user.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
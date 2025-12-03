// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay usuario logueado al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.usuario);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Registrar usuario
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.usuario);
      setIsAuthenticated(true);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario'
      };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.usuario);
      setIsAuthenticated(true);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Actualizar perfil
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.usuario);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar perfil'
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
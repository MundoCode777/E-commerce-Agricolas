// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authService = {
  // Registrar usuario
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await api.put('/auth/perfil', userData);
    localStorage.setItem('user', JSON.stringify(response.data.usuario));
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Servicios de Órdenes
export const orderService = {
  // Crear orden
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Obtener mis órdenes
  getMyOrders: async () => {
    const response = await api.get('/orders/mis-ordenes');
    return response.data;
  },

  // Obtener orden por ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Obtener todas las órdenes (admin)
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Actualizar estado de orden (admin)
  updateOrderStatus: async (orderId, estado) => {
    const response = await api.put(`/orders/${orderId}/estado`, { estado });
    return response.data;
  }
};

export default api;
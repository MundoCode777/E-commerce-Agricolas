// src/services/productService.js
import api from './api';

export const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un producto por ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Agregar reseña
  addReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar reseña
  deleteReview: async (productId, reviewId) => {
    try {
      const response = await api.delete(`/products/${productId}/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productService;
// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));

app.get('/', (req, res) => {
  res.json({ 
    message: '🌾 API Agrícola Fresh funcionando correctamente',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/perfil'
      },
      products: {
        getAll: 'GET /api/products',
        getOne: 'GET /api/products/:id',
        create: 'POST /api/products (admin)',
        update: 'PUT /api/products/:id (admin)',
        delete: 'DELETE /api/products/:id (admin)',
        uploadImage: 'POST /api/products/upload-image (admin)',
        addReview: 'POST /api/products/:id/reviews',
        deleteReview: 'DELETE /api/products/:id/reviews/:reviewId'
      },
      orders: {
        create: 'POST /api/orders',
        getMyOrders: 'GET /api/orders/mis-ordenes',
        getOne: 'GET /api/orders/:id',
        getAll: 'GET /api/orders (admin)',
        updateStatus: 'PUT /api/orders/:id/estado (admin)'
      }
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Error capturado:', err);
  res.status(500).json({
    success: false,
    message: 'Error del servidor',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('========================================');
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌐 Frontend debe estar en http://localhost:3000`);
  console.log('========================================');
});
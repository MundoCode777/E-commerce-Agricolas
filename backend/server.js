// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de todas las peticiones
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));

// Ruta de prueba
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
        addReview: 'POST /api/products/:id/reviews',
        deleteReview: 'DELETE /api/products/:id/reviews/:reviewId'
      },
      orders: {
        create: 'POST /api/orders',
        getMyOrders: 'GET /api/orders/mis-ordenes',
        getOne: 'GET /api/orders/:id'
      }
    }
  });
});

// Ruta de test
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend funcionando correctamente',
    timestamp: new Date()
  });
});

// Manejo de errores
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
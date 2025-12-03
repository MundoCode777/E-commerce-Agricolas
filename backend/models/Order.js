// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numeroOrden: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    productoId: Number,
    nombre: String,
    precio: Number,
    cantidad: Number,
    image: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  costoEnvio: {
    type: Number,
    default: 2.50
  },
  total: {
    type: Number,
    required: true
  },
  direccionEntrega: {
    nombre: String,
    apellido: String,
    direccion: String,
    ciudad: String,
    provincia: String,
    telefono: String
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'transferencia', 'tarjeta'],
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  fechaOrden: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
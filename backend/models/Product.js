// backend/models/Product.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombreUsuario: String,
  avatarUsuario: String,
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  descripcionLarga: {
    type: String,
    default: ''
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  imagenes: [{
    type: String
  }],
  unit: {
    type: String,
    default: 'kg'
  },
  categoria: {
    type: String,
    enum: ['verduras', 'frutas', 'tuberculos', 'granos', 'otros'],
    default: 'verduras'
  },
  stock: {
    type: Number,
    default: 100
  },
  disponible: {
    type: Boolean,
    default: true
  },
  calificacionPromedio: {
    type: Number,
    default: 0
  },
  numeroReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  beneficios: [{
    type: String
  }],
  informacionNutricional: {
    calorias: String,
    proteinas: String,
    carbohidratos: String,
    grasas: String,
    fibra: String,
    vitaminas: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
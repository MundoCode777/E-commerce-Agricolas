// backend/models/Product.js - CÓDIGO COMPLETO CON ANÁLISIS DE SENTIMIENTOS
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
  },
  // NUEVO: Análisis de sentimientos
  analisisSentimiento: {
    sentimiento: {
      type: String,
      enum: ['muy positivo', 'positivo', 'neutro', 'negativo', 'muy negativo']
    },
    score: Number,
    confianza: Number,
    esSarcasmo: Boolean,
    indicadoresSarcasmo: [String],
    palabrasPositivas: [String],
    palabrasNegativas: [String],
    emoji: String
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
    enum: [
      'fertilizantes',
      'abonos',
      'pesticidas',
      'herbicidas',
      'fungicidas',
      'insecticidas',
      'semillas',
      'herramientas',
      'equipos',
      'sustratos',
      'otros'
    ],
    default: 'fertilizantes'
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
  
  // NUEVO: Estadísticas de sentimientos del producto
  estadisticasSentimientos: {
    totalReseñas: { type: Number, default: 0 },
    sentimientos: {
      muyPositivo: { type: Number, default: 0 },
      positivo: { type: Number, default: 0 },
      neutro: { type: Number, default: 0 },
      negativo: { type: Number, default: 0 },
      muyNegativo: { type: Number, default: 0 }
    },
    porcentajes: {
      muyPositivo: { type: Number, default: 0 },
      positivo: { type: Number, default: 0 },
      neutro: { type: Number, default: 0 },
      negativo: { type: Number, default: 0 },
      muyNegativo: { type: Number, default: 0 }
    },
    promedioScore: { type: Number, default: 0 },
    sarcasmoDetectado: { type: Number, default: 0 }
  },
  
  // Beneficios y características
  beneficios: [{
    type: String
  }],
  
  // Información nutricional (si aplica)
  informacionNutricional: {
    calorias: String,
    proteinas: String,
    carbohidratos: String,
    grasas: String,
    fibra: String,
    vitaminas: [String]
  },
  
  // Para agroquímicos y productos especiales
  informacionUso: {
    tipo: String,
    aplicacion: String,
    dosis: String,
    advertencia: String
  },
  informacionSeguridad: {
    precauciones: [String],
    simbolos: [String],
    clasificacion: String,
    restricciones: String
  },
  
  // Campos adicionales
  marca: String,
  origen: String,
  certificaciones: [String],
  esAgroquimico: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
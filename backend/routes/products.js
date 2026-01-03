// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Obtener todos los productos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ disponible: true });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Obtener un producto por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.usuario', 'nombre apellido avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Agregar una reseña al producto
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { calificacion, comentario } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar si el usuario ya dejó una reseña
    const yaRevisado = product.reviews.find(
      review => review.usuario.toString() === req.user.id
    );

    if (yaRevisado) {
      return res.status(400).json({
        success: false,
        message: 'Ya has dejado una reseña para este producto'
      });
    }

    // Agregar nueva reseña
    const nuevaReview = {
      usuario: req.user.id,
      nombreUsuario: `${req.user.nombre} ${req.user.apellido}`,
      avatarUsuario: req.user.avatar,
      calificacion,
      comentario
    };

    product.reviews.push(nuevaReview);

    // Actualizar calificación promedio
    product.numeroReviews = product.reviews.length;
    product.calificacionPromedio = 
      product.reviews.reduce((acc, item) => item.calificacion + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Reseña agregada exitosamente',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al agregar reseña',
      error: error.message
    });
  }
});

// @route   DELETE /api/products/:id/reviews/:reviewId
// @desc    Eliminar una reseña
// @access  Private
router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    // Verificar que el usuario sea el dueño de la reseña
    if (review.usuario.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar esta reseña'
      });
    }

    review.deleteOne();

    // Actualizar calificación promedio
    product.numeroReviews = product.reviews.length;
    if (product.reviews.length > 0) {
      product.calificacionPromedio = 
        product.reviews.reduce((acc, item) => item.calificacion + acc, 0) / product.reviews.length;
    } else {
      product.calificacionPromedio = 0;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Reseña eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar reseña',
      error: error.message
    });
  }
});

module.exports = router;
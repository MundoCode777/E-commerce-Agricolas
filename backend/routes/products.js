// backend/routes/products.js - CÓDIGO COMPLETO CON ANÁLISIS DE SENTIMIENTOS
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const upload = require('../config/upload');
const { analizarSentimiento, analizarReseñasProducto } = require('../utils/sentimentAnalyzer');

// RUTA PARA SUBIR IMAGEN
router.post('/upload-image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    const imageUrl = `/uploads/productos/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir imagen',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = req.user && req.user.rol === 'administrador' 
      ? {} 
      : { disponible: true };
    
    const products = await Product.find(query);
    
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

router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      descripcionLarga,
      precio,
      image,
      imagenes,
      unit,
      categoria,
      stock,
      beneficios,
      informacionNutricional
    } = req.body;

    if (!nombre || !descripcion || !precio || !image || !unit || !categoria || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Por favor completa todos los campos requeridos'
      });
    }

    const product = await Product.create({
      nombre,
      descripcion,
      descripcionLarga,
      precio,
      image,
      imagenes: imagenes || [image, image, image],
      unit,
      categoria,
      stock,
      beneficios: beneficios || [],
      informacionNutricional: informacionNutricional || {}
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const {
      nombre,
      descripcion,
      descripcionLarga,
      precio,
      image,
      imagenes,
      unit,
      categoria,
      stock,
      disponible,
      beneficios,
      informacionNutricional
    } = req.body;

    if (nombre !== undefined) product.nombre = nombre;
    if (descripcion !== undefined) product.descripcion = descripcion;
    if (descripcionLarga !== undefined) product.descripcionLarga = descripcionLarga;
    if (precio !== undefined) product.precio = precio;
    if (image !== undefined) product.image = image;
    if (imagenes !== undefined) product.imagenes = imagenes;
    if (unit !== undefined) product.unit = unit;
    if (categoria !== undefined) product.categoria = categoria;
    if (stock !== undefined) product.stock = stock;
    if (disponible !== undefined) product.disponible = disponible;
    if (beneficios !== undefined) product.beneficios = beneficios;
    if (informacionNutricional !== undefined) product.informacionNutricional = informacionNutricional;

    await product.save();

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
});

// RUTA PARA AGREGAR RESEÑA CON ANÁLISIS DE SENTIMIENTOS
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

    const yaRevisado = product.reviews.find(
      review => review.usuario.toString() === req.user.id
    );

    if (yaRevisado) {
      return res.status(400).json({
        success: false,
        message: 'Ya has dejado una reseña para este producto'
      });
    }

    // ANÁLISIS DE SENTIMIENTOS
    console.log('🤖 Analizando sentimiento de la reseña...');
    const analisis = analizarSentimiento(comentario, calificacion);
    console.log('✅ Análisis completado:', analisis);

    const nuevaReview = {
      usuario: req.user.id,
      nombreUsuario: `${req.user.nombre} ${req.user.apellido}`,
      avatarUsuario: req.user.avatar,
      calificacion,
      comentario,
      analisisSentimiento: analisis
    };

    product.reviews.push(nuevaReview);

    // Actualizar estadísticas de reseñas
    product.numeroReviews = product.reviews.length;
    product.calificacionPromedio = 
      product.reviews.reduce((acc, item) => item.calificacion + acc, 0) / product.reviews.length;

    // Actualizar estadísticas de sentimientos del producto
    const estadisticas = analizarReseñasProducto(product.reviews);
    product.estadisticasSentimientos = estadisticas;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Reseña agregada exitosamente',
      analisisSentimiento: analisis,
      product
    });
  } catch (error) {
    console.error('Error al agregar reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar reseña',
      error: error.message
    });
  }
});

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

    if (review.usuario.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar esta reseña'
      });
    }

    review.deleteOne();

    product.numeroReviews = product.reviews.length;
    if (product.reviews.length > 0) {
      product.calificacionPromedio = 
        product.reviews.reduce((acc, item) => item.calificacion + acc, 0) / product.reviews.length;
      
      // Recalcular estadísticas de sentimientos
      const estadisticas = analizarReseñasProducto(product.reviews);
      product.estadisticasSentimientos = estadisticas;
    } else {
      product.calificacionPromedio = 0;
      product.estadisticasSentimientos = {
        totalReseñas: 0,
        sentimientos: {
          muyPositivo: 0,
          positivo: 0,
          neutro: 0,
          negativo: 0,
          muyNegativo: 0
        },
        porcentajes: {
          muyPositivo: 0,
          positivo: 0,
          neutro: 0,
          negativo: 0,
          muyNegativo: 0
        },
        promedioScore: 0,
        sarcasmoDetectado: 0
      };
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
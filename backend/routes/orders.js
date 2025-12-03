// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Crear nueva orden
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, subtotal, costoEnvio, total, direccionEntrega, metodoPago } = req.body;

    // Generar número de orden único
    const numeroOrden = `ORD-${Date.now().toString().slice(-8)}`;

    const orden = await Order.create({
      usuario: req.user.id,
      numeroOrden,
      items,
      subtotal,
      costoEnvio,
      total,
      direccionEntrega,
      metodoPago
    });

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      orden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear orden',
      error: error.message
    });
  }
});

// @route   GET /api/orders/mis-ordenes
// @desc    Obtener órdenes del usuario
// @access  Private
router.get('/mis-ordenes', protect, async (req, res) => {
  try {
    const ordenes = await Order.find({ usuario: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ordenes.length,
      ordenes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Obtener orden por ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const orden = await Order.findById(req.params.id).populate('usuario', 'nombre email');

    if (!orden) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Verificar que la orden pertenezca al usuario o sea admin
    if (orden.usuario._id.toString() !== req.user.id && req.user.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver esta orden'
      });
    }

    res.json({
      success: true,
      orden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener orden',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Obtener todas las órdenes (solo admin)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const ordenes = await Order.find().populate('usuario', 'nombre email').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ordenes.length,
      ordenes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/estado
// @desc    Actualizar estado de orden (solo admin)
// @access  Private/Admin
router.put('/:id/estado', protect, admin, async (req, res) => {
  try {
    const { estado } = req.body;

    const orden = await Order.findById(req.params.id);

    if (!orden) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    orden.estado = estado;
    await orden.save();

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      orden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado',
      error: error.message
    });
  }
});

module.exports = router;
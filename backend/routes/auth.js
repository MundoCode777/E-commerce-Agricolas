// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// Generar JWT Token
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const usuario = await User.create({
      nombre,
      apellido,
      email,
      password,
      telefono
    });

    // Generar token
    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        avatar: usuario.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login de usuario
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingrese email y contraseña'
      });
    }

    // Buscar usuario
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        avatar: usuario.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener usuario actual
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        avatar: usuario.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

// @route   PUT /api/auth/perfil
// @desc    Actualizar perfil de usuario
// @access  Private
router.put('/perfil', protect, async (req, res) => {
  try {
    const { nombre, apellido, telefono, direccion } = req.body;

    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    usuario.nombre = nombre || usuario.nombre;
    usuario.apellido = apellido || usuario.apellido;
    usuario.telefono = telefono || usuario.telefono;
    if (direccion) {
      usuario.direccion = { ...usuario.direccion, ...direccion };
    }

    await usuario.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        avatar: usuario.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
});

module.exports = router;
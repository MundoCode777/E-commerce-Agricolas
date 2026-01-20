// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ← ASEGÚRATE DE QUE ESTÉ AQUÍ
const { protect } = require('../middleware/auth');

// Generar JWT Token
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// ==============================
// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
// ==============================
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Datos recibidos para registro:', req.body);

    const { nombre, apellido, email, password, telefono } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !password) {
      console.log('❌ Faltan campos requeridos');
      return res.status(400).json({
        success: false,
        message: 'Por favor completa todos los campos requeridos'
      });
    }

    // Normalizar email
    const emailNorm = String(email).trim().toLowerCase();

    // Validar formato de email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(emailNorm)) {
      console.log('❌ Email inválido:', emailNorm);
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Validar longitud de contraseña
    if (String(password).length < 6) {
      console.log('❌ Contraseña muy corta');
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    console.log('🔍 Verificando si el email ya existe...');

    // Verificar si el usuario ya existe
    const usuarioExiste = await User.findOne({ email: emailNorm });
    if (usuarioExiste) {
      console.log('❌ El email ya está registrado');
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    console.log('✅ Email disponible');
    console.log('🔐 Encriptando contraseña...');

    // ✅ Encriptar contraseña ANTES de crear el usuario
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(String(password), salt);

    console.log('✅ Contraseña encriptada, creando usuario...');

    // Crear usuario con contraseña ya encriptada
    const usuario = await User.create({
      nombre: String(nombre).trim(),
      apellido: String(apellido).trim(),
      email: emailNorm,
      password: passwordEncriptado, // ✅ IMPORTANTE
      telefono: telefono ? String(telefono).trim() : ''
    });

    console.log('✅ Usuario creado exitosamente:', usuario._id);

    // Generar token
    const token = generarToken(usuario._id);

    console.log('✅ Token generado');
    console.log('🎉 Registro completado exitosamente');

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
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
    console.error('❌ Error al registrar usuario:', error);

    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: mensajes[0]
      });
    }

    // Error de duplicado (email ya existe)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// ==============================
// @route   POST /api/auth/login
// @desc    Login de usuario
// @access  Public
// ==============================
router.post('/login', async (req, res) => {
  try {
    const emailRaw = req.body?.email;
    const password = req.body?.password;

    console.log('🔑 Intento de login con email:', emailRaw);

    // Validar campos
    if (!emailRaw || !password) {
      console.log('❌ Faltan campos');
      return res.status(400).json({
        success: false,
        message: 'Por favor ingrese email y contraseña'
      });
    }

    // Normalizar email
    const emailNorm = String(emailRaw).trim().toLowerCase();

    console.log('🔍 Buscando usuario en la base de datos...');

    // ✅ Si tu schema tiene password: select:false, esto es obligatorio
    const usuario = await User.findOne({ email: emailNorm }).select('+password');

    if (!usuario) {
      console.log('❌ Usuario no encontrado con email:', emailNorm);
      return res.status(401).json({
        success: false,
       message: 'Credenciales inválidas'
      });
    }

    console.log('✅ Usuario encontrado:', usuario.email);
    console.log('🔐 Verificando contraseña...');

    // ✅ Comparar password ingresado vs encriptado
    const passwordValido = await bcrypt.compare(String(password), usuario.password);

    console.log('🔐 Resultado de comparación:', passwordValido);

    if (!passwordValido) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    console.log('✅ Login exitoso para:', usuario.email);

    // Generar token
    const token = generarToken(usuario._id);

    return res.json({
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
    console.error('❌ Error al iniciar sesión:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
});

// ==============================
// @route   GET /api/auth/me
// @desc    Obtener usuario actual
// @access  Private
// ==============================
router.get('/me', protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const usuario = await User.findById(userId).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.json({
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
    return res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

// ==============================
// @route   PUT /api/auth/perfil
// @desc    Actualizar perfil de usuario
// @access  Private
// ==============================
router.put('/perfil', protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const { nombre, apellido, telefono, direccion } = req.body;

    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    if (nombre) usuario.nombre = String(nombre).trim();
    if (apellido) usuario.apellido = String(apellido).trim();
    if (telefono) usuario.telefono = String(telefono).trim();

    // Merge dirección si viene como objeto
    if (direccion && typeof direccion === 'object') {
      usuario.direccion = { ...(usuario.direccion || {}), ...direccion };
    }

    await usuario.save();

    return res.json({
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
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
});

module.exports = router;

// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas - verificar token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token inválido'
    });
  }
};

// Verificar rol de administrador
exports.admin = (req, res, next) => {
  if (req.user && req.user.rol === 'administrador') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado - Se requiere rol de administrador'
    });
  }
};
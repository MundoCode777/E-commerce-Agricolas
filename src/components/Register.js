// src/components/Register.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Register({ onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal register-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-auth-btn" onClick={onClose}>✕</button>
        
        <div className="auth-header">
          <div className="auth-icon">🌾</div>
          <h2>Crear Cuenta</h2>
          <p>Únete a Agrícola Fresh y disfruta de productos frescos</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label>
                <span className="label-icon">👤</span>
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">👤</span>
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon">📧</span>
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon">📱</span>
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="0999999999"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <span className="label-icon">🔒</span>
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">🔒</span>
                Confirmar
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creando cuenta...
              </>
            ) : (
              <>
                <span>✨</span>
                Crear Mi Cuenta
              </>
            )}
          </button>

          <div className="password-hint">
            <span>💡</span>
            La contraseña debe tener al menos 6 caracteres
          </div>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes una cuenta?</p>
          <button className="switch-auth-btn" onClick={onSwitchToLogin}>
            Iniciar Sesión →
          </button>
        </div>

        <div className="auth-benefits">
          <div className="benefit-item">
            <span>🌱</span>
            <p>Productos 100% frescos</p>
          </div>
          <div className="benefit-item">
            <span>🚚</span>
            <p>Entrega rápida</p>
          </div>
          <div className="benefit-item">
            <span>💳</span>
            <p>Pago seguro</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
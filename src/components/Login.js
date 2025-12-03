// src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login({ onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    const result = await login(formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-auth-btn" onClick={onClose}>✕</button>
        
        <div className="auth-header">
          <div className="auth-icon">🌾</div>
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido de vuelta a Agrícola Fresh</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

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
              autoFocus
            />
          </div>

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
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              <>
                <span>🔓</span>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿No tienes cuenta?</p>
          <button className="switch-auth-btn" onClick={onSwitchToRegister}>
            Crear una cuenta →
          </button>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <div>
              <strong>Acceso rápido</strong>
              <p>A tus pedidos y favoritos</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎁</span>
            <div>
              <strong>Ofertas exclusivas</strong>
              <p>Solo para miembros</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
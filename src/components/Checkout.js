// src/components/Checkout.js
import React, { useState } from 'react';
import './Checkout.css';

function Checkout({ items, total, onClose, onConfirmOrder }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Milagro',
    provincia: 'Guayas',
    codigoPostal: '',
    notasEntrega: '',
    metodoPago: 'efectivo'
  });

  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (10 dígitos)';
    }
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmOrder = () => {
    onConfirmOrder(formData);
  };

  const deliveryCost = 2.50;
  const subtotal = total;
  const finalTotal = subtotal + deliveryCost;

  if (showConfirmation) {
    return (
      <div className="checkout-overlay" onClick={onClose}>
        <div className="checkout-container confirmation-container" onClick={(e) => e.stopPropagation()}>
          <div className="confirmation-content">
            <div className="success-icon">✅</div>
            <h2>¡Pedido Confirmado!</h2>
            <p className="confirmation-message">
              Gracias por tu compra, {formData.nombre}. Tu pedido ha sido procesado exitosamente.
            </p>
            
            <div className="order-summary-box">
              <h3>Resumen del Pedido</h3>
              <div className="order-details">
                <p><strong>Número de Orden:</strong> #ORD-{Date.now().toString().slice(-6)}</p>
                <p><strong>Total:</strong> ${finalTotal.toFixed(2)}</p>
                <p><strong>Método de Pago:</strong> {formData.metodoPago === 'efectivo' ? 'Efectivo' : formData.metodoPago === 'transferencia' ? 'Transferencia' : 'Tarjeta'}</p>
                <p><strong>Dirección de Entrega:</strong> {formData.direccion}, {formData.ciudad}</p>
              </div>
            </div>

            <div className="confirmation-actions">
              <button className="btn-primary" onClick={handleConfirmOrder}>
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-container" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>🛒 Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="checkout-content">
          {/* Columna Izquierda - Formulario */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              {/* Información Personal */}
              <div className="form-section">
                <h3>📋 Información Personal</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={errors.nombre ? 'error' : ''}
                      placeholder="Juan"
                    />
                    {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                  </div>

                  <div className="form-group">
                    <label>Apellido *</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className={errors.apellido ? 'error' : ''}
                      placeholder="Pérez"
                    />
                    {errors.apellido && <span className="error-message">{errors.apellido}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="ejemplo@correo.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className={errors.telefono ? 'error' : ''}
                      placeholder="0999999999"
                    />
                    {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                  </div>
                </div>
              </div>

              {/* Dirección de Entrega */}
              <div className="form-section">
                <h3>📍 Dirección de Entrega</h3>
                
                <div className="form-group">
                  <label>Dirección Completa *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className={errors.direccion ? 'error' : ''}
                    placeholder="Calle, número, referencias"
                  />
                  {errors.direccion && <span className="error-message">{errors.direccion}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      placeholder="Milagro"
                    />
                  </div>

                  <div className="form-group">
                    <label>Provincia</label>
                    <input
                      type="text"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      placeholder="Guayas"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notas de Entrega (Opcional)</label>
                  <textarea
                    name="notasEntrega"
                    value={formData.notasEntrega}
                    onChange={handleChange}
                    placeholder="Ej: Tocar el timbre dos veces, edificio verde..."
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="form-section">
                <h3>💳 Método de Pago</h3>
                
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={formData.metodoPago === 'efectivo'}
                      onChange={handleChange}
                    />
                    <div className="payment-info">
                      <span className="payment-icon">💵</span>
                      <div>
                        <strong>Efectivo</strong>
                        <p>Paga en efectivo al recibir</p>
                      </div>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={formData.metodoPago === 'transferencia'}
                      onChange={handleChange}
                    />
                    <div className="payment-info">
                      <span className="payment-icon">🏦</span>
                      <div>
                        <strong>Transferencia Bancaria</strong>
                        <p>Realiza una transferencia</p>
                      </div>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={formData.metodoPago === 'tarjeta'}
                      onChange={handleChange}
                    />
                    <div className="payment-info">
                      <span className="payment-icon">💳</span>
                      <div>
                        <strong>Tarjeta de Crédito/Débito</strong>
                        <p>Pago con tarjeta</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" className="submit-order-btn">
                Confirmar Pedido - ${finalTotal.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Columna Derecha - Resumen */}
          <div className="checkout-summary-section">
            <div className="summary-box">
              <h3>Resumen del Pedido</h3>
              
              <div className="summary-items">
                {items.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="item-emoji">{item.image}</span>
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-quantity">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Envío:</span>
                  <span>${deliveryCost.toFixed(2)}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="delivery-info">
                <p>🚚 Entrega estimada: 1-2 días hábiles</p>
                <p>✅ Productos 100% frescos garantizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
// src/components/Checkout.js - CÓDIGO COMPLETO
import React, { useState } from 'react';
import api from '../services/api';
import './Checkout.css';

function Checkout({ cart = [], getCartTotal, clearCart, onNavigate }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    direccion: user?.direccion?.direccion || '',
    ciudad: user?.direccion?.ciudad || '',
    provincia: user?.direccion?.provincia || '',
    telefono: user?.telefono || '',
    metodoPago: 'efectivo'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({
          producto: item.id,
          nombre: item.name,
          cantidad: item.quantity,
          precio: item.price,
          unit: item.unit
        })),
        subtotal: getCartTotal(),
        costoEnvio: 3.00,
        total: getCartTotal() + 3.00,
        direccionEntrega: {
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          provincia: formData.provincia,
          telefono: formData.telefono
        },
        metodoPago: formData.metodoPago
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        alert('✅ ¡Orden creada exitosamente! Número de orden: ' + response.data.orden.numeroOrden);
        clearCart();
        onNavigate('profile');
      }
    } catch (err) {
      console.error('Error al crear orden:', err);
      setError(err.response?.data?.message || 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-empty">
            <h2>No hay productos en el carrito</h2>
            <button className="btn-shop" onClick={() => onNavigate('home')}>
              Ir de Compras
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">💳 Finalizar Compra</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h2>📍 Dirección de Entrega</h2>
                
                <div className="form-group">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Calle, número, sector"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                      placeholder="Ciudad"
                    />
                  </div>

                  <div className="form-group">
                    <label>Provincia *</label>
                    <input
                      type="text"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      required
                      placeholder="Provincia"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Teléfono de Contacto *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    placeholder="0999999999"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>💵 Método de Pago</h2>
                
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={formData.metodoPago === 'efectivo'}
                      onChange={handleChange}
                    />
                    <span>💵 Efectivo (Pago contra entrega)</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={formData.metodoPago === 'transferencia'}
                      onChange={handleChange}
                    />
                    <span>🏦 Transferencia Bancaria</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={formData.metodoPago === 'tarjeta'}
                      onChange={handleChange}
                    />
                    <span>💳 Tarjeta de Crédito/Débito</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-order-btn"
                disabled={loading}
              >
                {loading ? 'Procesando...' : '✅ Confirmar Pedido'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h2>📦 Resumen del Pedido</h2>

            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span className="item-emoji">
                    {item.image && item.image.startsWith('/uploads') ? (
                      <img 
                        src={`http://localhost:5000${item.image}`} 
                        alt={item.name}
                      />
                    ) : (
                      <span>{item.image}</span>
                    )}
                  </span>
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">{item.quantity} {item.unit}</p>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Envío:</span>
                <span>$3.00</span>
              </div>

              <div className="summary-row total">
                <span>Total a Pagar:</span>
                <span>${(getCartTotal() + 3.00).toFixed(2)}</span>
              </div>
            </div>

            <div className="delivery-info">
              <p>🚚 Entrega en 24-48 horas</p>
              <p>📞 Te contactaremos para confirmar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
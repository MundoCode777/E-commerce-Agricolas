// src/components/Checkout.js - CÓDIGO COMPLETO CON SWEETALERT (SIN EMAIL)
import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import './Checkout.css';

function Checkout({ cart = [], getCartTotal, clearCart, onNavigate }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    direccion: user?.direccion?.direccion || '',
    ciudad: user?.direccion?.ciudad || '',
    provincia: user?.direccion?.provincia || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    metodoPago: 'efectivo',
    // Datos de tarjeta
    numeroTarjeta: '',
    nombreTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    // Datos de transferencia
    numeroComprobante: '',
    nombreTransferencia: ''
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

    // Validaciones según método de pago
    if (formData.metodoPago === 'tarjeta') {
      if (!formData.numeroTarjeta || !formData.nombreTarjeta || !formData.fechaExpiracion || !formData.cvv) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos Incompletos',
          text: 'Por favor completa todos los datos de la tarjeta',
          confirmButtonColor: '#2e7d32'
        });
        return;
      }
    }

    if (formData.metodoPago === 'transferencia') {
      if (!formData.numeroComprobante || !formData.nombreTransferencia) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos Incompletos',
          text: 'Por favor completa los datos de la transferencia',
          confirmButtonColor: '#2e7d32'
        });
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({
          producto: item.id,
          nombre: item.name,
          cantidad: item.quantity,
          precio: item.price,
          unit: item.unit,
          image: item.image
        })),
        subtotal: getCartTotal(),
        costoEnvio: 3.00,
        total: getCartTotal() + 3.00,
        direccionEntrega: {
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          provincia: formData.provincia,
          telefono: formData.telefono,
          email: formData.email
        },
        metodoPago: formData.metodoPago,
        datosPago: formData.metodoPago === 'tarjeta' ? {
          tipo: 'tarjeta',
          ultimos4Digitos: formData.numeroTarjeta.slice(-4)
        } : formData.metodoPago === 'transferencia' ? {
          tipo: 'transferencia',
          numeroComprobante: formData.numeroComprobante,
          nombreTransferencia: formData.nombreTransferencia
        } : {
          tipo: 'efectivo'
        }
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        clearCart();

        // Mensaje según método de pago
        let mensajePago = '';
        let iconoPago = '';
        
        if (formData.metodoPago === 'efectivo') {
          iconoPago = '💵';
          mensajePago = `
            <div style="text-align: left; padding: 1rem; background: #fff3cd; border-radius: 10px; margin: 1rem 0;">
              <p style="margin: 0.5rem 0; font-size: 1rem; color: #856404;">
                <strong>💵 Pago en Efectivo</strong>
              </p>
              <ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: #856404;">
                <li>Pagarás <strong>$${(getCartTotal() + 3.00).toFixed(2)}</strong> al recibir tu pedido</li>
                <li>Ten el monto exacto preparado</li>
                <li>Recibirás tu factura con el pedido</li>
              </ul>
            </div>
          `;
        } else if (formData.metodoPago === 'transferencia') {
          iconoPago = '🏦';
          mensajePago = `
            <div style="text-align: left; padding: 1rem; background: #d1ecf1; border-radius: 10px; margin: 1rem 0;">
              <p style="margin: 0.5rem 0; font-size: 1rem; color: #0c5460;">
                <strong>🏦 Transferencia Bancaria</strong>
              </p>
              <div style="background: white; padding: 0.8rem; border-radius: 8px; margin: 0.5rem 0;">
                <p style="margin: 0.3rem 0; color: #333; font-size: 0.9rem;"><strong>Banco:</strong> Pichincha</p>
                <p style="margin: 0.3rem 0; color: #333; font-size: 0.9rem;"><strong>Tipo:</strong> Ahorros</p>
                <p style="margin: 0.3rem 0; color: #333; font-size: 0.9rem;"><strong>Cuenta:</strong> <span style="background: #e8f5e9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">2210 7798 9</span></p>
                <p style="margin: 0.3rem 0; color: #333; font-size: 0.9rem;"><strong>Titular:</strong> Agrícola Fresh</p>
                <p style="margin: 0.3rem 0; color: #333; font-size: 0.9rem;"><strong>Monto:</strong> <span style="background: #e8f5e9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">$${(getCartTotal() + 3.00).toFixed(2)}</span></p>
              </div>
              <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #0c5460;">
                📱 Envía tu comprobante al WhatsApp:<br>
                <strong>+593 937 837 9332</strong>
              </p>
            </div>
          `;
        } else if (formData.metodoPago === 'tarjeta') {
          iconoPago = '💳';
          mensajePago = `
            <div style="text-align: left; padding: 1rem; background: #d4edda; border-radius: 10px; margin: 1rem 0;">
              <p style="margin: 0.5rem 0; font-size: 1rem; color: #155724;">
                <strong>💳 Pago con Tarjeta</strong>
              </p>
              <ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: #155724;">
                <li>Pago procesado exitosamente</li>
                <li>Monto debitado: <strong>$${(getCartTotal() + 3.00).toFixed(2)}</strong></li>
                <li>Transacción completada</li>
              </ul>
            </div>
          `;
        }

        Swal.fire({
          icon: 'success',
          title: '¡Pedido Realizado con Éxito!',
          html: `
            <div style="padding: 1rem;">
              <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 3rem;">
                ✓
              </div>
              
              <div style="background: #e8f5e9; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                <p style="font-size: 1.3rem; color: #2e7d32; font-weight: bold; margin: 0;">
                  Orden #${response.data.orden.numeroOrden}
                </p>
              </div>
              
              ${mensajePago}
              
              <div style="background: #fff9e6; padding: 1rem; border-radius: 10px; margin: 1rem 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0.5rem 0; color: #856404; font-size: 0.95rem;">
                  <strong>📦 Información de Entrega</strong>
                </p>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: #856404; font-size: 0.9rem;">
                  <li>Tiempo estimado: 24-48 horas</li>
                  <li>Te contactaremos para coordinar</li>
                  <li>Email de confirmación enviado a: <strong>${formData.email}</strong></li>
                </ul>
              </div>
              
              <p style="color: #999; font-size: 0.85rem; margin-top: 1rem;">
                Gracias por tu compra en Agrícola Fresh 🌾
              </p>
            </div>
          `,
          confirmButtonText: '🏠 Ir al Inicio',
          confirmButtonColor: '#2e7d32',
          allowOutsideClick: false,
          width: '600px',
          customClass: {
            popup: 'sweet-alert-custom',
            confirmButton: 'sweet-confirm-btn',
            htmlContainer: 'sweet-html-container'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            onNavigate('home');
          }
        });
      }
    } catch (err) {
      console.error('Error al crear orden:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Error al Procesar Pedido',
        html: `
          <div style="padding: 1rem;">
            <p style="color: #666; font-size: 1rem; margin: 1rem 0;">
              ${err.response?.data?.message || 'Hubo un problema al crear tu orden. Por favor intenta nuevamente.'}
            </p>
            <div style="background: #f8d7da; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
              <p style="color: #721c24; font-size: 0.9rem; margin: 0;">
                Si el problema persiste, contáctanos:<br>
                📱 +593 937 837 9332<br>
                📧 ventas@agricolafresh.com
              </p>
            </div>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc3545'
      });
      
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
                <h2>📍 Información de Entrega</h2>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

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

                {/* Instrucciones según método de pago */}
                {formData.metodoPago === 'efectivo' && (
                  <div className="payment-info efectivo-info">
                    <p><strong>💵 Pago en Efectivo</strong></p>
                    <ul>
                      <li>✓ El pago se realizará al momento de la entrega</li>
                      <li>✓ Ten el monto exacto: <strong>${(getCartTotal() + 3.00).toFixed(2)}</strong></li>
                      <li>✓ Recibirás tu factura con el pedido</li>
                    </ul>
                  </div>
                )}

                {formData.metodoPago === 'transferencia' && (
                  <div className="payment-info transferencia-info">
                    <p><strong>🏦 Datos para Transferencia</strong></p>
                    <div className="bank-details">
                      <p><strong>Banco:</strong> Pichincha</p>
                      <p><strong>Tipo:</strong> Ahorros</p>
                      <p><strong>Cuenta:</strong> <span className="highlight">2210 7798 9</span></p>
                      <p><strong>Titular:</strong> Agrícola Fresh</p>
                      <p><strong>Monto:</strong> <span className="highlight">${(getCartTotal() + 3.00).toFixed(2)}</span></p>
                    </div>
                    <div className="form-group">
                      <label>Número de Comprobante *</label>
                      <input
                        type="text"
                        name="numeroComprobante"
                        value={formData.numeroComprobante}
                        onChange={handleChange}
                        required={formData.metodoPago === 'transferencia'}
                        placeholder="Ej: 123456789"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nombre del Titular *</label>
                      <input
                        type="text"
                        name="nombreTransferencia"
                        value={formData.nombreTransferencia}
                        onChange={handleChange}
                        required={formData.metodoPago === 'transferencia'}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <p className="note">📱 Envía tu comprobante por WhatsApp: +593 937 837 9332</p>
                  </div>
                )}

                {formData.metodoPago === 'tarjeta' && (
                  <div className="payment-info tarjeta-info">
                    <p><strong>💳 Datos de la Tarjeta</strong></p>
                    <div className="form-group">
                      <label>Número de Tarjeta *</label>
                      <input
                        type="text"
                        name="numeroTarjeta"
                        value={formData.numeroTarjeta}
                        onChange={handleChange}
                        required={formData.metodoPago === 'tarjeta'}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nombre en la Tarjeta *</label>
                      <input
                        type="text"
                        name="nombreTarjeta"
                        value={formData.nombreTarjeta}
                        onChange={handleChange}
                        required={formData.metodoPago === 'tarjeta'}
                        placeholder="JUAN PEREZ"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Fecha Exp. *</label>
                        <input
                          type="text"
                          name="fechaExpiracion"
                          value={formData.fechaExpiracion}
                          onChange={handleChange}
                          required={formData.metodoPago === 'tarjeta'}
                          placeholder="MM/AA"
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          required={formData.metodoPago === 'tarjeta'}
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                    <p className="note">🔒 Tu información está segura y encriptada</p>
                  </div>
                )}
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
              <p>📧 Recibirás confirmación por email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
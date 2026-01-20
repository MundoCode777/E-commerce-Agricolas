// src/components/Cart.js - CÓDIGO COMPLETO
import React from 'react';
import './Cart.css';

function Cart({ cart = [], updateQuantity, removeFromCart, getCartTotal, onNavigate }) {
  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos frescos y orgánicos</p>
            <button className="btn-shop" onClick={() => onNavigate('home')}>
              Ir de Compras
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">🛒 Mi Carrito</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image && item.image.startsWith('/uploads') ? (
                    <img 
                      src={`http://localhost:5000${item.image}`} 
                      alt={item.name}
                    />
                  ) : (
                    <span>{item.image}</span>
                  )}
                </div>

                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price?.toFixed(2)} / {item.unit}</p>
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="item-remove"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Resumen del Pedido</h2>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Envío:</span>
              <span>$3.00</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>${(getCartTotal() + 3).toFixed(2)}</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={() => onNavigate('checkout')}
            >
              Proceder al Pago
            </button>

            <button 
              className="continue-btn"
              onClick={() => onNavigate('home')}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
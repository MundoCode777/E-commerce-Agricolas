// src/components/ProductCard.js - CÓDIGO COMPLETO
import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, onViewDetails }) {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="product-card" onClick={() => onViewDetails(product.id)}>
      <div className="product-card-badge">Fresco</div>
      
      <div className="product-card-image">
        {product.image && product.image.startsWith('/uploads') ? (
          <img 
            src={`http://localhost:5000${product.image}`} 
            alt={product.name}
          />
        ) : (
          <span className="product-emoji">{product.image || '📦'}</span>
        )}
      </div>

      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>

        <div className="product-card-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star} 
                className={star <= Math.round(product.calificacionPromedio || 0) ? 'star filled' : 'star'}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-text">
            {(product.calificacionPromedio || 0).toFixed(1)} ({product.numeroReviews || 0})
          </span>
        </div>

        <div className="product-card-footer">
          <div className="product-price">
            <span className="price-amount">${product.price?.toFixed(2)}</span>
            <span className="price-unit">/ {product.unit}</span>
          </div>

          {product.disponible ? (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              🛒 Agregar
            </button>
          ) : (
            <button className="out-of-stock-btn" disabled>
              Agotado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
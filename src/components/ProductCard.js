// src/components/ProductCard.js
import React, { useState } from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, onViewDetails }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleViewDetails = () => {
    onViewDetails(product.id);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < Math.round(rating) ? 'star-small filled' : 'star-small'}>
        ★
      </span>
    ));
  };

  return (
    <div className="product-card" onClick={handleViewDetails}>
      <div className="product-image">
        <span className="product-emoji">{product.image}</span>
        {product.disponible ? (
          <span className="product-badge">Fresco</span>
        ) : (
          <span className="product-badge out-of-stock">Agotado</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {product.numeroReviews > 0 && (
          <div className="product-rating">
            <div className="stars-container">
              {renderStars(product.calificacionPromedio)}
            </div>
            <span className="rating-text">
              {product.calificacionPromedio.toFixed(1)} ({product.numeroReviews})
            </span>
          </div>
        )}
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="price-amount">${product.price.toFixed(2)}</span>
            <span className="price-unit">/{product.unit}</span>
          </div>
          
          <div className="product-actions-card">
            <button 
              className="view-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              👁️ Ver
            </button>
            
            {product.disponible && (
              <button 
                className={`add-button ${isAdded ? 'added' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                {isAdded ? '✓' : '+'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
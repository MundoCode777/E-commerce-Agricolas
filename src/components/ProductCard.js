// src/components/ProductCard.js
import React, { useState } from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <span className="product-emoji">{product.image}</span>
        <span className="product-badge">Fresco</span>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="price-amount">${product.price.toFixed(2)}</span>
            <span className="price-unit">/{product.unit}</span>
          </div>
          
          <button 
            className={`add-button ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {isAdded ? '✓ Agregado' : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;